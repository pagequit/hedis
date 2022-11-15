import Message from '#src/Message';

export enum Command {
	ACK = 'HED:ACK#',
	MSG = 'HED:MSG#',
	SYN = 'HED:SYN#',
	REGEX = '^HED:([A-Z]{3})#',
}

export type Handler = (callback: (message: Message) => void, message: Message) => void;
