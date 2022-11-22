"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events = require("node:events");
const redis_1 = require("redis");
const option_1 = require("#src/unwrap/option");
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
    }
    async init() {
        await this.client.connect();
        await this.subscriber.connect();
        await this.registerChannel(this.name);
        this.sub(this.name, async (message) => {
            switch (message.type) {
                case Message_1.MessageType.REQ: {
                    const response = new Response(this.pub.bind(this), message);
                    const { id, head, body } = JSON.parse(message.content);
                    const request = new Request(id, head, body); // ehm new Response?
                    this.requestListener(request, response);
                    break;
                }
                case Message_1.MessageType.RES: {
                    const { prefix, name } = this;
                    const { id, head, body } = JSON.parse(message.content);
                    if ((await this.client.SREM(`${prefix}:${name}:requests`, id)) > 0) {
                        this.emit(id, { head, body });
                    }
                    break;
                }
            }
            this.emit('message', message);
        });
        this.emit('ready', this); // not sure if that's really a good practice
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
        const head = { id, author, channel: channel, ts };
        const message = type + JSON.stringify({ head, content });
        return this.client.publish(channel, message);
    }
    async sub(channel, callback) {
        return this.subscriber.subscribe(channel, async (rawMessage) => {
            const match = rawMessage.match(Message_1.MessageRegex);
            if (!match) {
                return; // ignore messages with unknown schema
            }
            const type = match[0];
            const index = match[0].length;
            const message = (0, option_1.None)();
            try {
                const { head, content } = JSON.parse(rawMessage.slice(index));
                message.insert({ type: type, head, content });
            }
            catch (error) {
                return console.error(error);
            }
            return callback(message.unwrap());
        });
    }
    async post(channel, content) {
        return this.pub(channel, content, Message_1.MessageType.MSG);
    }
    async registerChannel(name) {
        return await this.client.SADD(`${this.prefix}:channels`, name);
    }
    async request(channel, payload) {
        const id = Date.now().toString(16);
        const { prefix, name } = this;
        await this.client.SADD(`${prefix}:${name}:requests`, id);
        await this.pub(channel, new Request(id, 'head', payload).toString(), Message_1.MessageType.REQ);
        return new Promise((resolve, reject) => {
            this.once(id, resolve);
        });
    }
    listen(callback) {
        this.requestListener = callback;
    }
}
exports.default = Hedis;
class Response {
    constructor(callback, message, value) {
        this.callback = callback;
        this.message = message;
        this.value = value ?? '';
    }
    end(value) {
        const request_WIP = new Request(JSON.parse(this.message.content).id, 'head', value ?? this.value);
        this.callback(this.message.head.author, request_WIP.toString(), Message_1.MessageType.RES);
    }
}
class Request {
    constructor(id, head, body) {
        this.id = id;
        this.head = head;
        this.body = body;
    }
    toString() {
        return JSON.stringify(this);
    }
}
//# sourceMappingURL=Hedis.js.map