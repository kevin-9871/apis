"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderFile = void 0;
const mustache_1 = require("mustache");
const path_1 = require("path");
const fs_1 = require("fs");
const VIEW_DIR = path_1.join(__dirname, '..', '..', '..', 'views');
const renderFile = (view, options, cb) => {
    if (typeof options === 'function') {
        cb = options;
    }
    if (typeof cb !== 'function') {
        cb = function callback() { };
    }
    const viewDir = options.viewDir || VIEW_DIR;
    const file = fs_1.existsSync(view) ? view : path_1.join(viewDir, view);
    const content = fs_1.readFileSync(file, 'utf8');
    cb(null, mustache_1.render(content, options));
};
exports.renderFile = renderFile;
//# sourceMappingURL=view.helper.js.map