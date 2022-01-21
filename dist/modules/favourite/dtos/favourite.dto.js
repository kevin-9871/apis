"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteDto = void 0;
const lodash_1 = require("lodash");
const dtos_1 = require("../../performer/dtos");
class FavouriteDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            'favoriteId',
            'ownerId',
            'performer',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.FavouriteDto = FavouriteDto;
//# sourceMappingURL=favourite.dto.js.map