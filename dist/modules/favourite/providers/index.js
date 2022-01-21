"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsProviders = exports.FAVOURITE_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.FAVOURITE_MODEL_PROVIDER = 'FAVOURITE_MODEL_PROVIDER';
exports.assetsProviders = [
    {
        provide: exports.FAVOURITE_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('favorite', schemas_1.favouriteSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map