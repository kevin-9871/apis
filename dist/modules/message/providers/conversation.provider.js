"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationProviders = exports.CONVERSATION_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.CONVERSATION_MODEL_PROVIDER = 'CONVERSATION_MODEL_PROVIDER';
exports.conversationProviders = [
    {
        provide: exports.CONVERSATION_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Conversation', schemas_1.ConversationSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=conversation.provider.js.map