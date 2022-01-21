"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamModule = void 0;
const common_1 = require("@nestjs/common");
const https = require("https");
const kernel_1 = require("../../kernel");
const stream_provider_1 = require("./providers/stream.provider");
const performer_module_1 = require("../performer/performer.module");
const auth_module_1 = require("../auth/auth.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const user_module_1 = require("../user/user.module");
const message_module_1 = require("../message/message.module");
const socket_module_1 = require("../socket/socket.module");
const gateways_1 = require("./gateways");
const listeners_1 = require("./listeners");
const setting_module_1 = require("../settings/setting.module");
const agent = new https.Agent({
    rejectUnauthorized: false
});
let StreamModule = class StreamModule {
};
StreamModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            common_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
                httpsAgent: agent
            }),
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => socket_module_1.SocketModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => message_module_1.MessageModule)
        ],
        providers: [
            ...stream_provider_1.assetsProviders,
            services_1.StreamService,
            services_1.RequestService,
            listeners_1.StreamConnectListener,
            gateways_1.StreamConversationWsGateway,
            gateways_1.PrivateStreamWsGateway,
            gateways_1.PublicStreamWsGateway
        ],
        controllers: [controllers_1.StreamController],
        exports: [services_1.StreamService]
    })
], StreamModule);
exports.StreamModule = StreamModule;
//# sourceMappingURL=stream.module.js.map