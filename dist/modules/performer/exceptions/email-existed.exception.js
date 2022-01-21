"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailExistedException = void 0;
const common_1 = require("@nestjs/common");
class EmailExistedException extends common_1.HttpException {
    constructor() {
        super('Email has been taken', 422);
    }
}
exports.EmailExistedException = EmailExistedException;
//# sourceMappingURL=email-existed.exception.js.map