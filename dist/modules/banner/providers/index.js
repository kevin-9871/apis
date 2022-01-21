"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerProviders = exports.BANNER_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.BANNER_PROVIDER = 'BANNER_PROVIDER';
exports.bannerProviders = [
    {
        provide: exports.BANNER_PROVIDER,
        useFactory: (connection) => connection.model('Banner', schemas_1.BannerSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map