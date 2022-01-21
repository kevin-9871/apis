"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPackageDto = void 0;
const lodash_1 = require("lodash");
class TokenPackageDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'name',
            'description',
            'ordering',
            'price',
            'tokens',
            'isActive',
            'pi_code',
            'updatedAt',
            'createdAt'
        ]));
    }
    toResponse() {
        return {
            _id: this._id,
            name: this.name,
            description: this.description,
            ordering: this.ordering,
            price: this.price,
            tokens: this.tokens,
            isActive: this.isActive,
            pi_code: this.pi_code,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt
        };
    }
}
exports.TokenPackageDto = TokenPackageDto;
//# sourceMappingURL=token-package.dto.js.map