"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentInformationModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const services_1 = require("./services");
const providers_1 = require("./providers");
const controllers_1 = require("./controllers");
const performer_module_1 = require("../performer/performer.module");
const studio_module_1 = require("../studio/studio.module");
let PaymentInformationModule = class PaymentInformationModule {
};
PaymentInformationModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => studio_module_1.StudioModule)
        ],
        providers: [...providers_1.paymentInformationProviders, services_1.PaymentInformationService],
        controllers: [controllers_1.PaymentInformationController],
        exports: [services_1.PaymentInformationService]
    })
], PaymentInformationModule);
exports.PaymentInformationModule = PaymentInformationModule;
//# sourceMappingURL=payment-information.module.js.map