import Hedis from './Hedis';
export default class Request {
    uuid: string;
    requester: string;
    data: string;
    hedis: Hedis;
    constructor(uuid: string, requester: string, data: string, hedis: Hedis);
    respond(data: string): void;
}
export declare type RequestType = {
    uuid: string;
    data: string;
};
