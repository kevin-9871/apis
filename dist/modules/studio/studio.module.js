"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudioModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const setting_module_1 = require("../settings/setting.module");
const controllers_1 = require("./controllers");
const providers_1 = require("./providers");
const services_1 = require("./services");
const listeners_1 = require("./listeners");
const file_module_1 = require("../file/file.module");
let StudioModule = class StudioModule {
};
StudioModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule)
        ],
        controllers: [controllers_1.StudioController, controllers_1.StudioCommissionController],
        providers: [
            ...providers_1.studioProviders,
            services_1.StudioService,
            services_1.StudioCommissionService,
            listeners_1.StudioMemberListener,
            listeners_1.ModelListener
        ],
        exports: [...providers_1.studioProviders, services_1.StudioService]
    })
], StudioModule);
exports.StudioModule = StudioModule;
//# sourceMappingURL=studio.module.js.map