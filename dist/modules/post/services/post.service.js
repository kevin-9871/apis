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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_1 = require("../../file/services");
const file_1 = require("../../file");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let PostService = class PostService {
    constructor(postModel, postMetaModel, fileService, queueEventService) {
        this.postModel = postModel;
        this.postMetaModel = postMetaModel;
        this.fileService = fileService;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_1.POST_CATEGORY_CHANNEL, 'HANDLE_POST_CATEGORY', this.categoryChangeUpdater.bind(this));
    }
    async find(params) {
        return this.postModel.find(params);
    }
    async findByIdOrSlug(id) {
        const query = id instanceof mongodb_1.ObjectId || kernel_1.StringHelper.isObjectId(id)
            ? { _id: id }
            : { slug: id };
        return this.postModel.findOne(query);
    }
    async generateSlug(title, id) {
        const slug = kernel_1.StringHelper.createAlias(title);
        const query = { slug };
        if (id) {
            query._id = { $ne: id };
        }
        const count = await this.postModel.countDocuments(query);
        if (!count) {
            return slug;
        }
        return this.generateSlug(`${slug}1`, id);
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        if (user && !data.authorId) {
            data.authorId = user._id;
        }
        data.slug = await this.generateSlug(payload.slug || payload.title);
        const post = await this.postModel.create(data);
        if (payload.meta && Array.isArray(payload.meta)) {
            await Promise.all(payload.meta.map(meta => this.postMetaModel.create(Object.assign(Object.assign({}, meta), { postId: post._id }))));
        }
        return post;
    }
    async update(id, payload, user) {
        const post = await this.findByIdOrSlug(id);
        if (!post) {
            throw new common_1.NotFoundException();
        }
        post.content = payload.content;
        post.shortDescription = payload.shortDescription;
        payload.slug &&
            post.set('slug', await this.generateSlug(payload.slug, post._id));
        payload.status && post.set('status', payload.status);
        payload.image && post.set('image', payload.image);
        user && post.set('updatedBy', user._id);
        post.set('updatedAt', new Date());
        await post.save();
        if (payload.meta && Array.isArray(payload.meta)) {
            Promise.all(payload.meta.map(metaData => this.postModel.update({
                postId: post._id,
                key: metaData.key
            }, {
                postId: post._id,
                key: metaData.key,
                value: metaData.value
            }, {
                upsert: true
            })));
        }
        return post;
    }
    async delete(id) {
        const post = await this.findByIdOrSlug(id);
        if (!post) {
            throw new common_1.NotFoundException();
        }
        await post.remove();
        await this.postMetaModel.remove({ postId: post._id });
        return true;
    }
    async adminGetDetails(id) {
        const [post, meta] = await Promise.all([
            this.postModel.findById(id),
            this.postMetaModel.find({ postId: id })
        ]);
        if (!post) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.PostDto(post);
        dto.meta = meta;
        return dto;
    }
    async getPublic(id) {
        const post = await this.findByIdOrSlug(id);
        if (!post) {
            throw new kernel_1.EntityNotFoundException();
        }
        let image = post.image;
        if (string_helper_1.isObjectId(post.image)) {
            const file = await this.fileService.findById(post.image);
            if (file) {
                image = file_1.FileResponseDto.fromFile(new file_1.FileDto(file));
            }
        }
        const dto = new dtos_2.PostDto(post);
        dto.image = image;
        return dto;
    }
    async categoryChangeUpdater(event) {
        try {
            if (event.eventName !== constants_1.CATEGORY_EVENTS.DELETED) {
                return;
            }
            const categoryId = event.data._id;
            await this.postModel.updateMany({
                categoryIds: categoryId
            }, {
                $pull: {
                    categoryIds: categoryId,
                    categorySearchIds: categoryId
                }
            });
        }
        catch (e) {
        }
    }
};
PostService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.POST_MODEL_PROVIDER)),
    __param(1, common_1.Inject(providers_1.POST_META_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        services_1.FileService,
        kernel_1.QueueEventService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map