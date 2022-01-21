"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertMp4ErrorException = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
class ConvertMp4ErrorException extends kernel_1.RuntimeException {
    constructor(error = 'convert mp4 error!') {
        super('Convert mp4 error', error, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ConvertMp4ErrorException = ConvertMp4ErrorException;
//# sourceMappingURL=convert-mp4-error.exception.js.map