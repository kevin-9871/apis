"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const payment_module_1 = require("../payment/payment.module");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const services_1 = require("./services");
const menu_controller_1 = require("./controllers/menu.controller");
let MenuModule = class MenuModule {
};
MenuModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => payment_module_1.PaymentModule)
        ],
        providers: [...providers_1.menuProviders, services_1.MenuService, services_1.MenuSearchService],
        controllers: [menu_controller_1.AdminMenuController],
        exports: [...providers_1.menuProviders, services_1.MenuService, services_1.MenuSearchService]
    })
], MenuModule);
exports.MenuModule = MenuModule;
//# sourceMappingURL=menu.module.js.map