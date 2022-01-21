"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class ModelNotFoundException extends common_1.HttpException {
    constructor() {
        super('MODEL_NOT_FOUND', 422);
    }
}
exports.ModelNotFoundException = ModelNotFoundException;
//# sourceMappingURL=model-not-found.exception.js.map