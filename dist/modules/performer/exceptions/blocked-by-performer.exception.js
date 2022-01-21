"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedByPerformerException = void 0;
const common_1 = require("@nestjs/common");
class BlockedByPerformerException extends common_1.HttpException {
    constructor() {
        super('BLOCKED_BY_PERFORMER', 403);
    }
}
exports.BlockedByPerformerException = BlockedByPerformerException;
//# sourceMappingURL=blocked-by-performer.exception.js.map