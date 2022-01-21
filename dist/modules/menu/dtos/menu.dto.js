"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDto = void 0;
const lodash_1 = require("lodash");
class MenuDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'title',
            'path',
            'internal',
            'parentId',
            'help',
            'section',
            'public',
            'ordering',
            'isPage',
            'isNewTab',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.MenuDto = MenuDto;
//# sourceMappingURL=menu.dto.js.map