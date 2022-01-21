"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedItemDto = void 0;
const lodash_1 = require("lodash");
class PurchasedItemDto {
    constructor(data) {
        const props = Object.getOwnPropertyNames(data);
        data
            && Object.assign(this, lodash_1.pick(data, props));
    }
}
exports.PurchasedItemDto = PurchasedItemDto;
//# sourceMappingURL=purchase-item.dto.js.map