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
exports.UserAuthCreatePayload = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_create_payload_1 = require("./user-create.payload");
const constants_1 = require("../constants");
class UserAuthCreatePayload extends user_create_payload_1.UserCreatePayload {
    constructor(params) {
        super(params);
        if (params) {
            this.roles = params.roles;
            this.password = params.password;
            this.balance = params.balance;
        }
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], UserAuthCreatePayload.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UserAuthCreatePayload.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsArray(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn([constants_1.ROLE_ADMIN, constants_1.ROLE_USER], { each: true }),
    __metadata("design:type", Array)
], UserAuthCreatePayload.prototype, "roles", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsIn([constants_1.STATUS.ACTIVE, constants_1.STATUS.INACTIVE, constants_1.STATUS.PENDING]),
    __metadata("design:type", String)
], UserAuthCreatePayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], UserAuthCreatePayload.prototype, "balance", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], UserAuthCreatePayload.prototype, "emailVerified", void 0);
exports.UserAuthCreatePayload = UserAuthCreatePayload;
//# sourceMappingURL=user-auth-create.payload.js.map