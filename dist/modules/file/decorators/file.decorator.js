"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesUploaded = exports.FileUploaded = void 0;
const common_1 = require("@nestjs/common");
exports.FileUploaded = common_1.createParamDecorator((data, req) => {
    const file = req.file || req.args[0].file;
    return file;
});
exports.FilesUploaded = common_1.createParamDecorator((data, req) => {
    const files = req.files || req.args[0].files;
    return files;
});
//# sourceMappingURL=file.decorator.js.map