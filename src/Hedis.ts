import * as Events from 'node:events';
import {
	createClient,
	RedisClientOptions,
	RedisFunctions,
	RedisModules,
	RedisScripts
} from 'redis';
import Channel from '#src/Channel';
import Connection from '#src/Connection';
import OMap from '#src/unwrap/OMap';
import Result, { Err, Ok } from '#src/unwrap/result';
import TIDYUP from '#src/scripts/tidyUp';

export default class Hedis extends Events {
	name: string;
	prefix: string;
	client: ReturnType<typeof createClient>;
	subscriber: ReturnType<typeof createClient>;
	channel: Channel;
	connections: OMap<string, Channel>;

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

		this.connections = new OMap();
	}

	async connect(): Promise<Channel> {
		await this.client.connect();
		await this.subscriber.connect();

		// yes I'm aware of the potential channel collisions here
		const channel = await this.createChannel(this.name);
		this.channel = channel;

		channel.sub(message => {
			this.emit('message', message);
		});

		this.emit('ready', channel);

		return channel;
	}

	async createChannel(name: string): Promise<Channel> {
		await this.client.SADD(`${this.prefix}:channels`, name);

		return new Channel(this, name);
	}

	async connectToClient(name: string): Promise<Result<Connection, string>> {
		const con = new Connection(this, name);
		const res = await con.syn();

		this.connections.set(name, );

	}
}
