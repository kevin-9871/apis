"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const kernel_1 = require("../../kernel");
const common_1 = require("@nestjs/common");
const request_log_middleware_1 = require("../../kernel/logger/request-log.middleware");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const providers_1 = require("./providers");
const setting_module_1 = require("../settings/setting.module");
const mailer_module_1 = require("../mailer/mailer.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const token_package_module_1 = require("../token-package/token-package.module");
const update_order_status_transaction_success_listener_1 = require("./listeners/update-order-status-transaction-success.listener");
const update_user_balance_from_order_success_listener_1 = require("./listeners/update-user-balance-from-order-success.listener");
const create_order_from_purchased_item_listener_1 = require("./listeners/create-order-from-purchased-item.listener");
const order_controller_1 = require("./controllers/order.controller");
const order_search_service_1 = require("./services/order-search.service");
const notify_order_update_listener_1 = require("./listeners/notify-order-update.listener");
const file_module_1 = require("../file/file.module");
let PaymentModule = class PaymentModule {
    configure(consumer) {
        consumer
            .apply(request_log_middleware_1.RequestLoggerMiddleware)
            .forRoutes({ path: '/payment/*/callhook', method: common_1.RequestMethod.ALL });
    }
};
PaymentModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => setting_module_1.SettingModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => token_package_module_1.TokenPackageModule)
        ],
        providers: [
            ...providers_1.paymentProviders,
            services_1.OrderService,
            order_search_service_1.OrderSearchService,
            services_1.PaymentService,
            services_1.CCBillService,
            services_1.PaymentSearchService,
            update_order_status_transaction_success_listener_1.UpdateOrderStatusPaymentTransactionSuccessListener,
            update_user_balance_from_order_success_listener_1.UpdateUserBalanceFromOrderSuccessListener,
            create_order_from_purchased_item_listener_1.CreateOrderFromPurchasedItemListener,
            notify_order_update_listener_1.NotifyOrderUpdateListener
        ],
        controllers: [
            controllers_1.PaymentController,
            controllers_1.PaymentWebhookController,
            controllers_1.PaymentSearchController,
            order_controller_1.OrderController
        ],
        exports: [...providers_1.paymentProviders, services_1.PaymentService, services_1.PaymentSearchService, services_1.OrderService]
    })
], PaymentModule);
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment.module.js.map