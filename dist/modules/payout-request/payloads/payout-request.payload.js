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
exports.PayoutRequestSearchPayload = exports.PayoutRequestUpdatePayload = exports.PayoutRequestCreatePayload = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("../../../kernel/common");
const constants_1 = require("../constants");
class PayoutRequestCreatePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], PayoutRequestCreatePayload.prototype, "paymentAccountType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsIn([constants_1.SOURCE_TYPE.PERFORMER, constants_1.SOURCE_TYPE.STUDIO]),
    __metadata("design:type", String)
], PayoutRequestCreatePayload.prototype, "sourceType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Date)
], PayoutRequestCreatePayload.prototype, "fromDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Date)
], PayoutRequestCreatePayload.prototype, "toDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PayoutRequestCreatePayload.prototype, "requestNote", void 0);
exports.PayoutRequestCreatePayload = PayoutRequestCreatePayload;
class PayoutRequestUpdatePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsIn([constants_1.STATUES.PENDING, constants_1.STATUES.REJECTED, constants_1.STATUES.DONE, constants_1.STATUES.APPROVED]),
    __metadata("design:type", String)
], PayoutRequestUpdatePayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PayoutRequestUpdatePayload.prototype, "adminNote", void 0);
exports.PayoutRequestUpdatePayload = PayoutRequestUpdatePayload;
class PayoutRequestSearchPayload extends common_1.SearchRequest {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PayoutRequestSearchPayload.prototype, "performerId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PayoutRequestSearchPayload.prototype, "studioId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PayoutRequestSearchPayload.prototype, "sourceId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PayoutRequestSearchPayload.prototype, "paymentAccountType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsISO8601(),
    __metadata("design:type", Date)
], PayoutRequestSearchPayload.prototype, "fromDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsISO8601(),
    __metadata("design:type", Date)
], PayoutRequestSearchPayload.prototype, "toDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PayoutRequestSearchPayload.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PayoutRequestSearchPayload.prototype, "sourceType", void 0);
exports.PayoutRequestSearchPayload = PayoutRequestSearchPayload;
//# sourceMappingURL=payout-request.payload.js.map