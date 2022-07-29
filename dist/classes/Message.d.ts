import Hedis from '../Hedis';
export default class Message {
    hedis: Hedis;
    id: string;
    channel: string;
    username: string;
    content: string;
    timestamp: number;
    constructor(hedis: Hedis, id: string, channel: string, username: string, content: string, timestamp: number);
    reply(content: string): Promise<number>;
}
