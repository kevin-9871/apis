"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const providers_1 = require("./providers");
const auth_module_1 = require("../auth/auth.module");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
const user_module_1 = require("../user/user.module");
const performer_module_1 = require("../performer/performer.module");
let FavouriteModule = class FavouriteModule {
};
FavouriteModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => auth_module_1.AuthModule)
        ],
        providers: [...providers_1.assetsProviders, services_1.FavouriteService],
        controllers: [controllers_1.PerformerFavouriteController, controllers_1.UserFavouriteController],
        exports: [services_1.FavouriteService]
    })
], FavouriteModule);
exports.FavouriteModule = FavouriteModule;
//# sourceMappingURL=favourite.module.js.map