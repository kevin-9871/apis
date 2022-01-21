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
exports.PasswordUserChangePayload = exports.PasswordChangePayload = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class PasswordChangePayload {
    constructor() {
        this.source = 'user';
        this.type = 'email';
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], PasswordChangePayload.prototype, "source", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], PasswordChangePayload.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(6),
    class_validator_1.MaxLength(14),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], PasswordChangePayload.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MinLength(6),
    class_validator_1.MaxLength(14),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], PasswordChangePayload.prototype, "prePassword", void 0);
exports.PasswordChangePayload = PasswordChangePayload;
class PasswordUserChangePayload {
    constructor() {
        this.type = 'email';
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], PasswordUserChangePayload.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PasswordUserChangePayload.prototype, "source", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PasswordUserChangePayload.prototype, "userId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(6),
    class_validator_1.MaxLength(14),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], PasswordUserChangePayload.prototype, "password", void 0);
exports.PasswordUserChangePayload = PasswordUserChangePayload;
//# sourceMappingURL=password-update.payload.js.map