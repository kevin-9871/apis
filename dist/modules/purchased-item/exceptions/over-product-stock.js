"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverProductStockException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class OverProductStockException extends common_1.HttpException {
    constructor() {
        super(constants_1.OVER_PRODUCT_STOCK, 400);
    }
}
exports.OverProductStockException = OverProductStockException;
//# sourceMappingURL=over-product-stock.js.map