"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentMissiongException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class DocumentMissiongException extends common_1.HttpException {
    constructor() {
        super(constants_1.DOCUMENT_MISSING, 400);
    }
}
exports.DocumentMissiongException = DocumentMissiongException;
//# sourceMappingURL=document-missing.exception.js.map