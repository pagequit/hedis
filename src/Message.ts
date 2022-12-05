export const MessageRegex = '^HED:([A-Z]{3})#';

export enum MessageType {
	MSG = 'HED:MSG#', // default
	REQ = 'HED:REQ#',
	RES = 'HED:RES#',
}

export type Message = {
	type: MessageType,
	id: string,
	author: string,
	channel: string,
	ts: number,
	content: string,
};
