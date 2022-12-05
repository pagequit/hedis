import Result, { Err, Ok } from './result';

export default abstract class RJSON {
	static stringify<T, U = never>(value: T, replacer?: (key: string, value: U) => U, space?: string | number): Result<string, TypeError> {
		try {
			return Ok(JSON.stringify(value, replacer, space));
		}
		catch (error) {
			return Err(error as TypeError);
		}
	}

	static parse<T, U = never>(text: string, reviver?: (key: string, value: U) => U): Result<T, SyntaxError> {
		try {
			return Ok(JSON.parse(text, reviver));
		}
		catch (error) {
			return Err(error as SyntaxError);
		}
	}
}
