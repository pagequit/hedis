"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("#src/Message");
const Command_1 = require("#src/Command");
const handler_1 = require("#src/handler");
const OMap_1 = require("#src/unwrap/OMap");
class Channel {
    constructor(hedis, name) {
        this.hedis = hedis;
        this.name = name;
        this.schema = 'HEDIS:JSON#';
        this.commands = new OMap_1.default([
            [Command_1.Command.ACK, handler_1.ACK],
            [Command_1.Command.MSG, handler_1.MSG],
            [Command_1.Command.SYN, handler_1.SYN],
        ]);
    }
    async pub(content) {
        const { prefix, name } = this.hedis;
        const ts = Date.now();
        const id = await this.hedis.client.INCR(`${prefix}:${this.name}:last_message_id`);
        await this.hedis.client.HSET(`${prefix}:${this.name}:${id}`, ['name', name, 'content', content, 'ts', ts]);
        await this.hedis.client.ZADD(`${prefix}:${this.name}`, { score: ts, value: id.toString() });
        // @ts-expect-error: TIDYUP does not exist on type (but it does)
        await this.hedis.client.TIDYUP(`${prefix}:${this.name}`);
        return this.hedis.client.publish(this.name, this.schema + JSON.stringify({ id, name, content, ts }));
    }
    async sub(callbackfn) {
        return this.hedis.subscriber.subscribe(this.name, rawMessage => {
            // match(rawMessage.match(Command.REGEX), {
            // 	[Command.ACK]: ACK,
            // 	[Command.MSG]: MSG,
            // 	[Command.SYN]: SYN,
            // });
            if (!rawMessage.startsWith(this.schema)) {
                return; // ignore messages with unknown schema
            }
            try {
                const { id, name, content, ts } = JSON.parse(rawMessage.slice(this.schema.length));
                if (id === undefined || name === undefined || content === undefined || ts === undefined) {
                    throw new Error('1640784339243');
                }
                const message = new Message_1.default(this.hedis, id, this.name, name, content, ts);
                callbackfn(message);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = Channel;
//# sourceMappingURL=Channel.js.map