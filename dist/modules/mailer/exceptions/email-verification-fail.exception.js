"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationFailureException = void 0;
const common_1 = require("@nestjs/common");
class EmailVerificationFailureException extends common_1.HttpException {
    constructor(error) {
        super({
            error,
            message: 'Could not verify this SMTP transporter',
            statusCode: common_1.HttpStatus.BAD_REQUEST
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.EmailVerificationFailureException = EmailVerificationFailureException;
//# sourceMappingURL=email-verification-fail.exception.js.map