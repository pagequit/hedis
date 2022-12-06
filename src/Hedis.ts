import * as Events from 'node:events';
import { randomUUID } from 'node:crypto';
import {
	createClient,
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts
} from 'redis';
import RJSON from '#src/unwrap/RJSON';
import { Message, MessageType, MessageRegex } from '#src/Message';
import Request, { RequestType } from '#src/Request';
import TIDYUP from '#src/scripts/tidyUp';

export default class Hedis extends Events {
	name: string;
	prefix: string;
	client: ReturnType<typeof createClient>;
	subscriber: ReturnType<typeof createClient>;
	requests: Map<string, number>;
	handleRequest: (request: Request) => void;

	constructor(name: string, prefix: string, clientOptions?: RedisClientOptions<RedisModules, RedisFunctions>) {
		super();
		this.name = name;
		this.prefix = prefix;

		this.client = createClient({
			scripts: <RedisScripts> {
				TIDYUP,
			},
			...clientOptions
		});
		this.subscriber = createClient(clientOptions);

		this.requests = new Map();
	}

	async init(): Promise<Hedis> {
		await this.client.connect();
		await this.subscriber.connect();
		await this.registerChannel(this.name);

		this.sub(this.name, async (message) => {
			switch (message.type) {
				case MessageType.REQ: {
					const request = RJSON.parse<RequestType>(message.content);
					if (request.isErr()) {
						console.error(request.unwrapErr());
						break;
					}

					const { uuid, data } = request.unwrap();
					this.handleRequest(new Request(uuid, message.author, data, this));

					break;
				}
				case MessageType.RES: {
					const response = RJSON.parse<RequestType>(message.content);
					if (response.isErr()) {
						console.error(response.unwrapErr());
						break;
					}

					const { uuid, data } = response.unwrap();
					if (this.requests.delete(uuid)) {
						this.emit(uuid, data);
					}

					break;
				}
				case MessageType.MSG:
				default: {
					this.emit('message', message);
				}
			}
		});

		this.emit('ready', this);

		return this;
	}

	async pub(channel: string, content: string, type: MessageType): Promise<number> {
		const { prefix, name: author } = this;
		const ts = Date.now();
		const id = await this.client.INCR(`${prefix}:${channel}:last_message_id`)
			.then((id) => id.toString());

		await this.client.HSET(`${prefix}:${channel}:${id}`, ['author', author, 'content', content, 'ts', ts]);
		await this.client.ZADD(`${prefix}:${channel}`, { score: ts, value: id });
		// @ts-expect-error: TIDYUP does not exist on type (but it does)
		await this.client.TIDYUP(`${prefix}:${channel}`);

		const message = RJSON.stringify<Message>({ type, id, author, channel, ts, content });
		if (message.isErr()) {
			console.error(message.unwrapErr());
			return 0;
		}

		return this.client.publish(channel, type + message.unwrap());
	}

	sub(channel: string, callback: (message: Message) => void): Promise<void> {
		return this.subscriber.subscribe(channel, (rawMessage) => {
			const match = rawMessage.match(MessageRegex);
			if (!match) {
				return; // ignore messages with unknown schema
			}

			const index = match[0].length;
			const message = RJSON.parse<Message>(rawMessage.slice(index));
			if (message.isErr()) {
				return console.error(message.unwrapErr());
			}

			return callback(message.unwrap());
		});
	}

	post(channel: string, content: string): Promise<number> {
		return this.pub(channel, content, MessageType.MSG);
	}

	async registerChannel(name: string): Promise<number> {
		return await this.client.SADD(`${this.prefix}:channels`, name);
	}

	request(channel: string, data: string, timeout = 30000): Promise<string> {
		return new Promise((resolve, reject) => {
			const uuid = randomUUID();
			this.requests.set(uuid, Date.now());

			const content = RJSON.stringify<RequestType>({ uuid, data });
			if (content.isErr()) {
				reject(content.unwrapErr());
			}

			this.pub(channel, content.unwrap(), MessageType.REQ);
			this.once(uuid, resolve);
			setTimeout(() => {
				this.requests.delete(uuid);
				reject('Request expired.');
			}, timeout);
		});
	}

	listen(requestHandler: (request: Request) => void) {
		this.handleRequest = requestHandler;
	}
}
