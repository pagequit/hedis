declare const _default: {
    NUMBER_OF_KEYS: number;
    SCRIPT: string;
    transformArguments(this: void, key: string): Array<string>;
    transformReply(this: void, reply: number): number;
} & import("@redis/client/dist/lib/lua-script").SHA1;
export default _default;
