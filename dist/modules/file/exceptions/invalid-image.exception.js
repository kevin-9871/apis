"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidImageException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class InvalidImageException extends kernel_1.RuntimeException {
    constructor(msg = 'Invalid image', error = 'INVALID_IMAGE') {
        super(msg, error, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidImageException = InvalidImageException;
//# sourceMappingURL=invalid-image.exception.js.map