"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCBillService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const crypto = require("crypto");
let CCBillService = class CCBillService {
    singlePurchase(options) {
        const { transactionId } = options;
        const { salt } = options;
        const { flexformId } = options;
        const { subAccountNumber } = options;
        const initialPrice = options.price.toFixed(2);
        const currencyCode = options.currencyCode || '840';
        const initialPeriod = 30;
        if (!salt || !flexformId || !subAccountNumber || !transactionId || !initialPrice) {
            throw new kernel_1.EntityNotFoundException();
        }
        const formDigest = crypto
            .createHash('md5')
            .update(`${initialPrice}${initialPeriod}${currencyCode}${salt}`)
            .digest('hex');
        return {
            paymentUrl: `https://api.ccbill.com/wap-frontflex/flexforms/${flexformId}?transactionId=${transactionId}&initialPrice=${initialPrice}&initialPeriod=${initialPeriod}&clientSubacc=${subAccountNumber}&currencyCode=${currencyCode}&formDigest=${formDigest}`
        };
    }
};
CCBillService = __decorate([
    common_1.Injectable()
], CCBillService);
exports.CCBillService = CCBillService;
//# sourceMappingURL=ccbill.service.js.map