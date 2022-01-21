"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutRequestProviders = exports.PAYOUT_REQUEST_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const payout_request_schema_1 = require("../schemas/payout-request.schema");
exports.PAYOUT_REQUEST_MODEL_PROVIDER = 'PAYOUT_REQUEST_MODEL_PROVIDER';
exports.payoutRequestProviders = [
    {
        provide: exports.PAYOUT_REQUEST_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PayoutRequest', payout_request_schema_1.payoutRequestSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=payout-request.provider.js.map