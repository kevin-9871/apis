"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailOrPasswordIncorrectException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class EmailOrPasswordIncorrectException extends common_1.HttpException {
    constructor() {
        super(constants_1.EMAIL_OR_PASSWORD_INCORRECT, 400);
    }
}
exports.EmailOrPasswordIncorrectException = EmailOrPasswordIncorrectException;
//# sourceMappingURL=email-password-incorrect.exception.js.map