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
exports.ProductSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const constants_1 = require("../../purchased-item/constants");
const services_3 = require("../../purchased-item/services");
const constants_2 = require("../constants");
const dtos_1 = require("../dtos");
const providers_1 = require("../providers");
let ProductSearchService = class ProductSearchService {
    constructor(productModel, performerService, fileService, paymentTokenService) {
        this.productModel = productModel;
        this.performerService = performerService;
        this.fileService = fileService;
        this.paymentTokenService = paymentTokenService;
    }
    async adminSearch(req) {
        const query = {};
        if (req.q)
            query.name = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.status)
            query.status = req.status;
        if (req.publish)
            query.publish = req.publish;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const imageIds = data.map(d => d.imageId);
        const [performers, images] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : []
        ]);
        const products = data.map(product => {
            const performer = performers.find(p => p._id.toString() === product.performerId.toString());
            const file = images.length > 0 && product.imageId
                ? images.find(f => f._id.toString() === product.imageId.toString())
                : null;
            return Object.assign(Object.assign({}, product), { performer: performer && { username: performer.username }, image: file && file.getUrl() });
        });
        return {
            data: products.map(v => new dtos_1.ProductDto(v)),
            total
        };
    }
    async performerSearch(req, user, jwToken) {
        const query = {};
        if (req.q)
            query.name = { $regex: req.q };
        query.performerId = user._id;
        if (req.status)
            query.status = req.status;
        if (req.publish)
            query.publish = req.publish;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const imageIds = data.map(d => d.imageId);
        const digitalFileIds = data
            .filter(d => d.type === constants_2.PRODUCT_TYPE.DIGITAL)
            .map(d => d.digitalFileId);
        const [performers, images, digitalFiles] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : [],
            digitalFileIds.length ? this.fileService.findByIds(digitalFileIds) : []
        ]);
        const products = data.map(product => {
            const { performerId, imageId, digitalFileId, type } = product;
            const performer = performerId &&
                performers.find(p => p._id.toString() === performerId.toString());
            const file = images.length > 0 && imageId
                ? images.find(f => f._id.toString() === imageId.toString())
                : null;
            const digitalFile = digitalFiles.length > 0 &&
                type === constants_2.PRODUCT_TYPE.DIGITAL &&
                digitalFileId
                ? digitalFiles.find(f => f._id.toString() === digitalFileId.toString())
                : null;
            return Object.assign(Object.assign({}, product), { performer: performer && { username: performer.username }, image: file && file.getUrl(), digitalFile: digitalFile &&
                    `${digitalFile.getUrl()}?productId=${product._id}&token=${jwToken}` });
        });
        return {
            data: products.map(v => new dtos_1.ProductDto(v)),
            total
        };
    }
    async userSearch(req, user) {
        const query = {};
        if (req.q)
            query.name = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.productId)
            query._id = { $ne: req.productId };
        if (req.type)
            query.type = req.type;
        query.status = 'active';
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.productModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.productModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const imageIds = data.map(d => d.imageId);
        const productIds = data.map(d => d._id);
        const [performers, images, payments] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            imageIds.length ? this.fileService.findByIds(imageIds) : [],
            user
                ? this.paymentTokenService.findByQuery({
                    target: constants_1.PURCHASE_ITEM_TARGET_TYPE.PRODUCT,
                    sourceId: user._id,
                    targetId: { $in: productIds },
                    status: constants_1.PURCHASE_ITEM_STATUS.SUCCESS
                })
                : []
        ]);
        const products = data.map(product => {
            const performer = performers.find(p => p._id.toString() === product.performerId.toString());
            const purchased = user &&
                payments.find(p => p.targetId.toString() === product._id.toString());
            const file = images.length > 0 &&
                product.imageId &&
                images.find(f => f._id.toString() === product.imageId.toString());
            return Object.assign(Object.assign({}, product), { performer: performer && {
                    username: performer.username
                }, image: file && file.getUrl(), isBought: !!purchased });
        });
        return {
            data: products.map(v => new dtos_1.ProductDto(v)),
            total
        };
    }
};
ProductSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.FileService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_3.PaymentTokenService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.PerformerService,
        services_2.FileService,
        services_3.PaymentTokenService])
], ProductSearchService);
exports.ProductSearchService = ProductSearchService;
//# sourceMappingURL=product-search.service.js.map