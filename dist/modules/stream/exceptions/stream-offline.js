"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamOfflineException = void 0;
const common_1 = require("@nestjs/common");
class StreamOfflineException extends common_1.HttpException {
    constructor() {
        super('STREAM_OFFLINE', 400);
    }
}
exports.StreamOfflineException = StreamOfflineException;
//# sourceMappingURL=stream-offline.js.map