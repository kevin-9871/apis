"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotFoundxception = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class AccountNotFoundxception extends common_1.HttpException {
    constructor() {
        super(constants_1.ACCOUNT_NOT_FOUND, 400);
    }
}
exports.AccountNotFoundxception = AccountNotFoundxception;
//# sourceMappingURL=account-not-found.exception.js.map