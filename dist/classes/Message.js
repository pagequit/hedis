"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(hedis, id, channel, username, content, timestamp) {
        this.id = id;
        this.channel = channel;
        this.username = username;
        this.content = content;
        this.timestamp = timestamp;
        this.hedis = hedis;
    }
    async reply(content) {
        const channel = await this.hedis.getChannel(this.username);
        return channel.pub(content);
    }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map