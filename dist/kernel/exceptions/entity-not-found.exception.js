"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const runtime_exception_1 = require("./runtime.exception");
class EntityNotFoundException extends runtime_exception_1.RuntimeException {
    constructor(msg = 'Entity is not found', error = 'ENTITY_NOT_FOUND') {
        super(msg, error, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
//# sourceMappingURL=entity-not-found.exception.js.map