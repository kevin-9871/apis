"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPackageModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const providers_1 = require("./providers");
const auth_module_1 = require("../auth/auth.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
let TokenPackageModule = class TokenPackageModule {
};
TokenPackageModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => auth_module_1.AuthModule)
        ],
        providers: [
            ...providers_1.assetsProviders,
            services_1.TokenPackageService,
            services_1.TokenPackageSearchService
        ],
        controllers: [controllers_1.AdminTokenPackageController, controllers_1.TokenPackageController],
        exports: [services_1.TokenPackageService, services_1.TokenPackageSearchService]
    })
], TokenPackageModule);
exports.TokenPackageModule = TokenPackageModule;
//# sourceMappingURL=token-package.module.js.map