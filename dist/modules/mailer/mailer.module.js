"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const setting_module_1 = require("../settings/setting.module");
const services_1 = require("./services");
const mail_controller_1 = require("./controllers/mail.controller");
const providers_1 = require("./providers");
let MailerModule = class MailerModule {
};
MailerModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => setting_module_1.SettingModule)
        ],
        providers: [services_1.MailerService, ...providers_1.emailTemplateProviders],
        controllers: [mail_controller_1.MailerController],
        exports: [services_1.MailerService]
    })
], MailerModule);
exports.MailerModule = MailerModule;
//# sourceMappingURL=mailer.module.js.map