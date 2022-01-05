import { readFileSync } from 'node:fs';
import { defineScript } from 'redis';

export default defineScript({
	NUMBER_OF_KEYS: 1,
	SCRIPT: readFileSync(__dirname + './../../../lua/ADD.lua', 'utf8'),
	transformArguments(key: string, toAdd: number): Array<string> {
		return [key, toAdd.toString()];
	},
	transformReply(reply: string): string {
		return reply;
	}
});
