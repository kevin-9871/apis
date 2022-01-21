"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentProviders = exports.ORDER_MODEL_PROVIDER = exports.PAYMENT_TRANSACTION_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.PAYMENT_TRANSACTION_MODEL_PROVIDER = 'PAYMENT_TRANSACTION_MODEL_PROVIDER';
exports.ORDER_MODEL_PROVIDER = 'ORDER_MODEL_PROVIDER';
exports.paymentProviders = [
    {
        provide: exports.PAYMENT_TRANSACTION_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PaymentTransaction', schemas_1.PaymentTransactionSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.ORDER_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Order', schemas_1.OrderSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map