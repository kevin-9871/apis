"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
class PostModel extends mongoose_1.Document {
    constructor() {
        super(...arguments);
        this.type = 'post';
        this.categoryIds = [];
        this.categorySearchIds = [];
        this.status = 'draft';
    }
}
exports.PostModel = PostModel;
//# sourceMappingURL=post.model.js.map