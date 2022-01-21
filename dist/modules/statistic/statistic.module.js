"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticModule = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const auth_module_1 = require("../auth/auth.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const performer_module_1 = require("../performer/performer.module");
const user_module_1 = require("../user/user.module");
const earning_module_1 = require("../earning/earning.module");
const payment_module_1 = require("../payment/payment.module");
const studio_module_1 = require("../studio/studio.module");
let StatisticModule = class StatisticModule {
};
StatisticModule = __decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => earning_module_1.EarningModule),
            common_1.forwardRef(() => payment_module_1.PaymentModule),
            common_1.forwardRef(() => studio_module_1.StudioModule)
        ],
        providers: [
            services_1.StatisticService
        ],
        controllers: [
            controllers_1.StatisticController
        ],
        exports: []
    })
], StatisticModule);
exports.StatisticModule = StatisticModule;
//# sourceMappingURL=statistic.module.js.map