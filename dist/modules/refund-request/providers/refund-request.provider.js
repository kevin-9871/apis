"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundRequestProviders = exports.REFUND_REQUEST_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const refund_request_schema_1 = require("../schemas/refund-request.schema");
exports.REFUND_REQUEST_MODEL_PROVIDER = 'REFUND_REQUEST_MODEL_PROVIDER';
exports.refundRequestProviders = [
    {
        provide: exports.REFUND_REQUEST_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('RefundRequest', refund_request_schema_1.RefundRequestSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=refund-request.provider.js.map