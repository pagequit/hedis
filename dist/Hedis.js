"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events = require("node:events");
const node_crypto_1 = require("node:crypto");
const redis_1 = require("redis");
const RJSON_1 = require("./unwrap/RJSON");
const Message_1 = require("./Message");
const Request_1 = require("./Request");
const tidyUp_1 = require("./scripts/tidyUp");
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
        this.requests = new Map();
    }
    async init() {
        await this.client.connect();
        await this.subscriber.connect();
        await this.registerChannel(this.name);
        this.sub(this.name, async (message) => {
            switch (message.type) {
                case Message_1.MessageType.REQ: {
                    const request = RJSON_1.default.parse(message.content);
                    if (request.isErr()) {
                        console.error(request.unwrapErr());
                        break;
                    }
                    const { uuid, data } = request.unwrap();
                    this.handleRequest(new Request_1.default(uuid, message.author, data, this));
                    break;
                }
                case Message_1.MessageType.RES: {
                    const response = RJSON_1.default.parse(message.content);
                    if (response.isErr()) {
                        console.error(response.unwrapErr());
                        break;
                    }
                    const { uuid, data } = response.unwrap();
                    if (this.requests.delete(uuid)) {
                        this.emit(uuid, data);
                    }
                    break;
                }
                case Message_1.MessageType.MSG:
                default: {
                    this.emit('message', message);
                }
            }
        });
        this.emit('ready', this);
        return this;
    }
    async pub(channel, content, type) {
        const { prefix, name: author } = this;
        const ts = Date.now();
        const id = await this.client.INCR(`${prefix}:${channel}:last_message_id`)
            .then((id) => id.toString());
        await this.client.HSET(`${prefix}:${channel}:${id}`, ['author', author, 'content', content, 'ts', ts]);
        await this.client.ZADD(`${prefix}:${channel}`, { score: ts, value: id });
        // @ts-expect-error: TIDYUP does not exist on type (but it does)
        await this.client.TIDYUP(`${prefix}:${channel}`);
        const message = RJSON_1.default.stringify({ type, id, author, channel, ts, content });
        if (message.isErr()) {
            console.error(message.unwrapErr());
            return 0;
        }
        return this.client.publish(channel, type + message.unwrap());
    }
    sub(channel, callback) {
        return this.subscriber.subscribe(channel, (rawMessage) => {
            const match = rawMessage.match(Message_1.MessageRegex);
            if (!match) {
                return; // ignore messages with unknown schema
            }
            const index = match[0].length;
            const message = RJSON_1.default.parse(rawMessage.slice(index));
            if (message.isErr()) {
                return console.error(message.unwrapErr());
            }
            return callback(message.unwrap());
        });
    }
    post(channel, content) {
        return this.pub(channel, content, Message_1.MessageType.MSG);
    }
    async registerChannel(name) {
        return await this.client.SADD(`${this.prefix}:channels`, name);
    }
    request(channel, data, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const uuid = (0, node_crypto_1.randomUUID)();
            this.requests.set(uuid, Date.now());
            const content = RJSON_1.default.stringify({ uuid, data });
            if (content.isErr()) {
                reject(content.unwrapErr());
            }
            this.pub(channel, content.unwrap(), Message_1.MessageType.REQ);
            this.once(uuid, resolve);
            setTimeout(() => {
                this.requests.delete(uuid);
                reject('Request expired.');
            }, timeout);
        });
    }
    listen(requestHandler) {
        this.handleRequest = requestHandler;
    }
}
exports.default = Hedis;
//# sourceMappingURL=Hedis.js.map