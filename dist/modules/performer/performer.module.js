"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const setting_module_1 = require("../settings/setting.module");
const message_module_1 = require("../message/message.module");
const utils_module_1 = require("../utils/utils.module");
const nestjs_redis_1 = require("nestjs-redis");
const nestjs_config_1 = require("nestjs-config");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const user_module_1 = require("../user/user.module");
const file_module_1 = require("../file/file.module");
const listeners_1 = require("./listeners");
const stream_module_1 = require("../stream/stream.module");
const favourite_module_1 = require("../favourite/favourite.module");
const socket_module_1 = require("../socket/socket.module");
const studio_module_1 = require("../studio/studio.module");
const performer_task_1 = require("./tasks/performer.task");
let PerformerModule = class PerformerModule {
};
PerformerModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            nestjs_redis_1.RedisModule.forRootAsync({
                useFactory: (configService) => configService.get('redis'),
                inject: [nestjs_config_1.ConfigService]
            }),
            kernel_1.AgendaModule.register(),
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => favourite_module_1.FavouriteModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => stream_module_1.StreamModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => socket_module_1.SocketModule),
            common_1.forwardRef(() => utils_module_1.UtilsModule),
            common_1.forwardRef(() => studio_module_1.StudioModule),
            message_module_1.MessageModule
        ],
        providers: [
            ...providers_1.performerProviders,
            services_1.CategoryService,
            services_1.CategorySearchService,
            services_1.PerformerService,
            services_1.PerformerSearchService,
            listeners_1.PerformerAssetsListener,
            listeners_1.PerformerConnectedListener,
            listeners_1.PerformerFavoriteListener,
            listeners_1.BlockUserListener,
            services_1.PerformerCommissionService,
            services_1.PerformerBlockSettingService,
            listeners_1.PerformerListener,
            performer_task_1.PerformerTask
        ],
        controllers: [
            controllers_1.CategoryController,
            controllers_1.AdminCategoryController,
            controllers_1.AdminPerformerController,
            controllers_1.PerformerController,
            controllers_1.AdminPerformerCommissionController
        ],
        exports: [
            ...providers_1.performerProviders,
            services_1.CategoryService,
            services_1.PerformerService,
            services_1.PerformerCommissionService,
            services_1.PerformerSearchService,
            services_1.PerformerBlockSettingService
        ]
    })
], PerformerModule);
exports.PerformerModule = PerformerModule;
//# sourceMappingURL=performer.module.js.map