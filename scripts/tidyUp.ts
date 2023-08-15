import { dirname, fromFileUrl } from "std/path/posix.ts";
import { defineScript } from "redis";

const script = await Deno.readTextFile(
  dirname(fromFileUrl(import.meta.url)) + "/../lua/TIDYUP.lua",
);

export default defineScript({
  NUMBER_OF_KEYS: 1,
  SCRIPT: script,
  transformArguments(key: string): Array<string> {
    return [key];
  },
  transformReply(reply: number): number {
    return reply;
  },
});
