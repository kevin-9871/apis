"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_config_1 = require("nestjs-config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const socket_module_1 = require("./modules/socket/socket.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const setting_module_1 = require("./modules/settings/setting.module");
const mailer_module_1 = require("./modules/mailer/mailer.module");
const post_module_1 = require("./modules/post/post.module");
const file_module_1 = require("./modules/file/file.module");
const performer_module_1 = require("./modules/performer/performer.module");
const utils_module_1 = require("./modules/utils/utils.module");
const performer_assets_module_1 = require("./modules/performer-assets/performer-assets.module");
const stream_module_1 = require("./modules/stream/stream.module");
const token_package_module_1 = require("./modules/token-package/token-package.module");
const favourite_module_1 = require("./modules/favourite/favourite.module");
const payment_module_1 = require("./modules/payment/payment.module");
const message_module_1 = require("./modules/message/message.module");
const purchased_item_module_1 = require("./modules/purchased-item/purchased-item.module");
const earning_module_1 = require("./modules/earning/earning.module");
const refund_module_1 = require("./modules/refund-request/refund.module");
const payout_module_1 = require("./modules/payout-request/payout.module");
const menu_module_1 = require("./modules/menu/menu.module");
const banner_module_1 = require("./modules/banner/banner.module");
const payment_information_module_1 = require("./modules/payment-information/payment-information.module");
const statistic_module_1 = require("./modules/statistic/statistic.module");
const studio_module_1 = require("./modules/studio/studio.module");
const cam_aggregator_module_1 = require("./modules/cam-aggregator/cam-aggregator.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            nestjs_config_1.ConfigModule.resolveRootPath(__dirname).load('config/**/!(*.d).{ts,js}'),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.join(__dirname, '..', 'public')
            }),
            socket_module_1.SocketModule,
            auth_module_1.AuthModule,
            setting_module_1.SettingModule,
            user_module_1.UserModule,
            post_module_1.PostModule,
            mailer_module_1.MailerModule,
            file_module_1.FileModule,
            utils_module_1.UtilsModule,
            performer_module_1.PerformerModule,
            performer_assets_module_1.PerformerAssetsModule,
            stream_module_1.StreamModule,
            token_package_module_1.TokenPackageModule,
            favourite_module_1.FavouriteModule,
            payment_module_1.PaymentModule,
            message_module_1.MessageModule,
            purchased_item_module_1.PurchasedItemModule,
            earning_module_1.EarningModule,
            refund_module_1.RefundRequestModule,
            payout_module_1.PayoutRequestModule,
            menu_module_1.MenuModule,
            banner_module_1.BannerModule,
            payment_information_module_1.PaymentInformationModule,
            statistic_module_1.StatisticModule,
            studio_module_1.StudioModule,
            cam_aggregator_module_1.CamAggregatorModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map