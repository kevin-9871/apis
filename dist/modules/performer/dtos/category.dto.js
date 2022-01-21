"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerCategoryDto = void 0;
const lodash_1 = require("lodash");
class PerformerCategoryDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'name',
            'slug',
            'ordering',
            'description',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PerformerCategoryDto = PerformerCategoryDto;
//# sourceMappingURL=category.dto.js.map