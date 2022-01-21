"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedCountryException = void 0;
const common_1 = require("@nestjs/common");
class BlockedCountryException extends common_1.HttpException {
    constructor() {
        super('BLOCK_COUNTRY', 403);
    }
}
exports.BlockedCountryException = BlockedCountryException;
//# sourceMappingURL=block-countries.exception.js.map