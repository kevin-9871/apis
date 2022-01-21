"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProviders = exports.POST_CATEGORY_MODEL_PROVIDER = exports.POST_META_MODEL_PROVIDER = exports.POST_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.POST_MODEL_PROVIDER = 'POST_MODEL';
exports.POST_META_MODEL_PROVIDER = 'POST_META_MODEL';
exports.POST_CATEGORY_MODEL_PROVIDER = 'POST_CATEGORY_MODEL';
exports.postProviders = [
    {
        provide: exports.POST_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('Post', schemas_1.PostSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.POST_META_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PostMeta', schemas_1.PostMetaSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.POST_CATEGORY_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PostCategory', schemas_1.CategorySchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=post.provider.js.map