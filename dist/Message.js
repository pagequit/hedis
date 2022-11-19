"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.MessageRegex = void 0;
exports.MessageRegex = '^HED:([A-Z]{3})#';
var MessageType;
(function (MessageType) {
    MessageType["SYN"] = "HED:SYN#";
    MessageType["ACK"] = "HED:ACK#";
    MessageType["REQ"] = "HED:REQ#";
    MessageType["PST"] = "HED:PST#";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
//# sourceMappingURL=Message.js.map