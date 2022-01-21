"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotEnoughMoneyException = void 0;
const common_1 = require("@nestjs/common");
class NotEnoughMoneyException extends common_1.HttpException {
    constructor() {
        super('NOT_ENOUGH_TOKEN', 400);
    }
}
exports.NotEnoughMoneyException = NotEnoughMoneyException;
//# sourceMappingURL=not-enough-money.js.map