"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events = require("node:events");
const redis_1 = require("redis");
const Channel_1 = require("./classes/Channel");
const tidyUp_1 = require("./scripts/tidyUp");
class Hedis extends Events {
    constructor(username, prefix, clientOptions) {
        super();
        this.username = username;
        this.prefix = prefix;
        this.client = (0, redis_1.createClient)({
            scripts: {
                TIDYUP: tidyUp_1.default,
            },
            ...clientOptions
        });
        this.subscriber = (0, redis_1.createClient)(clientOptions);
    }
    async connect() {
        await this.client.connect();
        await this.subscriber.connect();
        // yes I'm aware of the potential channel collisions here
        const channel = await this.getChannel(this.username);
        channel.sub(message => {
            this.emit('message', message);
        });
        this.emit('ready', channel);
        return channel;
    }
    async getChannel(name) {
        await this.client.SADD(`${this.prefix}:channels`, name);
        return new Channel_1.default(this, name);
    }
}
exports.default = Hedis;
//# sourceMappingURL=Hedis.js.map