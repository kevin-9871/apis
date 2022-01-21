"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotVerifiedException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class EmailNotVerifiedException extends common_1.HttpException {
    constructor() {
        super(constants_1.EMAIL_NOT_VERIFIED, 400);
    }
}
exports.EmailNotVerifiedException = EmailNotVerifiedException;
//# sourceMappingURL=email-not-verified.js.map