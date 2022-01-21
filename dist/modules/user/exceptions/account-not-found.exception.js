"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotFoundxception = void 0;
const common_1 = require("@nestjs/common");
class AccountNotFoundxception extends common_1.HttpException {
    constructor() {
        super('Account not found', 400);
    }
}
exports.AccountNotFoundxception = AccountNotFoundxception;
//# sourceMappingURL=account-not-found.exception.js.map