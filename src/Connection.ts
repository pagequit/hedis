import Hedis from '#src/Hedis';

export default class Connection {
	hedis: Hedis;

	constructor(hedis: Hedis) {
		this.hedis = hedis;
	}
}
