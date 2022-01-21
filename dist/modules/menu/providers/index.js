"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuProviders = exports.MENU_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.MENU_PROVIDER = 'MENU_PROVIDER';
exports.menuProviders = [
    {
        provide: exports.MENU_PROVIDER,
        useFactory: (connection) => connection.model('Menu', schemas_1.MenuSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map