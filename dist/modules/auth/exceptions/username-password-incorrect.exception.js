"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameOrPasswordIncorrectException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class UsernameOrPasswordIncorrectException extends common_1.HttpException {
    constructor() {
        super(constants_1.USERNAME_OR_PASSWORD_INCORRECT, 400);
    }
}
exports.UsernameOrPasswordIncorrectException = UsernameOrPasswordIncorrectException;
//# sourceMappingURL=username-password-incorrect.exception.js.map