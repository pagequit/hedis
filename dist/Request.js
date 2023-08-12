"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class Request {
    constructor(uuid, requester, data, hedis) {
        this.uuid = uuid;
        this.requester = requester;
        this.data = data;
        this.hedis = hedis;
    }
    respond(data) {
        this.hedis.pub(this.requester, JSON.stringify({ uuid: this.uuid, data }), Message_1.MessageType.RES);
    }
}
exports.default = Request;
//# sourceMappingURL=Request.js.map