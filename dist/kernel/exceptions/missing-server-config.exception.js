"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingServerConfig = void 0;
const common_1 = require("@nestjs/common");
class MissingServerConfig extends common_1.HttpException {
    constructor(msg = 'Missing Server Config') {
        super(msg, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.MissingServerConfig = MissingServerConfig;
//# sourceMappingURL=missing-server-config.exception.js.map