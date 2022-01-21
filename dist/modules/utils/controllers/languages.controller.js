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
exports.LanguageController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const language_service_1 = require("../services/language.service");
let LanguageController = class LanguageController {
    constructor(languageService) {
        this.languageService = languageService;
    }
    list() {
        return kernel_1.DataResponse.ok(this.languageService.getList());
    }
};
__decorate([
    common_1.Get('list'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LanguageController.prototype, "list", null);
LanguageController = __decorate([
    common_1.Injectable(),
    common_1.Controller('languages'),
    __metadata("design:paramtypes", [language_service_1.LanguageService])
], LanguageController);
exports.LanguageController = LanguageController;
//# sourceMappingURL=languages.controller.js.map