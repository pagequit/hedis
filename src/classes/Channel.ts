import Hedis from '../Hedis';
import Message from '../classes/Message';

export default class Channel {
	name: string;
	hedis: Hedis;
	schema: string;

	constructor(hedis: Hedis, name: string) {
		this.hedis = hedis;
		this.name = name;
		this.schema = 'HEDIS:JSON#';
	}

	async pub(content: string): Promise<number> {
		const { prefix } = this.hedis;
		const { username } = this.hedis;

		const timestamp = Date.now();
		const id = await this.hedis.client.INCR(`${prefix}:${this.name}:last_message_id`);

		await this.hedis.client.HSET(`${prefix}:${this.name}:last_message:${id}`, ['username', username, 'content', content, 'timestamp', timestamp]);
		await this.hedis.client.ZADD(`${prefix}:${this.name}`, { score: timestamp, value: id.toString() });

		return this.hedis.client.publish(this.name, this.schema + JSON.stringify({ id, username, content, timestamp }));
	}

	async sub(callbackfn: (message: Message) => void): Promise<void> {
		return this.hedis.subscriber.subscribe(this.name, rawMessage => {
			if (!rawMessage.startsWith(this.schema)) {
				return; // ignore messages with unknown schema
			}

			try {
				const { id, username, content, timestamp } = JSON.parse(rawMessage.slice(this.schema.length));
				if (!id || !username || !content || !timestamp) {
					throw new Error('1640784339243');
				}
				const message = new Message(id, this.name, username, content, timestamp);
				callbackfn(message);
			}
			catch (error) {
				console.error(error);
			}
		});
	}
}
