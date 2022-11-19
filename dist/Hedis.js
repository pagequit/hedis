"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events = require("node:events");
const redis_1 = require("redis");
const Channel_1 = require("#src/Channel");
const OMap_1 = require("#src/unwrap/OMap");
const index_1 = require("#src/message/handler/index");
const Message_1 = require("#src/Message");
const tidyUp_1 = require("#src/scripts/tidyUp");
class Hedis extends Events {
    constructor(name, prefix, clientOptions) {
        super();
        this.name = name;
        this.prefix = prefix;
        this.client = (0, redis_1.createClient)({
            scripts: {
                TIDYUP: tidyUp_1.default,
            },
            ...clientOptions
        });
        this.subscriber = (0, redis_1.createClient)(clientOptions);
        this.channels = new OMap_1.default();
        this.handler = new OMap_1.default([
            [Message_1.MessageType.ACK, index_1.ACK],
            [Message_1.MessageType.PST, index_1.PST],
            [Message_1.MessageType.REQ, index_1.REQ],
            [Message_1.MessageType.SYN, index_1.SYN],
        ]);
    }
    async connect() {
        await this.client.connect();
        await this.subscriber.connect();
        // yes I'm aware of the potential channel collisions here
        const channel = await this.createChannel(this.name);
        this.channel = channel;
        channel.sub((message) => {
            // TODO: use handler here
            this.emit('message', message);
        });
        this.emit('ready', channel);
        return channel;
    }
    async createChannel(name) {
        await this.client.SADD(`${this.prefix}:channels`, name);
        return new Channel_1.default(this, name);
    }
}
exports.default = Hedis;
//# sourceMappingURL=Hedis.js.map