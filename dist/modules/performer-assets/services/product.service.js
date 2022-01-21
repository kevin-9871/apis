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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../../file/services");
const services_2 = require("../../performer/services");
const lodash_1 = require("lodash");
const constants_1 = require("../../../kernel/constants");
const services_3 = require("../../purchased-item/services");
const constants_2 = require("../../purchased-item/constants");
const constants_3 = require("../constants");
const dtos_2 = require("../dtos");
const exceptions_1 = require("../exceptions");
const providers_1 = require("../providers");
let ProductService = class ProductService {
    constructor(ProductModel, performerService, fileService, queueEventService, paymentTokenService) {
        this.ProductModel = ProductModel;
        this.performerService = performerService;
        this.fileService = fileService;
        this.queueEventService = queueEventService;
        this.paymentTokenService = paymentTokenService;
    }
    async create(payload, digitalFile, imageFile, creator) {
        if (payload.type === constants_3.PRODUCT_TYPE.DIGITAL && !digitalFile) {
            imageFile && this.fileService.remove(imageFile._id);
            throw new exceptions_1.InvalidFileException('Missing digital file');
        }
        if (payload.type === constants_3.PRODUCT_TYPE.PHYSICAL && !payload.stock) {
            throw new exceptions_1.PhysicalProductStockException();
        }
        const product = new this.ProductModel(payload);
        if (digitalFile)
            product.digitalFileId = digitalFile._id;
        if (imageFile)
            product.imageId = imageFile._id;
        if (creator) {
            product.createdBy = creator._id;
            product.updatedBy = creator._id;
        }
        await product.save();
        await Promise.all([
            digitalFile && this.fileService.addRef(digitalFile._id, { itemId: product._id, itemType: 'digital-product' }),
            imageFile && this.fileService.addRef(imageFile._id, { itemId: product._id, itemType: 'performer-product' })
        ]);
        const dto = new dtos_2.ProductDto(product);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: dto
        }));
        return dto;
    }
    async update(id, payload, digitalFile, imageFile, updater) {
        const product = await this.ProductModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = product.status;
        if (payload.type === constants_3.PRODUCT_TYPE.DIGITAL
            && !product.digitalFileId
            && !digitalFile) {
            throw new exceptions_1.InvalidFileException('Missing digital file');
        }
        if (payload.type === constants_3.PRODUCT_TYPE.PHYSICAL && !payload.stock) {
            throw new exceptions_1.PhysicalProductStockException();
        }
        lodash_1.merge(product, payload);
        const deletedFileIds = [];
        if (digitalFile) {
            product.digitalFileId && deletedFileIds.push(product.digitalFileId);
            product.digitalFileId = digitalFile._id;
        }
        if (imageFile) {
            product.imageId && deletedFileIds.push(product.imageId);
            product.imageId = imageFile._id;
        }
        if (updater)
            product.updatedBy = updater._id;
        await product.save();
        deletedFileIds.length
            && (await Promise.all(deletedFileIds.map((deletedFileId) => this.fileService.remove(deletedFileId))));
        const dto = new dtos_2.ProductDto(product);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, dto), { oldStatus })
        }));
        return dto;
    }
    async delete(id) {
        const product = await this.ProductModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        await product.remove();
        product.digitalFileId && await this.fileService.remove(product.digitalFileId);
        product.imageId && await this.fileService.remove(product.imageId);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_PRODUCT_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new dtos_2.ProductDto(product)
        }));
        return true;
    }
    async getDetails(id) {
        const product = await this.ProductModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [performer, imageFile] = await Promise.all([
            this.performerService.findById(product.performerId),
            product.imageId ? this.fileService.findById(product.imageId) : null
        ]);
        const dto = new dtos_2.ProductDto(product);
        dto.image = imageFile ? imageFile.getUrl() : null;
        dto.performer = {
            username: performer.username
        };
        return dto;
    }
    async performerGetDetails(id, jwToken) {
        const product = await this.ProductModel.findOne({ _id: id });
        if (!product) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [performer, digitalFile, imageFile] = await Promise.all([
            this.performerService.findById(product.performerId),
            product.type === constants_3.PRODUCT_TYPE.DIGITAL && product.digitalFileId
                ? this.fileService.findById(product.digitalFileId)
                : null,
            product.imageId ? this.fileService.findById(product.imageId) : null
        ]);
        const dto = new dtos_2.ProductDto(product);
        dto.image = imageFile ? imageFile.getUrl() : null;
        dto.digitalFile = digitalFile ? `${digitalFile.getUrl()}?productId=${product._id}&token=${jwToken}` : null;
        dto.performer = {
            username: performer.username
        };
        return dto;
    }
    async findByIds(ids) {
        const productIds = lodash_1.uniq(ids.map((i) => i.toString()));
        const products = await this.ProductModel
            .find({
            _id: {
                $in: productIds
            }
        })
            .lean()
            .exec();
        return products.map((p) => new dtos_2.ProductDto(p));
    }
    async findById(id) {
        const product = await this.ProductModel.findById(id);
        return new dtos_2.ProductDto(product);
    }
    async findByPerformerIds(ids) {
        return this.ProductModel
            .find({
            performerId: {
                $in: ids
            }
        })
            .lean()
            .exec();
    }
    async updateStock(id, num = -1) {
        return this.ProductModel.updateOne({ _id: id }, { $inc: { stock: num } });
    }
    async checkAuth(req, user) {
        const { query } = req;
        if (!query.productId) {
            return false;
        }
        if (user.roles && user.roles.includes('admin')) {
            return true;
        }
        const product = await this.ProductModel.findById(query.productId);
        if (!product)
            return false;
        if (user._id.toString() === product.performerId.toString()) {
            return true;
        }
        if (product.type !== constants_3.PRODUCT_TYPE.DIGITAL) {
            return true;
        }
        const checkBought = await this.paymentTokenService.checkBought(product._id, constants_2.PurchaseItemType.PRODUCT, user);
        if (checkBought) {
            return true;
        }
        return false;
    }
};
ProductService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_PRODUCT_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_3.PaymentTokenService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_2.PerformerService,
        services_1.FileService,
        kernel_1.QueueEventService,
        services_3.PaymentTokenService])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map