import * as Events from 'node:events';
import { createClient } from 'redis';
import { HedisConfig } from '../hedis.config';
import Channel from './classes/Channel';

export default class Hedis extends Events {
	config: HedisConfig;
	client: ReturnType<typeof createClient>;
	subscriber: ReturnType<typeof createClient>;

	constructor(config: HedisConfig) {
		super();
		this.config = config;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.client = createClient(config.clientOptions!);
		this.subscriber = this.client.duplicate();
	}

	async connect(): Promise<Hedis> {
		await this.client.connect();
		await this.subscriber.connect();

		this.emit('ready', this);

		return this;
	}

	async getChannel(name: string): Promise<Channel> {
		const { prefix } = this.config;
		await this.client.SADD(`${prefix}:channels`, name);

		return new Channel(this, name);
	}
}
