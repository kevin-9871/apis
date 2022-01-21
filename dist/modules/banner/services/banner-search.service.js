"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
let BannerSearchService = class BannerSearchService {
    constructor(bannerModel, fileService) {
        this.bannerModel = bannerModel;
        this.fileService = fileService;
    }
    async search(req) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.bannerModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.bannerModel.countDocuments(query)
        ]);
        const fileIds = data.map((d) => d.fileId);
        const banners = data.map((v) => new dtos_1.BannerDto(v));
        const [files] = await Promise.all([
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        banners.forEach((v) => {
            const file = v.fileId && files.find((f) => f._id.toString() === v.fileId.toString());
            if (file) {
                v.photo = {
                    thumbnails: file.getThumbnails(),
                    url: file.getUrl(),
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                };
            }
        });
        return {
            data: banners,
            total
        };
    }
};
BannerSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.BANNER_PROVIDER)),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.FileService])
], BannerSearchService);
exports.BannerSearchService = BannerSearchService;
//# sourceMappingURL=banner-search.service.js.map