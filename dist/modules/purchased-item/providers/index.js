"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTokenProviders = exports.PURCHASE_ITEM_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.PURCHASE_ITEM_MODEL_PROVIDER = 'PURCHASE_ITEM_MODEL_PROVIDER';
exports.paymentTokenProviders = [
    {
        provide: exports.PURCHASE_ITEM_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PurchasedItem', schemas_1.PurchasedItemSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map