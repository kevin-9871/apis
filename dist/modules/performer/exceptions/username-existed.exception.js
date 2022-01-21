"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameExistedException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../auth/constants");
class UsernameExistedException extends common_1.HttpException {
    constructor() {
        super(constants_1.USERNAME_HAS_BEEN_TAKEN, 422);
    }
}
exports.UsernameExistedException = UsernameExistedException;
//# sourceMappingURL=username-existed.exception.js.map