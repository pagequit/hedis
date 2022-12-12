import Option, { None, Some } from './option';

export default class OMap<K, V> extends Map<K, V> {
	/**
   * Don't use `get` on an OMap, use `oget` instead!
   * @param this force a compile time error
   */
	get(this: never, key: K): V | undefined { // eslint-disable-line @typescript-eslint/no-unused-vars
		throw Error("Don't use `get` on an OMap, use `oget` instead!");
	}

	oget(key: K): Option<V> {
		const value = super.get(key);
		return value === undefined ? None() : Some(value);
	}


}
