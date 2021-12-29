export default class Message {
	id: string;
	channel: string;
	content: string;
	timestamp: number;

	constructor(id: string, channel: string, content: string, timestamp: number) {
		this.id = id;
		this.channel = channel;
		this.content = content;
		this.timestamp = timestamp;
	}
}
