"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeException = void 0;
const common_1 = require("@nestjs/common");
class RuntimeException extends common_1.HttpException {
    constructor(message, error, statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        let response;
        if (typeof message === 'string') {
            response = { message, error, statusCode };
        }
        else {
            response = Object.assign({ error,
                statusCode }, message);
        }
        super(response, statusCode);
    }
}
exports.RuntimeException = RuntimeException;
//# sourceMappingURL=runtime.exception.js.map