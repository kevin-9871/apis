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
exports.ProductUpdatePayload = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../constants");
class ProductUpdatePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ProductUpdatePayload.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], ProductUpdatePayload.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn([constants_1.PRODUCT_STATUS.ACTIVE, constants_1.PRODUCT_STATUS.INACTIVE]),
    __metadata("design:type", String)
], ProductUpdatePayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn([constants_1.PRODUCT_TYPE.DIGITAL, constants_1.PRODUCT_TYPE.PHYSICAL]),
    __metadata("design:type", String)
], ProductUpdatePayload.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNumberString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], ProductUpdatePayload.prototype, "token", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNumberString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], ProductUpdatePayload.prototype, "stock", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsBooleanString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], ProductUpdatePayload.prototype, "publish", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], ProductUpdatePayload.prototype, "performerId", void 0);
exports.ProductUpdatePayload = ProductUpdatePayload;
//# sourceMappingURL=product-update.payload.js.map