"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performerProviders = exports.PERFORMER_COMMISSION_MODEL_PROVIDER = exports.PERFORMER_BLOCK_SETTING_MODEL_PROVIDER = exports.PERFORMER_CATEGORY_MODEL_PROVIDER = exports.PERFORMER_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.PERFORMER_MODEL_PROVIDER = 'PERFORMER_MODEL';
exports.PERFORMER_CATEGORY_MODEL_PROVIDER = 'PERFORMER_CATEGORY_MODEL';
exports.PERFORMER_BLOCK_SETTING_MODEL_PROVIDER = 'PERFORMER_BLOCK_SETTING_MODEL_PROVIDER';
exports.PERFORMER_COMMISSION_MODEL_PROVIDER = 'PERFORMER_COMMISSION_MODEL_PROVIDER';
exports.performerProviders = [
    {
        provide: exports.PERFORMER_CATEGORY_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerCategory', schemas_1.CategorySchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Performer', schemas_1.performerSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_BLOCK_SETTING_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerBlockSetting', schemas_1.BlockSettingSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }, {
        provide: exports.PERFORMER_COMMISSION_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerCommission', schemas_1.performerCommissionSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=performer.provider.js.map