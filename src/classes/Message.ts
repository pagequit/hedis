export default class Message {
	id: string;
	channel: string;
	username: string;
	content: string;
	timestamp: number;

	constructor(id: string, channel: string, username: string, content: string, timestamp: number) {
		this.id = id;
		this.channel = channel;
		this.username = username;
		this.content = content;
		this.timestamp = timestamp;
	}
}
