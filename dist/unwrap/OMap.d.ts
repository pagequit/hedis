import Option from './option';
export default class OMap<K, V> extends Map<K, V> {
    /**
   * Don't use `get` on an OMap, use `oget` instead!
   * @param this force a compile time error
   */
    get(this: never, key: K): V | undefined;
    oget(key: K): Option<V>;
}
