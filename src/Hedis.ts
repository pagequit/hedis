import * as Events from 'node:events';
import {
	createClient,
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts
} from 'redis';
import Option, { Some, None } from '#src/unwrap/option';
import Result, { Err, Ok } from '#src/unwrap/result';
import { Message, MessageHead, MessageType, MessageRegex } from '#src/Message';
import TIDYUP from '#src/scripts/tidyUp';
import OMap from '#src/unwrap/OMap';

export default class Hedis extends Events {
	name: string;
	prefix: string;
	client: ReturnType<typeof createClient>;
	subscriber: ReturnType<typeof createClient>;
	requestListener: (req: Request, res: Response) => void;

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
	}

	async init(): Promise<Hedis> {
		await this.client.connect();
		await this.subscriber.connect();
		await this.registerChannel(this.name);

		this.sub(this.name, async (message) => {
			switch (message.type) {
				case MessageType.REQ: {

					const response = new Response(this.pub.bind(this), message);

					const { id, head, body } = JSON.parse(message.content);
					const request = new Request(id, head, body); // ehm new Response?

					this.requestListener(request, response);

					break;
				}
				case MessageType.RES: {
					const { prefix, name } = this;
					const { id, head, body } = JSON.parse(message.content);
					if ((await this.client.SREM(`${prefix}:${name}:requests`, id)) > 0) {
						this.emit(id, { head, body });
					}

					break;
				}
			}

			this.emit('message', message);
		});

		this.emit('ready', this); // not sure if that's really a good practice

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

		const head: MessageHead = { id, author, channel: channel,	ts };
		const message = type + JSON.stringify({ head, content });

		return this.client.publish(channel, message);
	}

	async sub(channel: string, callback: (message: Message) => void): Promise<void> {
		return this.subscriber.subscribe(channel, async (rawMessage) => {
			const match = rawMessage.match(MessageRegex);
			if (!match) {
				return; // ignore messages with unknown schema
			}

			const type = match[0];
			const index = match[0].length;
			const message: Option<Message> = None();

			try {
				const { head, content } = JSON.parse(rawMessage.slice(index));
				message.insert({ type: type as MessageType, head, content });
			}
			catch (error) {
				return console.error(error);
			}

			return callback(message.unwrap());
		});
	}

	async post(channel: string, content: string): Promise<number> {
		return this.pub(channel, content, MessageType.MSG);
	}

	async registerChannel(name: string): Promise<number> {
		return await this.client.SADD(`${this.prefix}:channels`, name);
	}

	async request(channel: string, payload: string): Promise<void> {
		const id = Date.now().toString(16);
		const { prefix, name } = this;
		await this.client.SADD(`${prefix}:${name}:requests`, id);

		await this.pub(channel, new Request(id, 'head', payload).toString(), MessageType.REQ);

		return new Promise((resolve, reject) => {
			this.once(id, resolve);
			setTimeout(() => {
				this.client.SREM(`${prefix}:${name}:requests`, id)
					.then(reject);
			}, 10);
		});
	}

	listen(callback: (req: Request, res: Response) => void) {
		this.requestListener = callback;
	}
}

class Response {
	value: string;
	message: Message;
	callback: (channel: string, content: string, type: MessageType) => Promise<number>;

	constructor(
		callback: (channel: string, content: string, type: MessageType) => Promise<number>,
		message: Message,
		value?: string
	) {
		this.callback = callback;
		this.message = message;
		this.value = value ?? '';
	}

	end(value?: string) {
		const request_WIP = new Request(JSON.parse(this.message.content).id, 'head', value ?? this.value);
		this.callback(this.message.head.author, request_WIP.toString(), MessageType.RES);
	}
}

class Request {
	id: string; // FIXME name is confusing
	head: string;
	body: string;

	constructor(id: string, head: string, body: string) {
		this.id = id;
		this.head = head;
		this.body = body;
	}

	toString() {
		return JSON.stringify(this);
	}
}
