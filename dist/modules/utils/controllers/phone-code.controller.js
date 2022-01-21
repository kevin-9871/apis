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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneCodeController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const phone_code_service_1 = require("../services/phone-code.service");
let PhoneCodeController = class PhoneCodeController {
    constructor(phoneCodeService) {
        this.phoneCodeService = phoneCodeService;
    }
    list() {
        return kernel_1.DataResponse.ok(this.phoneCodeService.getList());
    }
};
__decorate([
    common_1.Get('list'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneCodeController.prototype, "list", null);
PhoneCodeController = __decorate([
    common_1.Injectable(),
    common_1.Controller('phone-codes'),
    __metadata("design:paramtypes", [phone_code_service_1.PhoneCodeService])
], PhoneCodeController);
exports.PhoneCodeController = PhoneCodeController;
//# sourceMappingURL=phone-code.controller.js.map