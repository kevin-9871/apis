"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingProviders = exports.SETTING_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.SETTING_MODEL_PROVIDER = 'SETTING_MODEL_PROVIDER';
exports.settingProviders = [
    {
        provide: exports.SETTING_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Setting', schemas_1.SettingSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=setting.provider.js.map