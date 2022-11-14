"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(hedis, id, channel, author, content, ts) {
        this.hedis = hedis;
        this.id = id;
        this.channel = channel;
        this.author = author;
        this.content = content;
        this.ts = ts;
    }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map