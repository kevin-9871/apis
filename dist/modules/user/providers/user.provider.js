"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProviders = exports.SHIPPING_INFO_PROVIDER = exports.USER_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const user_schema_1 = require("../schemas/user.schema");
const shipping_info_schema_1 = require("../schemas/shipping-info.schema");
exports.USER_MODEL_PROVIDER = 'USER_MODEL';
exports.SHIPPING_INFO_PROVIDER = 'SHIPPING_INFO_PROVIDER';
exports.userProviders = [
    {
        provide: exports.USER_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('User', user_schema_1.UserSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.SHIPPING_INFO_PROVIDER,
        useFactory: (connection) => connection.model('ShippingInfoUser', shipping_info_schema_1.ShippingInfoSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=user.provider.js.map