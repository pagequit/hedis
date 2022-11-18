import Hedis from '#src/Hedis';
import { Message, MessageHead, MessageType, MessageRegex } from '#src/Message';
import Option, { None } from '#src/unwrap/option';

export default class Channel {
	name: string;
	hedis: Hedis;

	constructor(hedis: Hedis, name: string) {
		this.hedis = hedis;
		this.name = name;
	}

	// async syn(): Promise<Result<string, string>> {
	// 	const id = Date.now().toString(16);

	// 	const res = await this.hedis.client.publish(this.name, MessageType.SYN + id)
	// 		.then(() => Ok(id) as Result<string, string>)
	// 		.catch((e) => Err(e) as Result<string, string>);

	// 	return this.connection;
	// }

	// async post() {
	// 	// new Post();
	// }

	// async request() {
	// 	// new Request();
	// }

	// async send(request: Request): Promise<Result<Response, Error>> {
	// 	return ;
	// }

	private async pub(content: string): Promise<number> {
		const { prefix, name: author } = this.hedis;
		const ts = Date.now();
		const id = await this.hedis.client.INCR(`${prefix}:${this.name}:last_message_id`)
			.then((id) => id.toString());

		await this.hedis.client.HSET(`${prefix}:${this.name}:${id}`, ['author', author, 'content', content, 'ts', ts]);
		await this.hedis.client.ZADD(`${prefix}:${this.name}`, { score: ts, value: id });
		// @ts-expect-error: TIDYUP does not exist on type (but it does)
		await this.hedis.client.TIDYUP(`${prefix}:${this.name}`);

		const head: MessageHead = {
			id,
			author,
			channel: this.name,
			ts,
		};
		const message = JSON.stringify({ head, content });

		return this.hedis.client.publish(this.name, message);
	}

	async sub(callback: (message: Message) => void): Promise<void> {
		return this.hedis.subscriber.subscribe(this.name, async (rawMessage) => {
			const match = rawMessage.match(MessageRegex);
			if (!match) {
				return; // ignore messages with unknown schema
			}

			const type = match[0];
			const index = match[0].length;
			const message: Option<Message> = None();

			try {
				const { head, content } = JSON.parse(rawMessage.slice(index));
				message.insert({
					type: type as MessageType,
					head,
					body: content,
				});
			}
			catch (error) {
				return console.error(error);
			}

			return callback(message.unwrap());
		});
	}
}
