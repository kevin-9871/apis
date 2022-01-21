"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageProviders = exports.MESSAGE_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.MESSAGE_MODEL_PROVIDER = 'MESSAGE_MODEL_PROVIDER';
exports.messageProviders = [
    {
        provide: exports.MESSAGE_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Message', schemas_1.MessageSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=message.provider.js.map