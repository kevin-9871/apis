"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const path_1 = require("path");
__exportStar(require("./infras"), exports);
__exportStar(require("./exceptions"), exports);
__exportStar(require("./common"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./helpers"), exports);
__exportStar(require("./events"), exports);
function getConfig(configName = 'app') {
    return require(path_1.join(__dirname, '..', 'config', configName)).default;
}
exports.getConfig = getConfig;
//# sourceMappingURL=index.js.map