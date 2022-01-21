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
exports.UpdateCommissionPayload = exports.MemberSetActivePayload = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../constants");
class MemberSetActivePayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn([constants_1.STUDIO_STATUES.ACTIVE, constants_1.STUDIO_STATUES.INACTIVE]),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MemberSetActivePayload.prototype, "status", void 0);
exports.MemberSetActivePayload = MemberSetActivePayload;
class UpdateCommissionPayload {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0),
    class_validator_1.Max(100),
    __metadata("design:type", Number)
], UpdateCommissionPayload.prototype, "commission", void 0);
exports.UpdateCommissionPayload = UpdateCommissionPayload;
//# sourceMappingURL=member-update.payload.js.map