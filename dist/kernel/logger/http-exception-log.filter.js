"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionLogFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const http_exception_log_model_1 = require("./http-exception-log.model");
let HttpExceptionLogFilter = class HttpExceptionLogFilter extends core_1.BaseExceptionFilter {
    async catch(exception, host) {
        try {
            if (exception instanceof common_1.HttpException && exception.getStatus() !== 500) {
                return super.catch(exception, host);
            }
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const status = exception instanceof common_1.HttpException ? exception.getStatus() : 500;
            const message = exception instanceof common_1.HttpException ? exception.getResponse() : '';
            const log = new http_exception_log_model_1.HttpExceptionLogModel({
                path: request.path,
                headers: request.headers,
                query: request.query,
                body: request.body,
                error: exception.stack || exception
            });
            await log.save();
            const jsonData = {
                statusCode: status,
                message: process.env.NODE_ENV === 'development' ? exception.stack : message['error'] || 'Something went wrong, please try again later!',
                error: message['error']
            };
            return response
                .status(status)
                .json(jsonData);
        }
        catch (e) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            return response
                .status(500)
                .json({
                statusCode: 500,
                message: 'Something went wrong, please try again later!'
            });
        }
    }
};
HttpExceptionLogFilter = __decorate([
    common_1.Catch()
], HttpExceptionLogFilter);
exports.HttpExceptionLogFilter = HttpExceptionLogFilter;
//# sourceMappingURL=http-exception-log.filter.js.map