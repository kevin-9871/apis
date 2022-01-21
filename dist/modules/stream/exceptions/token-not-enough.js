"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNotEnoughException = void 0;
const common_1 = require("@nestjs/common");
class TokenNotEnoughException extends common_1.HttpException {
    constructor() {
        super('Oops, you don\'t have enough tokens', 400);
    }
}
exports.TokenNotEnoughException = TokenNotEnoughException;
//# sourceMappingURL=token-not-enough.js.map