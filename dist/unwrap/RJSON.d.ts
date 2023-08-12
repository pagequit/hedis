import Result from './result';
export default abstract class RJSON {
    static stringify<T, U = never>(value: T, replacer?: (key: string, value: U) => U, space?: string | number): Result<string, TypeError>;
    static parse<T, U = never>(text: string, reviver?: (key: string, value: U) => U): Result<T, SyntaxError>;
}
