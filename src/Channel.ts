import Hedis from '#src/Hedis';
import Message from '#src/Message';
import { Command, Handler } from '#src/Command';
import { ACK, MSG, SYN } from '#src/handler';
import OMap from '#src/unwrap/OMap';

export default class Channel {
	name: string;
	hedis: Hedis;
	schema: string;
	commands: OMap<Command, Handler>;

	constructor(hedis: Hedis, name: string) {
		this.hedis = hedis;
		this.name = name;
		this.schema = 'HEDIS:JSON#';
		this.commands = new OMap([
			[Command.ACK, ACK],
			[Command.MSG, MSG],
			[Command.SYN, SYN],
		]);
	}

	async pub(content: string): Promise<number> {
		const { prefix, name } = this.hedis;
		const ts = Date.now();
		const id = await this.hedis.client.INCR(`${prefix}:${this.name}:last_message_id`);

		await this.hedis.client.HSET(`${prefix}:${this.name}:${id}`, ['name', name, 'content', content, 'ts', ts]);
		await this.hedis.client.ZADD(`${prefix}:${this.name}`, { score: ts, value: id.toString() });
		// @ts-expect-error: TIDYUP does not exist on type (but it does)
		await this.hedis.client.TIDYUP(`${prefix}:${this.name}`);

		return this.hedis.client.publish(this.name, this.schema + JSON.stringify({ id, name, content, ts }));
	}

	async sub(callbackfn: (message: Message) => void): Promise<void> {
		return this.hedis.subscriber.subscribe(this.name, rawMessage => {
			// match(rawMessage.match(Command.REGEX), {
			// 	[Command.ACK]: ACK,
			// 	[Command.MSG]: MSG,
			// 	[Command.SYN]: SYN,
			// });


			if (!rawMessage.startsWith(this.schema)) {
				return; // ignore messages with unknown schema
			}

			try {
				const { id, name, content, ts } = JSON.parse(rawMessage.slice(this.schema.length));
				if (id === undefined || name === undefined || content === undefined || ts === undefined) {
					throw new Error('1640784339243');
				}
				const message = new Message(this.hedis, id, this.name, name, content, ts);
				callbackfn(message);
			}
			catch (error) {
				console.error(error);
			}
		});
	}
}
