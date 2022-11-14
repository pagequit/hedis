import Hedis from '#src/Hedis';

export default class Message {
	hedis: Hedis;
	id: string;
	channel: string;
	author: string;
	content: string;
	ts: number;

	constructor(hedis: Hedis, id: string, channel: string, author: string, content: string, ts: number) {
		this.hedis = hedis;
		this.id = id;
		this.channel = channel;
		this.author = author;
		this.content = content;
		this.ts = ts;
	}

	// async reply(content: string): Promise<number> {
	// 	const channel = await this.hedis.channels.oget(this.author);
	// 	channel.

	// 	return channel.pub(content);
	// }
}
