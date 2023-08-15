import Events from "node:events";
import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import { Collection, teaCall } from "unwrap";
import type { Result } from "unwrap";
import { Message, MessageRegex, MessageType } from "/Message.ts";
import Request, { RequestType } from "/Request.ts";
import TIDYUP from "/scripts/tidyUp.ts";

export default class Hedis extends Events {
  name: string;
  prefix: string;
  client: ReturnType<typeof createClient>;
  subscriber: ReturnType<typeof createClient>;
  requests: Collection<string, (data: string) => void>;
  handleRequest!: (request: Request) => void;

  constructor(
    name: string,
    prefix: string,
    clientOptions?: RedisClientOptions<RedisModules, RedisFunctions>,
  ) {
    super();
    this.name = name;
    this.prefix = prefix;

    this.client = createClient({
      scripts: <RedisScripts> {
        TIDYUP,
      },
      ...clientOptions,
    });
    this.subscriber = createClient(clientOptions);
    this.requests = new Collection();
  }

  async init(): Promise<Hedis> {
    await this.client.connect();
    await this.subscriber.connect();
    await this.registerChannel(this.name);

    this.sub(this.name, (message) => {
      switch (message.type) {
        case MessageType.REQ: {
          const request: Result<RequestType, Error> = teaCall(
            JSON.parse,
            message.content,
          );
          if (request.isErr()) {
            console.error(request.unwrapErr());
            break;
          }

          const { uuid, data } = request.unwrap();
          this.handleRequest(new Request(uuid, message.author, data, this));

          break;
        }
        case MessageType.RES: {
          const response: Result<RequestType, Error> = teaCall(
            JSON.parse,
            message.content,
          );
          if (response.isErr()) {
            console.error(response.unwrapErr());
            break;
          }

          const { uuid, data } = response.unwrap();
          const request = this.requests.get(uuid);

          if (request.isSome()) {
            this.requests.delete(uuid);
            request.unwrap()(data);
          }

          break;
        }
        case MessageType.MSG:
        default: {
          this.emit("message", message);
        }
      }
    });

    this.emit("ready", this);

    return this;
  }

  async pub(
    channel: string,
    content: string,
    type: MessageType,
  ): Promise<number> {
    const { prefix, name: author } = this;
    const ts = Date.now();
    const id = await this.client.INCR(`${prefix}:${channel}:last_message_id`)
      .then((id) => id.toString());

    await this.client.HSET(`${prefix}:${channel}:${id}`, [
      "author",
      author,
      "content",
      content,
      "ts",
      ts,
    ]);

    await this.client.ZADD(`${prefix}:${channel}`, { score: ts, value: id });
    // @ts-expect-error: TIDYUP does not exist on type (but it does)
    await this.client.TIDYUP(`${prefix}:${channel}`);

    const message: Result<string, Error> = teaCall(JSON.stringify, {
      type,
      id,
      author,
      channel,
      ts,
      content,
    });

    if (message.isErr()) {
      console.error(message.unwrapErr());
      return 0;
    }

    return this.client.publish(channel, type + message.unwrap());
  }

  sub(channel: string, callback: (message: Message) => void): Promise<void> {
    return this.subscriber.subscribe(channel, (rawMessage) => {
      const match = rawMessage.match(MessageRegex);
      if (!match) {
        return; // ignore messages with unknown schema
      }

      const index = match[0].length;
      const message: Result<Message, Error> = teaCall(
        JSON.parse,
        rawMessage.slice(index),
      );

      if (message.isErr()) {
        return console.error(message.unwrapErr());
      }

      return callback(message.unwrap());
    });
  }

  post(channel: string, content: string): Promise<number> {
    return this.pub(channel, content, MessageType.MSG);
  }

  async registerChannel(name: string): Promise<number> {
    return await this.client.SADD(`${this.prefix}:channels`, name);
  }

  request(channel: string, data: string, timeout = 30000): Promise<string> {
    return new Promise((resolve, reject) => {
      const uuid = crypto.randomUUID();
      this.requests.set(uuid, resolve);

      const content: Result<string, Error> = teaCall(JSON.stringify, {
        uuid,
        data,
      });

      if (content.isErr()) {
        reject(content.unwrapErr());
      }

      this.pub(channel, content.unwrap(), MessageType.REQ);
      setTimeout(() => {
        this.requests.delete(uuid);
        reject("Request expired.");
      }, timeout);
    });
  }

  listen(requestHandler: (request: Request) => void) {
    this.handleRequest = requestHandler;
  }
}
