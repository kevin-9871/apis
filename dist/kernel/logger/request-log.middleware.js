"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const request_log_model_1 = require("./request-log.model");
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const buff = Buffer.from(base64, 'base64');
        const payloadinit = buff.toString('ascii');
        return JSON.parse(payloadinit);
    }
    catch (e) {
        return null;
    }
}
let RequestLoggerMiddleware = class RequestLoggerMiddleware {
    async use(req, res, next) {
        try {
            const data = {
                path: req.path,
                headers: req.headers,
                query: req.query,
                body: req.body
            };
            const authToken = (req.headers.authorization || req.query.token);
            if (authToken) {
                const tokenArr = authToken.split(' ');
                const authData = parseJwt(tokenArr.length > 1 ? tokenArr[1] : tokenArr[0]);
                if (authData) {
                    data.authData = authData;
                }
            }
            const log = new request_log_model_1.RequestLogModel(data);
            await log.save();
            next();
        }
        catch (e) {
            next(e);
        }
    }
};
RequestLoggerMiddleware = __decorate([
    common_1.Injectable()
], RequestLoggerMiddleware);
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
//# sourceMappingURL=request-log.middleware.js.map