import Hedis from '#src/Hedis';

export default class Message {
	hedis: Hedis;
	id: string;
	channel: string;
	username: string;
	content: string;
	timestamp: number;

	constructor(hedis: Hedis, id: string, channel: string, username: string, content: string, timestamp: number) {
		this.id = id;
		this.channel = channel;
		this.username = username;
		this.content = content;
		this.timestamp = timestamp;
		this.hedis = hedis;
	}

	async reply(content: string): Promise<number> {
		const channel = await this.hedis.getChannel(this.username);

		return channel.pub(content);
	}
}
