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
exports.FavouriteService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const constants_1 = require("../../../kernel/constants");
const providers_1 = require("../providers");
const services_1 = require("../../performer/services");
const dtos_3 = require("../dtos");
const constants_2 = require("../constants");
let FavouriteService = class FavouriteService {
    constructor(FavouriteModel, performerService, queueEventService) {
        this.FavouriteModel = FavouriteModel;
        this.performerService = performerService;
        this.queueEventService = queueEventService;
    }
    async find(params) {
        const favorites = await this.FavouriteModel.find(params);
        return favorites;
    }
    async findOne(params) {
        const favorite = await this.FavouriteModel.findOne(params);
        return favorite;
    }
    async findById(id) {
        const favourite = await this.FavouriteModel.findOne({ _id: id });
        return favourite;
    }
    async doLike(favoriteId, ownerId) {
        const performer = await this.performerService.findById(favoriteId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        let favourite = await this.FavouriteModel.findOne({ favoriteId, ownerId });
        if (!favourite) {
            favourite = new this.FavouriteModel();
            favourite.ownerId = ownerId;
            favourite.favoriteId = performer._id;
            await favourite.save();
        }
        this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.PERFORMER_FAVORITE_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: {
                performerId: favoriteId
            }
        }));
        return { success: true };
    }
    async doUnlike(favoriteId, ownerId) {
        const performer = await this.performerService.findById(favoriteId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const favourite = await this.FavouriteModel.findOne({
            favoriteId,
            ownerId
        });
        if (!favourite) {
            throw new kernel_1.EntityNotFoundException();
        }
        await favourite.remove();
        this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.PERFORMER_FAVORITE_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: {
                performerId: favoriteId
            }
        }));
        return { success: true };
    }
    async userSearch(req, currentUser) {
        const query = {};
        query.ownerId = currentUser._id;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.FavouriteModel.find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.FavouriteModel.count(query)
        ]);
        const performerIds = data.map(d => d.favoriteId);
        const performers = performerIds.length
            ? await this.performerService.findByIds(performerIds)
            : [];
        const favourites = data.map(favourite => {
            const performer = favourite.favoriteId &&
                performers.find(p => p._id.toString() === favourite.favoriteId.toString());
            return Object.assign(Object.assign({}, favourite), { performer: performer && performer.toResponse() });
        });
        return {
            total,
            data: favourites.map(d => new dtos_3.FavouriteDto(d))
        };
    }
    async performerSearch(req, currentUser) {
        const query = {};
        query.favoriteId = currentUser._id;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.FavouriteModel.find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.FavouriteModel.count(query)
        ]);
        const userIds = data.map(d => d.ownerId);
        const users = userIds.length
            ? await this.performerService.findByIds(userIds)
            : [];
        const favourites = data.map(favourite => {
            const user = favourite.ownerId &&
                users.find(u => u._id.toString() === favourite.ownerId.toString());
            if (user) {
                return Object.assign(Object.assign({}, favourite), { user: user.toResponse() });
            }
            return favourite;
        });
        return {
            total,
            data: favourites.map(d => new dtos_3.FavouriteDto(d))
        };
    }
    async getAllFollowerIdsByPerformerId(performerId) {
        const favourites = await this.FavouriteModel.find({ favoriteId: performerId });
        return favourites.map(f => f.ownerId);
    }
};
FavouriteService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.FAVOURITE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.PerformerService,
        kernel_1.QueueEventService])
], FavouriteService);
exports.FavouriteService = FavouriteService;
//# sourceMappingURL=favourite.service.js.map