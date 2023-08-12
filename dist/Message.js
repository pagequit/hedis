"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.MessageRegex = void 0;
exports.MessageRegex = '^HED:([A-Z]{3})#';
var MessageType;
(function (MessageType) {
    MessageType["MSG"] = "HED:MSG#";
    MessageType["REQ"] = "HED:REQ#";
    MessageType["RES"] = "HED:RES#";
})(MessageType || (exports.MessageType = MessageType = {}));
//# sourceMappingURL=Message.js.map