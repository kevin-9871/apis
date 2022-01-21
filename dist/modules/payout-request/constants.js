"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYOUT_REQUEST_EVENT = exports.PAYOT_REQUEST_CHANEL = exports.PAYMENT_ACCOUNT_TYPE = exports.SOURCE_TYPE = exports.STATUES = void 0;
exports.STATUES = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DONE: 'done'
};
exports.SOURCE_TYPE = {
    PERFORMER: 'performer',
    STUDIO: 'studio'
};
var PAYMENT_ACCOUNT_TYPE;
(function (PAYMENT_ACCOUNT_TYPE) {
    PAYMENT_ACCOUNT_TYPE["WIRE"] = "wire";
    PAYMENT_ACCOUNT_TYPE["PAYPAL"] = "paypal";
    PAYMENT_ACCOUNT_TYPE["ISSUE"] = "issue_check_us";
    PAYMENT_ACCOUNT_TYPE["DEPOSIT"] = "deposit";
    PAYMENT_ACCOUNT_TYPE["PAYONNEER"] = "payoneer";
    PAYMENT_ACCOUNT_TYPE["BITPAY"] = "bitpay";
})(PAYMENT_ACCOUNT_TYPE = exports.PAYMENT_ACCOUNT_TYPE || (exports.PAYMENT_ACCOUNT_TYPE = {}));
exports.PAYOT_REQUEST_CHANEL = 'PAYOT_REQUEST_CHANEL';
var PAYOUT_REQUEST_EVENT;
(function (PAYOUT_REQUEST_EVENT) {
    PAYOUT_REQUEST_EVENT["CREATED"] = "CREATED";
    PAYOUT_REQUEST_EVENT["UPDATED"] = "CREATED";
})(PAYOUT_REQUEST_EVENT = exports.PAYOUT_REQUEST_EVENT || (exports.PAYOUT_REQUEST_EVENT = {}));
//# sourceMappingURL=constants.js.map