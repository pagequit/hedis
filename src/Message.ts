export const MessageRegex = '^HED:([A-Z]{3})#';

export enum MessageType {
	SYN = 'HED:SYN#',
	ACK = 'HED:ACK#',
	REQ = 'HED:REQ#',
	PST = 'HED:PST#',
}

export type MessageHandler = (callback: (message: Message) => void, message: Message) => void;

export type MessageHead = {
	id: string,
	author: string,
	channel: string,
	ts: number,
};

export type Message = {
	type: MessageType,
	head: MessageHead,
	body: string,
};
