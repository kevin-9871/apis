"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUpdateDto = exports.AuthCreateDto = void 0;
class AuthCreateDto {
    constructor(data) {
        this.source = 'user';
        this.type = 'email';
        this.source = data.source || 'user';
        this.type = data.type || 'email';
        this.sourceId = data.sourceId;
        this.key = data.key;
        this.value = data.value;
    }
}
exports.AuthCreateDto = AuthCreateDto;
class AuthUpdateDto extends AuthCreateDto {
}
exports.AuthUpdateDto = AuthUpdateDto;
//# sourceMappingURL=auth.dto.js.map