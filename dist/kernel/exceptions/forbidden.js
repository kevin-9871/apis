"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const common_1 = require("@nestjs/common");
const runtime_exception_1 = require("./runtime.exception");
class ForbiddenException extends runtime_exception_1.RuntimeException {
    constructor(msg = 'Forbidden', error = 'FORBIDDEN') {
        super(msg, error, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenException = ForbiddenException;
//# sourceMappingURL=forbidden.js.map