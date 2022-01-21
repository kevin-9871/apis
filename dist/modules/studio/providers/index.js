"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioProviders = exports.STUDIO_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.STUDIO_MODEL_PROVIDER = 'STUDIO_MODEL_PROVIDER';
exports.studioProviders = [
    {
        provide: exports.STUDIO_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Studio', schemas_1.studioSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map