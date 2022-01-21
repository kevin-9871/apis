"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoFileException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class NoFileException extends kernel_1.RuntimeException {
    constructor(error = 'NO_FILE') {
        super('No file!', error, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.NoFileException = NoFileException;
//# sourceMappingURL=no-file.exception.js.map