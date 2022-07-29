import Hedis from '../Hedis';
import Message from '../classes/Message';
export default class Channel {
    name: string;
    hedis: Hedis;
    schema: string;
    constructor(hedis: Hedis, name: string);
    pub(content: string): Promise<number>;
    sub(callbackfn: (message: Message) => void): Promise<void>;
}
