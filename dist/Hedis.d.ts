/// <reference types="node" />
import * as Events from 'node:events';
import { createClient, RedisClientOptions, RedisFunctions, RedisModules } from 'redis';
import Channel from './classes/Channel';
export default class Hedis extends Events {
    username: string;
    prefix: string;
    client: ReturnType<typeof createClient>;
    subscriber: ReturnType<typeof createClient>;
    constructor(username: string, prefix: string, clientOptions?: RedisClientOptions<RedisModules, RedisFunctions>);
    connect(): Promise<Channel>;
    getChannel(name: string): Promise<Channel>;
}
