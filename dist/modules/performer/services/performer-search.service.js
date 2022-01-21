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
exports.PerformerSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const common_2 = require("../../../kernel/common");
const mongodb_1 = require("mongodb");
const services_1 = require("../../favourite/services");
const dtos_1 = require("../../user/dtos");
const services_2 = require("../../studio/services");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let PerformerSearchService = class PerformerSearchService {
    constructor(performerModel, favoriteService, blockSettingModel, studioService) {
        this.performerModel = performerModel;
        this.favoriteService = favoriteService;
        this.blockSettingModel = blockSettingModel;
        this.studioService = studioService;
    }
    async search(req, user) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            if (!query.$and) {
                query.$and = [];
            }
            query.$and.push({
                $or: [
                    {
                        name: { $regex: regexp }
                    },
                    {
                        username: { $regex: regexp }
                    },
                    {
                        email: { $regex: regexp }
                    }
                ]
            });
        }
        if (req.status) {
            if (req.status === constants_1.PERFORMER_STATUSES.PENDING) {
                if (!query.$and) {
                    query.$and = [];
                }
                query.$and.push({
                    $or: [{ status: req.status }, { emailVerified: false }]
                });
            }
            else {
                query.status = req.status;
            }
        }
        if (req.gender) {
            query.gender = req.gender;
        }
        if (req.category) {
            query.categoryIds = new mongodb_1.ObjectId(req.category);
        }
        if (req.country) {
            query.country = req.country;
        }
        if (req.tags) {
            query.tags = req.tags;
        }
        if (req.studioId) {
            query.studioId = req.studioId;
        }
        if (req.isOnline) {
            query.isOnline = true;
        }
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.performerModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.performerModel.countDocuments(query)
        ]);
        const includePrivateInfo = user &&
            user.roles &&
            (user.roles.includes('admin') || user.roles.includes('studio'));
        const performerIds = data.map(p => p._id);
        const studoIds = data.map(p => p.studioId);
        const [studios, favorites] = await Promise.all([
            studoIds.length ? this.studioService.findByIds(studoIds) : [],
            user && performerIds.length
                ? this.favoriteService.find({
                    favoriteId: { $in: performerIds },
                    ownerId: user._id
                })
                : []
        ]);
        const performers = data.map(performer => {
            const isFavorite = favorites.find(f => f.favoriteId.toString() === performer._id.toString());
            const studio = studios.find(s => performer.studioId &&
                s._id.toString() === performer.studioId.toString());
            return Object.assign(Object.assign({}, performer), { studio: studio && studio.toResponse(), isFavorite: !!isFavorite });
        });
        return {
            total,
            data: performers.map(item => new dtos_2.PerformerDto(item).toResponse(includePrivateInfo))
        };
    }
    async advancedSearch(req, user, countryCode) {
        var _a;
        const query = {};
        const isAdmin = (_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin');
        if (req.q) {
            if (!query.$and) {
                query.$and = [];
            }
            const orQuery = [{
                    username: { $regex: req.q, $options: 'i' }
                }];
            if (isAdmin) {
                orQuery.push({
                    name: { $regex: req.q, $options: 'i' }
                }, {
                    email: { $regex: req.q, $options: 'i' }
                });
            }
            query.$and.push({
                $or: orQuery
            });
        }
        if (req.status) {
            if (req.status === constants_1.PERFORMER_STATUSES.PENDING) {
                if (!query.$and) {
                    query.$and = [];
                }
                query.$and.push({
                    $or: [{ status: req.status }, { emailVerified: false }]
                });
            }
            else {
                query.status = req.status;
            }
        }
        if (req.gender) {
            query.gender = req.gender;
        }
        if (req.category) {
            query.categoryIds = new mongodb_1.ObjectId(req.category);
        }
        if (req.country) {
            query.country = req.country;
        }
        if (req.tags) {
            query.tags = req.tags;
        }
        if (req.excludedId) {
            query._id = { $ne: req.excludedId };
        }
        let sort = {
            isOnline: -1,
            'stats.totalTokenEarned': -1,
            onlineAt: -1,
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort,
                isOnline: -1,
                onlineAt: -1,
                balance: -1
            };
        }
        const [data, total] = await Promise.all([
            this.performerModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.performerModel.countDocuments(query)
        ]);
        const performerIds = data.map(p => p._id);
        const [favorites, blockUsers] = await Promise.all([
            user
                ? this.favoriteService.find({
                    favoriteId: { $in: performerIds },
                    ownerId: user._id
                })
                : [],
            user
                ? this.blockSettingModel.find({
                    performerId: { $in: performerIds },
                    $or: [
                        {
                            userIds: { $in: [user._id] }
                        },
                        {
                            countries: { $in: [countryCode] }
                        }
                    ]
                })
                : this.blockSettingModel.find({
                    performerId: { $in: performerIds },
                    countries: { $in: [countryCode] }
                })
        ]);
        const performers = data.map(performer => {
            const favorite = favorites.length &&
                favorites.find(f => f.favoriteId.toString() === performer._id.toString());
            const blockUser = blockUsers.length &&
                blockUsers.find(b => b.performerId.toString() === performer._id.toString());
            return Object.assign(Object.assign({}, performer), { isFavorite: !!favorite, isBlocked: !!blockUser });
        });
        return {
            total,
            data: performers.map(item => new dtos_2.PerformerDto(item).toSearchResponse())
        };
    }
    async searchByKeyword(req) {
        const query = {};
        if (req.q) {
            const regexp = new RegExp(req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
            query.$or = [
                {
                    name: { $regex: regexp }
                },
                {
                    username: { $regex: regexp }
                },
                {
                    email: { $regex: regexp }
                }
            ];
        }
        const data = await this.performerModel.find(query).lean();
        return data;
    }
    async randomSelect(size) {
        const performers = await this.performerModel.aggregate([
            { $match: { status: 'active' } },
            { $sample: { size } },
            { $sort: { isOnline: -1, onlineAt: -1, balance: -1 } }
        ]);
        return {
            data: performers.map(p => new dtos_2.PerformerDto(p).toSearchResponse()),
            total: performers.length
        };
    }
};
PerformerSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_MODEL_PROVIDER)),
    __param(2, common_1.Inject(providers_1.PERFORMER_BLOCK_SETTING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.FavouriteService,
        mongoose_1.Model,
        services_2.StudioService])
], PerformerSearchService);
exports.PerformerSearchService = PerformerSearchService;
//# sourceMappingURL=performer-search.service.js.map