"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneCodeService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
let PhoneCodeService = class PhoneCodeService {
    getList() {
        if (this.phoneCodeList) {
            return this.phoneCodeList;
        }
        this.phoneCodeList = lodash_1.uniqBy(constants_1.PHONE_CODE, (c) => c.dialCode).map((c) => ({
            name: c.name,
            code: c.dialCode
        }));
        return this.phoneCodeList;
    }
};
PhoneCodeService = __decorate([
    common_1.Injectable()
], PhoneCodeService);
exports.PhoneCodeService = PhoneCodeService;
//# sourceMappingURL=phone-code.service.js.map