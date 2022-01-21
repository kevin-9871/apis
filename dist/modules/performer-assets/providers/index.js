"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsProviders = exports.PERFORMER_PRODUCT_MODEL_PROVIDER = exports.PERFORMER_GALLERY_MODEL_PROVIDER = exports.PERFORMER_PHOTO_MODEL_PROVIDER = exports.PERFORMER_VIDEO_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const schemas_1 = require("../schemas");
exports.PERFORMER_VIDEO_MODEL_PROVIDER = 'PERFORMER_VIDEO_MODEL_PROVIDER';
exports.PERFORMER_PHOTO_MODEL_PROVIDER = 'PERFORMER_PHOTO_MODEL_PROVIDER';
exports.PERFORMER_GALLERY_MODEL_PROVIDER = 'PERFORMER_GALLERY_MODEL_PROVIDER';
exports.PERFORMER_PRODUCT_MODEL_PROVIDER = 'PERFORMER_PRODUCT_MODEL_PROVIDER';
exports.assetsProviders = [
    {
        provide: exports.PERFORMER_VIDEO_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerVideo', schemas_1.VideoSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_PHOTO_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerPhoto', schemas_1.PhotoSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_GALLERY_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerGallery', schemas_1.GallerySchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.PERFORMER_PRODUCT_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('PerformerProduct', schemas_1.ProductSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map