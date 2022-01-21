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
exports.CurrecyCodeController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
let CurrecyCodeController = class CurrecyCodeController {
    constructor(currencyCodeService) {
        this.currencyCodeService = currencyCodeService;
    }
    list() {
        return kernel_1.DataResponse.ok(this.currencyCodeService.getList());
    }
};
__decorate([
    common_1.Get('list'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CurrecyCodeController.prototype, "list", null);
CurrecyCodeController = __decorate([
    common_1.Injectable(),
    common_1.Controller('currency-codes'),
    __metadata("design:paramtypes", [services_1.CurrencyCodeService])
], CurrecyCodeController);
exports.CurrecyCodeController = CurrecyCodeController;
//# sourceMappingURL=currency-codes.controller.js.map