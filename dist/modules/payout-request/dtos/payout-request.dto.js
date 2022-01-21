"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRequestDto = void 0;
const lodash_1 = require("lodash");
class PayoutRequestDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'source',
            'sourceId',
            'performerId',
            'performerInfo',
            'sourceInfo',
            'studioId',
            'studioInfo',
            'paymentAccountType',
            'fromDate',
            'toDate',
            'paymentAccountInfo',
            'requestNote',
            'adminNote',
            'status',
            'sourceType',
            'tokenMustPay',
            'previousPaidOut',
            'pendingToken',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PayoutRequestDto = PayoutRequestDto;
//# sourceMappingURL=payout-request.dto.js.map