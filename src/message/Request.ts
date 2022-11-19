import Hedis from '#src/Hedis';

export default class Request {
	hedis: Hedis;

	constructor(hedis: Hedis) {
		this.hedis = hedis;
	}
}
