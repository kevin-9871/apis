"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamServerErrorException = void 0;
const common_1 = require("@nestjs/common");
class StreamServerErrorException extends common_1.HttpException {
    constructor(response) {
        super({
            message: response.message || 'Stream Server Error!',
            error: response.error,
            status: response.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.StreamServerErrorException = StreamServerErrorException;
//# sourceMappingURL=stream-server-error.js.map