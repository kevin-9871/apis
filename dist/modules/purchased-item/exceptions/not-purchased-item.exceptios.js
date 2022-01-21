"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemNotPurchasedException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class ItemNotPurchasedException extends common_1.HttpException {
    constructor() {
        super(constants_1.ITEM_NOT_PURCHASED, 400);
    }
}
exports.ItemNotPurchasedException = ItemNotPurchasedException;
//# sourceMappingURL=not-purchased-item.exceptios.js.map