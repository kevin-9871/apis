"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const menu_module_1 = require("../menu/menu.module");
const performer_module_1 = require("../performer/performer.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const setting_controller_1 = require("./controllers/setting.controller");
const auth_module_1 = require("../auth/auth.module");
const setting_file_upload_controller_1 = require("./controllers/setting-file-upload.controller");
const file_module_1 = require("../file/file.module");
const admin_setting_controller_1 = require("./controllers/admin-setting.controller");
let SettingModule = class SettingModule {
    constructor(settingService) {
        this.settingService = settingService;
        this.settingService.syncCache();
    }
};
SettingModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.QueueModule.forRoot(),
            kernel_1.MongoDBModule,
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => menu_module_1.MenuModule)
        ],
        providers: [...providers_1.settingProviders, services_1.SettingService],
        controllers: [
            setting_controller_1.SettingController,
            setting_file_upload_controller_1.SettingFileUploadController,
            admin_setting_controller_1.AdminSettingController
        ],
        exports: [...providers_1.settingProviders, services_1.SettingService]
    }),
    __metadata("design:paramtypes", [services_1.SettingService])
], SettingModule);
exports.SettingModule = SettingModule;
//# sourceMappingURL=setting.module.js.map