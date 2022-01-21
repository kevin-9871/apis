"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("nestjs-redis");
const nestjs_config_1 = require("nestjs-config");
const kernel_1 = require("../../kernel");
const socket_user_service_1 = require("./services/socket-user.service");
const user_connected_gateway_1 = require("./gateways/user-connected.gateway");
const auth_module_1 = require("../auth/auth.module");
const tasks_1 = require("./tasks");
let SocketModule = class SocketModule {
};
SocketModule = __decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => auth_module_1.AuthModule),
            kernel_1.QueueModule,
            kernel_1.AgendaModule.register(),
            nestjs_redis_1.RedisModule.forRootAsync({
                useFactory: (configService) => configService.get('redis'),
                inject: [nestjs_config_1.ConfigService]
            })
        ],
        providers: [
            socket_user_service_1.SocketUserService,
            tasks_1.SocketUserTask,
            user_connected_gateway_1.WsUserConnectedGateway
        ],
        controllers: [],
        exports: [
            socket_user_service_1.SocketUserService
        ]
    })
], SocketModule);
exports.SocketModule = SocketModule;
//# sourceMappingURL=socket.module.js.map