"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
let LanguageService = class LanguageService {
    getList() {
        if (this.languageList) {
            return this.languageList;
        }
        this.languageList = constants_1.LANGUAGES.map((c) => ({
            name: c.name,
            code: c.code
        }));
        return this.languageList;
    }
};
LanguageService = __decorate([
    common_1.Injectable()
], LanguageService);
exports.LanguageService = LanguageService;
//# sourceMappingURL=language.service.js.map