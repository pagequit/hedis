import Hedis from '#src/Hedis';
import Result, { Err, Ok } from '#src/unwrap/result';

export default class Connection {
	hedis: Hedis;
	name: string;

	constructor(hedis: Hedis, name: string) {
		this.hedis = hedis;
		this.name = name;
	}

	async syn(): Promise<Result<string, string>> {
		const channel = await this.hedis.createChannel(this.name);
		channel.pub
	}
}
