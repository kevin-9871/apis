"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountExistedException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class AccountExistedException extends common_1.HttpException {
    constructor() {
        super(constants_1.ACCOUNT_EXISTED, 400);
    }
}
exports.AccountExistedException = AccountExistedException;
//# sourceMappingURL=account-existed.exception.js.map