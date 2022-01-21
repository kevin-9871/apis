"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidFileException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class InvalidFileException extends kernel_1.RuntimeException {
    constructor(msg = 'Invalid image', error = 'INVALID_OR_MISSING_FILE') {
        super(msg, error, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidFileException = InvalidFileException;
//# sourceMappingURL=invalid-file.exception.js.map