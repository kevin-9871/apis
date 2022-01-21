"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingConfigPaymentException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class MissingConfigPaymentException extends common_1.HttpException {
    constructor() {
        super(constants_1.MISSING_CONFIG_PAYMENT_GATEWAY, 400);
    }
}
exports.MissingConfigPaymentException = MissingConfigPaymentException;
//# sourceMappingURL=missing-config-payment-gateway.js.map