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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const models_1 = require("../models");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let CategoryService = class CategoryService {
    constructor(categoryModel, queueEventService) {
        this.categoryModel = categoryModel;
        this.queueEventService = queueEventService;
    }
    async find(params) {
        return this.categoryModel.find(params);
    }
    async findByIdOrSlug(id) {
        const query = id instanceof mongodb_1.ObjectId || kernel_1.StringHelper.isObjectId(id)
            ? { _id: id }
            : { slug: id };
        return this.categoryModel.findOne(query);
    }
    async generateSlug(type, title, id) {
        const slug = kernel_1.StringHelper.createAlias(title);
        const query = { slug, type };
        if (id) {
            query._id = { $ne: id };
        }
        const count = await this.categoryModel.countDocuments(query);
        if (!count) {
            return slug;
        }
        return this.generateSlug(type, `${slug}1`, id);
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        if (user) {
            data.createdBy = user._id;
            data.updatedBy = user._id;
        }
        if (payload.parentId) {
            const parent = await this.categoryModel.findOne({ _id: payload.parentId });
            if (!parent) {
                throw new kernel_1.EntityNotFoundException('Parent category not found!');
            }
        }
        data.slug = await this.generateSlug(payload.type, payload.slug || payload.title);
        const category = await this.categoryModel.create(data);
        return category;
    }
    async update(id, payload, user) {
        const category = await this.findByIdOrSlug(id);
        if (!category) {
            throw new kernel_1.EntityNotFoundException();
        }
        category.title = payload.title;
        category.description = payload.description;
        if (payload.parentId && category.parentId && payload.parentId.toString() !== category.parentId.toString()) {
            const parent = await this.categoryModel.findOne({ _id: payload.parentId });
            if (!parent) {
                throw new kernel_1.EntityNotFoundException('Parent category not found!');
            }
        }
        category.parentId = payload.parentId || null;
        if (user) {
            category.updatedBy = user._id;
        }
        await category.save();
        return category;
    }
    async delete(id) {
        const category = id instanceof models_1.CategoryModel ? id : await this.findByIdOrSlug(id);
        if (!category) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.categoryModel.deleteOne({ _id: id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_1.POST_CATEGORY_CHANNEL,
            eventName: constants_1.CATEGORY_EVENTS.DELETED,
            data: category.toObject()
        }));
        if (category.parentId) {
            const children = await this.categoryModel.find({ parentId: category._id });
            await Promise.all(children.map((c) => this.delete(c)));
        }
    }
};
CategoryService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.POST_CATEGORY_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map