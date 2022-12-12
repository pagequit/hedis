/// <reference types="node" />
import * as Events from 'node:events';
import { createClient, RedisClientOptions, RedisFunctions, RedisModules } from 'redis';
import OMap from './unwrap/OMap';
import { Message, MessageType } from './Message';
import Request from './Request';
export default class Hedis extends Events {
    name: string;
    prefix: string;
    client: ReturnType<typeof createClient>;
    subscriber: ReturnType<typeof createClient>;
    requests: OMap<string, (data: string) => void>;
    handleRequest: (request: Request) => void;
    constructor(name: string, prefix: string, clientOptions?: RedisClientOptions<RedisModules, RedisFunctions>);
    init(): Promise<Hedis>;
    pub(channel: string, content: string, type: MessageType): Promise<number>;
    sub(channel: string, callback: (message: Message) => void): Promise<void>;
    post(channel: string, content: string): Promise<number>;
    registerChannel(name: string): Promise<number>;
    request(channel: string, data: string, timeout?: number): Promise<string>;
    listen(requestHandler: (request: Request) => void): void;
}
