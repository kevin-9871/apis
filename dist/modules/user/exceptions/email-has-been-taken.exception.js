"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHasBeenTakenException = void 0;
const common_1 = require("@nestjs/common");
class EmailHasBeenTakenException extends common_1.HttpException {
    constructor() {
        super('Email has been taken', 400);
    }
}
exports.EmailHasBeenTakenException = EmailHasBeenTakenException;
//# sourceMappingURL=email-has-been-taken.exception.js.map