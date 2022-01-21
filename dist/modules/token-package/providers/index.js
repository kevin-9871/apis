"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsProviders = exports.TOKEN_PACKAGE_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.TOKEN_PACKAGE_MODEL_PROVIDER = 'STREAM_MODEL_PROVIDER';
exports.assetsProviders = [
    {
        provide: exports.TOKEN_PACKAGE_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('tokenPackage', schemas_1.tokenPackageSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map