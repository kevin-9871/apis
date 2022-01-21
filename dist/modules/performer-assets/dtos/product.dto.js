"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDto = void 0;
const lodash_1 = require("lodash");
class ProductDto {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'digitalFileId',
            'imageId',
            'image',
            'digitalFile',
            'type',
            'name',
            'description',
            'publish',
            'isBought',
            'status',
            'token',
            'stock',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt'
        ]));
    }
    toPublic() {
        return lodash_1.pick(this, [
            '_id',
            'performerId',
            'image',
            'type',
            'name',
            'description',
            'status',
            'token',
            'stock',
            'publish',
            'isBought',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt'
        ]);
    }
}
exports.ProductDto = ProductDto;
//# sourceMappingURL=product.dto.js.map