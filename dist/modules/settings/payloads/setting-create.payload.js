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
exports.SettingCreatePayload = void 0;
const class_validator_1 = require("class-validator");
class SettingCreatePayload {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SettingCreatePayload.prototype, "key", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], SettingCreatePayload.prototype, "value", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SettingCreatePayload.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SettingCreatePayload.prototype, "description", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SettingCreatePayload.prototype, "group", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], SettingCreatePayload.prototype, "public", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], SettingCreatePayload.prototype, "type", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], SettingCreatePayload.prototype, "visible", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], SettingCreatePayload.prototype, "editable", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsObject(),
    __metadata("design:type", Object)
], SettingCreatePayload.prototype, "meta", void 0);
exports.SettingCreatePayload = SettingCreatePayload;
//# sourceMappingURL=setting-create.payload.js.map