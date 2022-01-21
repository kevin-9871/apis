"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const providers_1 = require("./providers");
const controllers_1 = require("./controllers");
const services_1 = require("./services");
const auth_module_1 = require("../auth/auth.module");
const file_module_1 = require("../file/file.module");
const user_connected_listener_1 = require("./listeners/user-connected.listener");
const setting_module_1 = require("../settings/setting.module");
let UserModule = class UserModule {
};
UserModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => setting_module_1.SettingModule)
        ],
        providers: [...providers_1.userProviders, services_1.UserService, services_1.UserSearchService, user_connected_listener_1.UserConnectedListener],
        controllers: [
            controllers_1.UserController,
            controllers_1.AvatarController,
            controllers_1.AdminUserController,
            controllers_1.AdminAvatarController
        ],
        exports: [...providers_1.userProviders, services_1.UserService, services_1.UserSearchService, user_connected_listener_1.UserConnectedListener]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map