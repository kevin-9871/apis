"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDto = void 0;
const lodash_1 = require("lodash");
class OrderDto {
    constructor(data) {
        const props = Object.getOwnPropertyNames(data);
        data
            && Object.assign(this, lodash_1.pick(data, props));
    }
}
exports.OrderDto = OrderDto;
//# sourceMappingURL=order.dto.js.map