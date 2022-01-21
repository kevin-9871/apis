"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamAggregatorModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_config_1 = require("nestjs-config");
const nestjs_redis_1 = require("nestjs-redis");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const setting_module_1 = require("../settings/setting.module");
const cam_aggregator_controller_1 = require("./controllers/cam-aggregator.controller");
const providers_1 = require("./providers");
const bongacams_service_1 = require("./services/bongacams.service");
const cam_aggregator_service_1 = require("./services/cam-aggregator.service");
const chaturbate_service_1 = require("./services/chaturbate.service");
const stripcash_service_1 = require("./services/stripcash.service");
const xlovecam_service_1 = require("./services/xlovecam.service");
let CamAggregatorModule = class CamAggregatorModule {
};
CamAggregatorModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            nestjs_redis_1.RedisModule.forRootAsync({
                useFactory: (configService) => configService.get('redis'),
                inject: [nestjs_config_1.ConfigService]
            }),
            kernel_1.AgendaModule.register(),
            common_1.HttpModule,
            setting_module_1.SettingModule,
            auth_module_1.AuthModule
        ],
        providers: [...providers_1.camAggregatorProviders, xlovecam_service_1.XLoveCamService, chaturbate_service_1.ChaturbateService, bongacams_service_1.BongacamsService, stripcash_service_1.StripcashService, cam_aggregator_service_1.CamAggregatorService],
        controllers: [cam_aggregator_controller_1.CamAggregatorController],
        exports: []
    })
], CamAggregatorModule);
exports.CamAggregatorModule = CamAggregatorModule;
//# sourceMappingURL=cam-aggregator.module.js.map