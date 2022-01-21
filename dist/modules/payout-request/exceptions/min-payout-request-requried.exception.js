"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinPayoutRequestRequiredException = exports.MIN_PAYOUT_REQUEST_REQUIRED = void 0;
const common_1 = require("@nestjs/common");
exports.MIN_PAYOUT_REQUEST_REQUIRED = 'MIN_PAYOUT_REQUEST_REQUIRED';
class MinPayoutRequestRequiredException extends common_1.HttpException {
    constructor(response) {
        super(response || exports.MIN_PAYOUT_REQUEST_REQUIRED, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.MinPayoutRequestRequiredException = MinPayoutRequestRequiredException;
//# sourceMappingURL=min-payout-request-requried.exception.js.map