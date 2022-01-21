"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundRequestDto = void 0;
const lodash_1 = require("lodash");
class RefundRequestDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'userId',
            'sourceType',
            'sourceId',
            'token',
            'performerId',
            'description',
            'status',
            'createdAt',
            'updatedAt',
            'performerInfo',
            'userInfo',
            'productInfo',
            'orderInfo'
        ]));
    }
}
exports.RefundRequestDto = RefundRequestDto;
//# sourceMappingURL=refund-request.dto.js.map