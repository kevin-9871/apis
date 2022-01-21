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
exports.RefundRequestSearchPayload = exports.RefundRequestUpdatePayload = exports.RefundRequestCreatePayload = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("../../../kernel/common");
const constants_1 = require("../constants");
class RefundRequestCreatePayload {
    constructor() {
        this.sourceType = 'order';
    }
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    __metadata("design:type", Object)
], RefundRequestCreatePayload.prototype, "sourceType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RefundRequestCreatePayload.prototype, "sourceId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RefundRequestCreatePayload.prototype, "performerId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], RefundRequestCreatePayload.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(1),
    __metadata("design:type", Number)
], RefundRequestCreatePayload.prototype, "token", void 0);
exports.RefundRequestCreatePayload = RefundRequestCreatePayload;
class RefundRequestUpdatePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsIn([constants_1.STATUES.PENDING, constants_1.STATUES.REJECTED, constants_1.STATUES.RESOLVED]),
    __metadata("design:type", String)
], RefundRequestUpdatePayload.prototype, "status", void 0);
exports.RefundRequestUpdatePayload = RefundRequestUpdatePayload;
class RefundRequestSearchPayload extends common_1.SearchRequest {
}
exports.RefundRequestSearchPayload = RefundRequestSearchPayload;
//# sourceMappingURL=refund-request.payload.js.map