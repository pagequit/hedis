export declare const MessageRegex = "^HED:([A-Z]{3})#";
export declare enum MessageType {
    MSG = "HED:MSG#",
    REQ = "HED:REQ#",
    RES = "HED:RES#"
}
export declare type Message = {
    type: MessageType;
    id: string;
    author: string;
    channel: string;
    ts: number;
    content: string;
};
