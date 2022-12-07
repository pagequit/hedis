import Hedis from './Hedis';
import { MessageType } from './Message';

export default class Request {
	uuid: string;
	requester: string;
	data: string;
	hedis: Hedis;

	constructor(uuid: string, requester: string, data: string, hedis: Hedis) {
		this.uuid = uuid;
		this.requester = requester;
		this.data = data;
		this.hedis = hedis;
	}

	respond(data: string) {
		this.hedis.pub(this.requester, JSON.stringify({ uuid: this.uuid, data }), MessageType.RES);
	}
}

export type RequestType = {
	uuid: string;
	data: string;
};
