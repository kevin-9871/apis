"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileProviders = exports.FILE_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.FILE_MODEL_PROVIDER = 'FILE_MODEL_PROVIDER';
exports.fileProviders = [
    {
        provide: exports.FILE_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('File', schemas_1.FileSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=file.provider.js.map