"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerAssetsModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const purchased_item_module_1 = require("../purchased-item/purchased-item.module");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const user_module_1 = require("../user/user.module");
const file_module_1 = require("../file/file.module");
const video_service_1 = require("./services/video.service");
const admin_video_controller_1 = require("./controllers/admin-video.controller");
const performer_module_1 = require("../performer/performer.module");
const video_search_service_1 = require("./services/video-search.service");
const gallery_service_1 = require("./services/gallery.service");
const admin_gallery_controller_1 = require("./controllers/admin-gallery.controller");
const photo_service_1 = require("./services/photo.service");
const admin_photo_controller_1 = require("./controllers/admin-photo.controller");
const photo_search_service_1 = require("./services/photo-search.service");
const product_search_service_1 = require("./services/product-search.service");
const product_service_1 = require("./services/product.service");
const admin_product_controller_1 = require("./controllers/admin-product.controller");
const performer_product_controller_1 = require("./controllers/performer-product.controller");
const performer_video_controller_1 = require("./controllers/performer-video.controller");
const user_product_controller_1 = require("./controllers/user-product.controller");
const user_video_controller_1 = require("./controllers/user-video.controller");
const user_photo_controller_1 = require("./controllers/user-photo.controller");
const performer_photo_controller_1 = require("./controllers/performer-photo.controller");
const performer_gallery_controller_1 = require("./controllers/performer-gallery.controller");
const listeners_1 = require("./listeners");
const user_gallery_controller_1 = require("./controllers/user-gallery.controller");
const mailer_module_1 = require("../mailer/mailer.module");
let PerformerAssetsModule = class PerformerAssetsModule {
};
PerformerAssetsModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot(),
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            common_1.forwardRef(() => file_module_1.FileModule),
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => purchased_item_module_1.PurchasedItemModule),
            common_1.forwardRef(() => mailer_module_1.MailerModule)
        ],
        providers: [
            ...providers_1.assetsProviders,
            video_service_1.VideoService,
            video_search_service_1.VideoSearchService,
            gallery_service_1.GalleryService,
            photo_service_1.PhotoService,
            photo_search_service_1.PhotoSearchService,
            product_service_1.ProductService,
            product_search_service_1.ProductSearchService,
            listeners_1.StockProductListener,
            listeners_1.PerformerAssetsListener
        ],
        controllers: [
            admin_video_controller_1.AdminPerformerVideosController,
            admin_gallery_controller_1.AdminPerformerGalleryController,
            admin_photo_controller_1.AdminPerformerPhotoController,
            admin_product_controller_1.AdminPerformerProductsController,
            performer_product_controller_1.PerformerProductController,
            performer_video_controller_1.PerformerVideosController,
            performer_photo_controller_1.PerformerPhotoController,
            performer_gallery_controller_1.PerformerGalleryController,
            user_product_controller_1.UserProductsController,
            user_video_controller_1.UserVideosController,
            user_photo_controller_1.UserPhotosController,
            user_gallery_controller_1.UserGalleryController
        ],
        exports: [
            ...providers_1.assetsProviders,
            video_service_1.VideoService,
            video_search_service_1.VideoSearchService,
            gallery_service_1.GalleryService,
            photo_service_1.PhotoService,
            photo_search_service_1.PhotoSearchService,
            product_service_1.ProductService,
            product_search_service_1.ProductSearchService
        ]
    })
], PerformerAssetsModule);
exports.PerformerAssetsModule = PerformerAssetsModule;
//# sourceMappingURL=performer-assets.module.js.map