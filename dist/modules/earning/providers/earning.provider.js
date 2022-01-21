"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.earningProviders = exports.EARNING_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const earning_schema_1 = require("../schemas/earning.schema");
exports.EARNING_MODEL_PROVIDER = 'EARNING_MODEL_PROVIDER';
exports.earningProviders = [
    {
        provide: exports.EARNING_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Earning', earning_schema_1.earningSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=earning.provider.js.map