"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const performer_module_1 = require("../performer/performer.module");
const purchased_item_module_1 = require("../purchased-item/purchased-item.module");
const setting_module_1 = require("../settings/setting.module");
const earning_controller_1 = require("./controllers/earning.controller");
const earning_service_1 = require("./services/earning.service");
const earning_provider_1 = require("./providers/earning.provider");
const earning_listener_1 = require("./listeners/earning.listener");
const studio_module_1 = require("../studio/studio.module");
let EarningModule = class EarningModule {
};
EarningModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            studio_module_1.StudioModule,
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => purchased_item_module_1.PurchasedItemModule),
            common_1.forwardRef(() => setting_module_1.SettingModule)
        ],
        providers: [...earning_provider_1.earningProviders, earning_service_1.EarningService, earning_listener_1.TransactionEarningListener],
        controllers: [earning_controller_1.EarningController],
        exports: [...earning_provider_1.earningProviders, earning_service_1.EarningService, earning_listener_1.TransactionEarningListener]
    })
], EarningModule);
exports.EarningModule = EarningModule;
//# sourceMappingURL=earning.module.js.map