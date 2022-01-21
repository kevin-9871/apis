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
let CategoryService = class CategoryService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async find(params) {
        return this.categoryModel.find(params);
    }
    async findByIdOrSlug(id) {
        const query = id instanceof mongodb_1.ObjectId || kernel_1.StringHelper.isObjectId(id) ? { _id: id } : { slug: id };
        return this.categoryModel.findOne(query);
    }
    async generateSlug(name, id) {
        const slug = kernel_1.StringHelper.createAlias(name);
        const query = { slug };
        if (id) {
            query._id = { $ne: id };
        }
        const count = await this.categoryModel.countDocuments(query);
        if (!count) {
            return slug;
        }
        return this.generateSlug(`${slug}1`, id);
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        if (user) {
            data.createdBy = user._id;
            data.updatedBy = user._id;
        }
        const orderingCheck = await this.categoryModel.countDocuments({
            ordering: payload.ordering
        });
        if (orderingCheck) {
            throw new common_1.ConflictException('Ordering is duplicated');
        }
        data.slug = await this.generateSlug(payload.slug || payload.name);
        const category = await this.categoryModel.create(data);
        return category;
    }
    async update(id, payload, user) {
        const category = await this.findByIdOrSlug(id);
        if (!category) {
            throw new kernel_1.EntityNotFoundException();
        }
        const orderingCheck = await this.categoryModel.countDocuments({
            ordering: payload.ordering,
            _id: { $ne: category._id }
        });
        if (orderingCheck) {
            throw new common_1.ConflictException('Ordering is duplicated');
        }
        category.name = payload.name;
        category.ordering = payload.ordering;
        category.description = payload.description;
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
    }
};
CategoryService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_CATEGORY_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map