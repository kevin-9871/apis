"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class AuthErrorException extends common_1.HttpException {
    constructor() {
        super(constants_1.CANNOT_AUTHENTICATE, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.AuthErrorException = AuthErrorException;
//# sourceMappingURL=auth-error.exception.js.map