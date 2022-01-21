"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsProviders = exports.STREAM_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.STREAM_MODEL_PROVIDER = 'STREAM_MODEL_PROVIDER';
exports.assetsProviders = [
    {
        provide: exports.STREAM_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Stream', schemas_1.StreamSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=stream.provider.js.map