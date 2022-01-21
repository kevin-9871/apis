"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemHaveBoughtException = void 0;
const common_1 = require("@nestjs/common");
class ItemHaveBoughtException extends common_1.HttpException {
    constructor() {
        super('You have been purchased this item. Please check your account dashboard.', 400);
    }
}
exports.ItemHaveBoughtException = ItemHaveBoughtException;
//# sourceMappingURL=item-have-bought.exception.js.map