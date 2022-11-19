import Hedis from '#src/Hedis';

export default class Post {
	hedis: Hedis;

	constructor(hedis: Hedis) {
		this.hedis = hedis;
	}
}
