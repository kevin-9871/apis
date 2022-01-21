"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentInformationProviders = exports.BANKING_INFORMATION_MODEL_PROVIDE = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.BANKING_INFORMATION_MODEL_PROVIDE = 'BANKING_INFORMATION_MODEL_PROVIDE';
exports.paymentInformationProviders = [
    {
        provide: exports.BANKING_INFORMATION_MODEL_PROVIDE,
        useFactory: (connection) => connection.model('PaymentInformation', schemas_1.paymentInformationSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map