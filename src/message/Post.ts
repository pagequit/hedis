import Hedis from '#src/Hedis';
import Channel from '#src/Channel';

export type MessageHead = {
	id: string;
	author: string,
	channel: string,
	ts: number,
};

export default class Message {
	hedis: Hedis;
	head: MessageHead;
	body: string;
	authorChannel: Channel;

	constructor(hedis: Hedis, head: MessageHead, body: string, authorChannel: Channel) {
		this.hedis = hedis;
		this.head = head;
		this.body = body;
		this.authorChannel = authorChannel;
	}

	async reply(content: string): Promise<number> {
		return this.authorChannel.pub(content);
	}
}
