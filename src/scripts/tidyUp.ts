import { readFileSync } from 'node:fs';
import { defineScript } from 'redis';

export default defineScript({
	NUMBER_OF_KEYS: 1,
	SCRIPT: readFileSync(__dirname + './../../../lua/TIDYUP.lua', 'utf8'),
	transformArguments(key: string): Array<string> {
		return [key];
	},
	transformReply(reply: number): number {
		return reply;
	}
});
