export enum Command {
	ACK = 'HED:ACK#',
	MSG = 'HED:MSG#',
	SYN = 'HED:SYN#',
	REGEX = '^HED:([A-Z]{3})#',
}

export type Handler = (command: string) => void;
