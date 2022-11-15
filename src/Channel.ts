import Hedis from '#src/Hedis';
import Message from '#src/Message';
import { Command, Handler } from '#src/Command';
import { ACK, MSG, SYN } from '#src/handler';
import OMap from '#src/unwrap/OMap';
import Result from '#src/unwrap/result';

export default class Channel {
	name: string;
	hedis: Hedis;
	commands: OMap<Command, Handler>;

	constructor(hedis: Hedis, name: string) {
		this.hedis = hedis;
		this.name = name;
		this.commands = new OMap([
			[Command.ACK, ACK],
			[Command.MSG, MSG],
			[Command.SYN, SYN],
		]);
	}

	async pub(command: Command, body: string): Promise<number> {
		const { prefix, name } = this.hedis;
		const ts = Date.now();
		const id = await this.hedis.client.INCR(`${prefix}:${this.name}:last_message_id`);

		await this.hedis.client.HSET(`${prefix}:${this.name}:${id}`, ['name', name, 'body', body, 'ts', ts]);
		await this.hedis.client.ZADD(`${prefix}:${this.name}`, { score: ts, value: id.toString() });
		// @ts-expect-error: TIDYUP does not exist on type (but it does)
		await this.hedis.client.TIDYUP(`${prefix}:${this.name}`);

		return this.hedis.client.publish(this.name, command + JSON.stringify({ id, name, body, ts }));
	}

	async syn(): Promise<Result<string, string>> {

	}

	async sub(callback: (message: Message) => void): Promise<void> {
		return this.hedis.subscriber.subscribe(this.name, rawMessage => {

			// pleppy way
			const match = rawMessage.match(Command.REGEX);
			if (!match) {
				return;
			}

			const key = match[0];
			const index = match[0].length;

			try {
				const { id, name, body, ts } = JSON.parse(rawMessage.slice(index));
				if (id === undefined || name === undefined || body === undefined || ts === undefined) {
					throw new Error('1640784339243');
				}
				const message = new Message(this.hedis, id, this.name, name, body, ts);

				const command = this.commands.oget(key as Command);
				if (command.isNone()) {
					return console.warn('must be impossible');
				}

				command.unwrap()(callback, message);
			}
			catch (error) {
				console.error(error);
			}
		});
	}
}
