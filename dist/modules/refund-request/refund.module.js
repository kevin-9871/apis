"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundRequestModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const listeners_1 = require("./listeners");
const auth_module_1 = require("../auth/auth.module");
const refund_request_provider_1 = require("./providers/refund-request.provider");
const refund_request_service_1 = require("./services/refund-request.service");
const refund_request_controller_1 = require("./controllers/refund-request.controller");
const user_module_1 = require("../user/user.module");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const mailer_module_1 = require("../mailer/mailer.module");
const setting_module_1 = require("../settings/setting.module");
const payment_module_1 = require("../payment/payment.module");
let RefundRequestModule = class RefundRequestModule {
};
RefundRequestModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            user_module_1.UserModule,
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => payment_module_1.PaymentModule)
        ],
        providers: [
            ...refund_request_provider_1.refundRequestProviders,
            listeners_1.RefundRequestUpdateListener,
            refund_request_service_1.RefundRequestService
        ],
        controllers: [refund_request_controller_1.RefundRequestController],
        exports: [refund_request_service_1.RefundRequestService]
    })
], RefundRequestModule);
exports.RefundRequestModule = RefundRequestModule;
//# sourceMappingURL=refund.module.js.map