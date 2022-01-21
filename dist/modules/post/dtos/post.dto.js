"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDto = void 0;
const lodash_1 = require("lodash");
class PostDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'authorId',
            'type',
            'title',
            'slug',
            'content',
            'shortDescription',
            'categoryIds',
            'status',
            'meta',
            'image',
            'updatedBy',
            'createdBy',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PostDto = PostDto;
//# sourceMappingURL=post.dto.js.map