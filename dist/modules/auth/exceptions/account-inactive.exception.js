"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountInactiveException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class AccountInactiveException extends common_1.HttpException {
    constructor() {
        super(constants_1.ACCOUNT_INACTIVE, 401);
    }
}
exports.AccountInactiveException = AccountInactiveException;
//# sourceMappingURL=account-inactive.exception.js.map