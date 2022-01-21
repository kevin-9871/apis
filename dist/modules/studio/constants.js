"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STUDIO_EVENT_NAME = exports.STUDIO_CHANNEL = exports.BANK_TRANSFER_TYPE = exports.STUDIO_STATUES = void 0;
var STUDIO_STATUES;
(function (STUDIO_STATUES) {
    STUDIO_STATUES["ACTIVE"] = "active";
    STUDIO_STATUES["INACTIVE"] = "inactive";
    STUDIO_STATUES["PENDING"] = "pending";
})(STUDIO_STATUES = exports.STUDIO_STATUES || (exports.STUDIO_STATUES = {}));
exports.BANK_TRANSFER_TYPE = ['wireTransfer', 'paypal', 'check'];
exports.STUDIO_CHANNEL = 'STUDIO_CHANNEL';
var STUDIO_EVENT_NAME;
(function (STUDIO_EVENT_NAME) {
    STUDIO_EVENT_NAME["CREATED"] = "CREATED";
    STUDIO_EVENT_NAME["UPDATED"] = "UPDATED";
    STUDIO_EVENT_NAME["DELETE"] = "DELETE";
})(STUDIO_EVENT_NAME = exports.STUDIO_EVENT_NAME || (exports.STUDIO_EVENT_NAME = {}));
//# sourceMappingURL=constants.js.map