"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDto = void 0;
const lodash_1 = require("lodash");
class PaymentDto {
    constructor(data) {
        data
            && Object.assign(this, lodash_1.pick(data, [
                '_id',
                'paymentGateway',
                'buyerInfo',
                'buyerSource',
                'buyerId',
                'type',
                'products',
                'paymentResponseInfo',
                'status',
                'totalPrice',
                'originalPrice',
                'createdAt',
                'updatedAt'
            ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            paymentGateway: this.paymentGateway,
            buyerId: this.buyerId,
            buyerSource: this.buyerSource,
            buyerInfo: this.buyerInfo,
            sellerSource: this.sellerSource,
            sellerId: this.sellerId,
            type: this.type,
            products: this.products,
            totalPrice: this.totalPrice,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
        const privateInfo = {
            paymentResponseInfo: this.paymentResponseInfo
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.PaymentDto = PaymentDto;
//# sourceMappingURL=payment.dto.js.map