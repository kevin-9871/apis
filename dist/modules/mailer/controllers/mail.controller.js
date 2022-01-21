"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const services_1 = require("../services");
const guards_1 = require("../../auth/guards");
const email_template_update_payload_1 = require("../payloads/email-template-update.payload");
let MailerController = class MailerController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async verify() {
        const data = await this.mailService.verify();
        return kernel_1.DataResponse.ok(data);
    }
    async update(payload, id) {
        const data = await this.mailService.updateTemplate(id, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async getAll() {
        const data = await this.mailService.getAllTemplates();
        return kernel_1.DataResponse.ok(data);
    }
    async findOne(id) {
        const data = await this.mailService.findOne(id);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Post('/verify'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "verify", null);
__decorate([
    common_1.Put('/templates/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_template_update_payload_1.EmailTemplateUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "update", null);
__decorate([
    common_1.Get('/templates'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "getAll", null);
__decorate([
    common_1.Get('/templates/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MailerController.prototype, "findOne", null);
MailerController = __decorate([
    common_1.Injectable(),
    common_1.Controller('mailer'),
    __metadata("design:paramtypes", [services_1.MailerService])
], MailerController);
exports.MailerController = MailerController;
//# sourceMappingURL=mail.controller.js.map