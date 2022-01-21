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
exports.AdminSearchPaymentInformationPayload = exports.AdminCreatePaymentInformationPayload = exports.PaymentInformationPayload = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
class PaymentInformationPayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn([
        constants_1.BANKING_TYPE.BITPAY,
        constants_1.BANKING_TYPE.DEPOSIT,
        constants_1.BANKING_TYPE.ISSUE,
        constants_1.BANKING_TYPE.PAYONNEER,
        constants_1.BANKING_TYPE.PAYPAL,
        constants_1.BANKING_TYPE.WIRE,
        constants_1.BANKING_TYPE.PAXUM
    ]),
    __metadata("design:type", String)
], PaymentInformationPayload.prototype, "type", void 0);
exports.PaymentInformationPayload = PaymentInformationPayload;
class AdminCreatePaymentInformationPayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn([
        constants_1.BANKING_TYPE.BITPAY,
        constants_1.BANKING_TYPE.DEPOSIT,
        constants_1.BANKING_TYPE.ISSUE,
        constants_1.BANKING_TYPE.PAYONNEER,
        constants_1.BANKING_TYPE.PAYPAL,
        constants_1.BANKING_TYPE.WIRE,
        constants_1.BANKING_TYPE.PAXUM
    ]),
    __metadata("design:type", String)
], AdminCreatePaymentInformationPayload.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], AdminCreatePaymentInformationPayload.prototype, "sourceId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], AdminCreatePaymentInformationPayload.prototype, "sourceType", void 0);
exports.AdminCreatePaymentInformationPayload = AdminCreatePaymentInformationPayload;
class AdminSearchPaymentInformationPayload extends kernel_1.SearchRequest {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.IsIn([
        constants_1.BANKING_TYPE.BITPAY,
        constants_1.BANKING_TYPE.DEPOSIT,
        constants_1.BANKING_TYPE.ISSUE,
        constants_1.BANKING_TYPE.PAYONNEER,
        constants_1.BANKING_TYPE.PAYPAL,
        constants_1.BANKING_TYPE.WIRE,
        constants_1.BANKING_TYPE.PAXUM
    ]),
    __metadata("design:type", String)
], AdminSearchPaymentInformationPayload.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AdminSearchPaymentInformationPayload.prototype, "sourceId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AdminSearchPaymentInformationPayload.prototype, "sourceType", void 0);
exports.AdminSearchPaymentInformationPayload = AdminSearchPaymentInformationPayload;
//# sourceMappingURL=index.js.map