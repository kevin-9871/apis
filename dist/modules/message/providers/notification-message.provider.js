"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationMessageProviders = exports.NOTIFICATION_MESSAGE_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.NOTIFICATION_MESSAGE_MODEL_PROVIDER = 'NOTIFICATION_MESSAGE_MODEL_PROVIDER';
exports.notificationMessageProviders = [
    {
        provide: exports.NOTIFICATION_MESSAGE_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('NotificationMessage', schemas_1.NotificationMessageSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=notification-message.provider.js.map