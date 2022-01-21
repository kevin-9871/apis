"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRequestModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const payout_request_provider_1 = require("./providers/payout-request.provider");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const user_module_1 = require("../user/user.module");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const mailer_module_1 = require("../mailer/mailer.module");
const setting_module_1 = require("../settings/setting.module");
const earning_module_1 = require("../earning/earning.module");
const listeners_1 = require("./listeners");
const studio_module_1 = require("../studio/studio.module");
const payment_information_module_1 = require("../payment-information/payment-information.module");
let PayoutRequestModule = class PayoutRequestModule {
};
PayoutRequestModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            user_module_1.UserModule,
            studio_module_1.StudioModule,
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => earning_module_1.EarningModule),
            common_1.forwardRef(() => payment_information_module_1.PaymentInformationModule)
        ],
        providers: [
            ...payout_request_provider_1.payoutRequestProviders,
            services_1.PayoutRequestService,
            services_1.StudioPayoutRequestService,
            listeners_1.UpdatePayoutRequestListener
        ],
        controllers: [
            controllers_1.PayoutRequestController,
            controllers_1.StudioPayoutRequestController,
            controllers_1.AdminPayoutRequestController,
            controllers_1.PayoutRequestSearchController
        ],
        exports: [services_1.PayoutRequestService, services_1.StudioPayoutRequestService]
    })
], PayoutRequestModule);
exports.PayoutRequestModule = PayoutRequestModule;
//# sourceMappingURL=payout.module.js.map