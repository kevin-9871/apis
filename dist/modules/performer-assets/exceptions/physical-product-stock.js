"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicalProductStockException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class PhysicalProductStockException extends kernel_1.RuntimeException {
    constructor() {
        super('Physical product stock must not be empty.', 'PHYSICAL_PRODUCT_STOCK_EMPTY', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.PhysicalProductStockException = PhysicalProductStockException;
//# sourceMappingURL=physical-product-stock.js.map