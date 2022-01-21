"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedItemModule = void 0;
const kernel_1 = require("../../kernel");
const common_1 = require("@nestjs/common");
const studio_module_1 = require("../studio/studio.module");
const message_module_1 = require("../message/message.module");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const providers_1 = require("./providers");
const setting_module_1 = require("../settings/setting.module");
const file_module_1 = require("../file/file.module");
const mailer_module_1 = require("../mailer/mailer.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const token_package_module_1 = require("../token-package/token-package.module");
const listeners_1 = require("./listeners");
const socket_module_1 = require("../socket/socket.module");
let PurchasedItemModule = class PurchasedItemModule {
};
PurchasedItemModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule),
            common_1.forwardRef(() => token_package_module_1.TokenPackageModule),
            common_1.forwardRef(() => socket_module_1.SocketModule),
            common_1.forwardRef(() => studio_module_1.StudioModule),
            common_1.forwardRef(() => message_module_1.MessageModule)
        ],
        providers: [
            ...providers_1.paymentTokenProviders,
            services_1.PurchaseItemService,
            services_1.PurchasedItemSearchService,
            listeners_1.PaymentTokenListener,
            services_1.PaymentTokenService
        ],
        controllers: [
            controllers_1.PaymentTokenController,
            controllers_1.PaymentTokenSearchController,
            controllers_1.MemberPaymentToken
        ],
        exports: [
            services_1.PurchaseItemService,
            services_1.PurchasedItemSearchService,
            services_1.PaymentTokenService
        ]
    })
], PurchasedItemModule);
exports.PurchasedItemModule = PurchasedItemModule;
//# sourceMappingURL=purchased-item.module.js.map