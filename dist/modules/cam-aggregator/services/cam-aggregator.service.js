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
exports.CamAggregatorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const constants_2 = require("../../utils/constants");
const xlovecam_service_1 = require("./xlovecam.service");
const chaturbate_service_1 = require("./chaturbate.service");
const providers_1 = require("../providers");
const bongacams_service_1 = require("./bongacams.service");
const stripcash_service_1 = require("./stripcash.service");
let CamAggregatorService = class CamAggregatorService {
    constructor(settingService, xLoveCamService, chaturbateService, bongaCamsService, stripcashService, agendaService, aggregatorPerformerModel, aggregatorCategoryModel) {
        this.settingService = settingService;
        this.xLoveCamService = xLoveCamService;
        this.chaturbateService = chaturbateService;
        this.bongaCamsService = bongaCamsService;
        this.stripcashService = stripcashService;
        this.agendaService = agendaService;
        this.aggregatorPerformerModel = aggregatorPerformerModel;
        this.aggregatorCategoryModel = aggregatorCategoryModel;
        this.defineJobs();
    }
    async defineJobs() {
        const collection = this.agendaService._collection;
        await collection.deleteMany({
            name: {
                $in: [
                    'syncLovexCamsPerformerData',
                    'syncBongaCamsPerformerData',
                    'syncChaturbatePerformerData',
                    'syncStripcashPerformerData'
                ]
            }
        });
        this.agendaService.define('syncLovexCamsPerformerData', this.syncXLoveCamsModels.bind(this));
        this.agendaService.schedule('10 seconds from now', 'syncLovexCamsPerformerData', {});
        this.agendaService.define('syncBongaCamsPerformerData', this.syncBongaCamsModels.bind(this));
        this.agendaService.schedule('10 seconds from now', 'syncBongaCamsPerformerData', {});
        this.agendaService.define('syncChaturbatePerformerData', this.syncChaturbateModels.bind(this));
        this.agendaService.schedule('10 seconds from now', 'syncChaturbatePerformerData', {});
        this.agendaService.define('syncStripcashPerformerData', this.syncStripcashodels.bind(this));
        this.agendaService.schedule('10 seconds from now', 'syncStripcashPerformerData', {});
    }
    static detectCountry(text) {
        if (!text)
            return null;
        let lowerCase = text.toLocaleLowerCase();
        if (lowerCase === 'english')
            lowerCase = 'us';
        return constants_2.COUNTRIES.find(country => {
            var _a, _b, _c, _d, _e;
            const cName = country.name.toLowerCase();
            const cName2 = ((_a = country.code) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            const lName = ((_c = (_b = country.language) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
            const lName2 = ((_e = (_d = country.language) === null || _d === void 0 ? void 0 : _d.code) === null || _e === void 0 ? void 0 : _e.toLowerCase()) || '';
            if ([cName, cName2, lName, lName2].includes(lowerCase)) {
                return true;
            }
            let others = [];
            if (text.includes('-')) {
                others = text.split('-');
            }
            else if (text.includes(';')) {
                others = text.split(';');
            }
            else if (text.includes(',')) {
                others = text.split(',');
            }
            else {
                return false;
            }
            if (!others.length)
                return false;
            let i = others.length - 1;
            while (i >= 0) {
                if (others[i] &&
                    [cName, cName2, lName, lName2].includes(others[i].toLowerCase().trim())) {
                    return true;
                }
                i -= 1;
            }
            return false;
        });
    }
    async getCategories(query = {}) {
        return this.aggregatorCategoryModel.find(query);
    }
    async getCategory(id) {
        const category = await this.aggregatorCategoryModel.findOne({ _id: id });
        if (!category)
            throw new kernel_1.EntityNotFoundException();
        return category;
    }
    async updateCategory(id, payload) {
        const category = await this.aggregatorCategoryModel.findOne({ _id: id });
        if (!category)
            throw new kernel_1.EntityNotFoundException();
        if (payload.tags)
            category.tags = payload.tags;
        if (payload.active !== null)
            category.active = payload.active;
        if (payload.name)
            category.name = payload.name;
        if (payload.alias)
            category.alias = payload.alias.replace(/["~!@#$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\- \t\r\n]+/g, '-');
        await category.save();
        return category;
    }
    async listOnline(options) {
        const [xlovecam, bongacams, stripcash, chaturbate] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_XLOVECAM_ENABLED),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_BONGACAMS_ENABLED),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_STRIPCASH_ENABLED),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_CHATURBATE_ENABLED)
        ]);
        const inServices = [];
        if (xlovecam)
            inServices.push('xlovecam');
        if (bongacams)
            inServices.push('bongacams');
        if (stripcash)
            inServices.push('stripcash');
        if (chaturbate)
            inServices.push('chaturbate');
        if (!inServices.length)
            return {
                data: [],
                count: 0
            };
        const { limit = 60, offset = 0, category = null, gender = null, tag = null, q = null, country = null } = options;
        const query = {
            isOnline: true,
            service: {
                $in: inServices
            }
        };
        const sort = {
            updatedAt: -1
        };
        if (category !== null && category.length > 0) {
            const cat = await this.aggregatorCategoryModel.findOne({ alias: category });
            if (cat) {
                query.tags = {
                    $in: cat.tags
                };
            }
        }
        if (gender && gender.length > 0) {
            query.gender = gender;
        }
        if (tag && tag.length > 0) {
            query.tags = tag;
        }
        if (country && country.length > 0) {
            query.country = country.toUpperCase();
        }
        if (q) {
            query.$or = [{
                    username: {
                        $regex: q,
                        $options: 'i'
                    }
                }, {
                    tags: q
                }];
            delete query.isOnline;
        }
        const [data, count] = await Promise.all([
            this.aggregatorPerformerModel
                .find(query)
                .limit(parseInt(limit, 10))
                .skip(parseInt(offset, 10))
                .sort(sort),
            this.aggregatorPerformerModel.countDocuments(query)
        ]);
        return {
            data,
            count
        };
    }
    async getDetails(key, username) {
        var _a;
        const query = { username };
        switch (key) {
            case 'x':
            case 'xlovecam':
                query.service = 'xlovecam';
                break;
            case 'b':
            case 'bongacams':
                query.service = 'bongacams';
                break;
            case 's':
            case 'stripcash':
                query.service = 'stripcash';
                break;
            case 'c':
            case 'chaturbate':
                query.service = 'chaturbate';
                break;
            default: break;
        }
        const detail = await this.aggregatorPerformerModel.findOne(query);
        if (detail.service === 'chaturbate' && !((_a = detail.iframe) === null || _a === void 0 ? void 0 : _a.includes(`https://chaturbate.com/embed/${detail.username}`))) {
            const [campaign, tour] = await Promise.all([
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_CHATURBATE_CAMPAIGN),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_CHATURBATE_TOUR)
            ]);
            detail.iframe = `https://chaturbate.com/embed/${detail.username}/?join_overlay=1&campaign=${campaign}&disable_sound=0&bgcolor=white%27&tour=${tour}&amp=&room=${detail.username}`;
        }
        return detail;
    }
    async getRelatedCams(username, options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const aggregate = this.aggregatorPerformerModel
            .aggregate([{
                $match: {
                    isOnline: true,
                    username: {
                        $ne: username
                    }
                }
            }, {
                $sample: {
                    size: limit
                }
            }]);
        if (!aggregate)
            return [];
        return aggregate;
    }
    async syncXLoveCamsModels(job) {
        try {
            const [xLoveCamEnabled, authItemId, authSecret, authServiceId] = await Promise.all([
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_XLOVECAM_ENABLED),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_XLOVECAM_AUTH_ITEM_ID),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_XLOVECAM_AUTH_SECRET),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_XLOVECAM_AUTH_SERVICE_ID)
            ]);
            if (!xLoveCamEnabled || !authItemId || !authSecret)
                throw new Error('Missing config!');
            const onlineModelUsernames = [];
            for (let offset = 0; offset <= 190; offset += 10) {
                const onlineModels = await this.xLoveCamService.listOnline({
                    offset,
                    authItemId,
                    authSecret,
                    authServiceId
                });
                for (const model of onlineModels) {
                    await this.aggregatorPerformerModel.updateOne({
                        service: model.service,
                        username: model.username
                    }, model, {
                        upsert: true
                    });
                    onlineModelUsernames.push(model.username);
                }
            }
            await this.aggregatorPerformerModel.updateMany({
                username: {
                    $nin: onlineModelUsernames
                },
                service: 'xlovecam'
            }, {
                isStreaming: false,
                isOnline: false
            });
        }
        catch (e) {
        }
        finally {
            job.remove();
            this.agendaService.schedule('5 minutes from now', 'syncLovexCamsPerformerData', {});
        }
    }
    async syncBongaCamsModels(job) {
        try {
            const [bongacamsEnabled, bongacamsC] = await Promise.all([
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_BONGACAMS_ENABLED),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_BONGACAMS_C)
            ]);
            if (!bongacamsEnabled || !bongacamsC)
                throw new Error('Missing config!');
            const onlineModelUsernames = [];
            const onlineModels = await this.bongaCamsService.listOnline({
                c: bongacamsC
            });
            for (const model of onlineModels) {
                await this.aggregatorPerformerModel.updateOne({
                    service: model.service,
                    username: model.username
                }, model, {
                    upsert: true
                });
                onlineModelUsernames.push(model.username);
            }
            await this.aggregatorPerformerModel.updateMany({
                username: {
                    $nin: onlineModelUsernames
                },
                service: 'bongacams'
            }, {
                isStreaming: false,
                isOnline: false
            });
        }
        catch (e) {
        }
        finally {
            job.remove();
            this.agendaService.schedule('5 minutes from now', 'syncBongaCamsPerformerData', {});
        }
    }
    async syncChaturbateModels(job) {
        try {
            const [chaturbateEnabled, campaign, tour] = await Promise.all([
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_CHATURBATE_ENABLED),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_CHATURBATE_CAMPAIGN),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_CHATURBATE_TOUR)
            ]);
            if (!chaturbateEnabled || !campaign || !tour)
                throw new Error('Missing config!');
            const onlineModelUsernames = [];
            for (let offset = 0; offset <= 400; offset += 100) {
                const onlineModels = await this.chaturbateService.listOnline({
                    offset,
                    campaign,
                    tour
                });
                for (const model of onlineModels) {
                    await this.aggregatorPerformerModel.updateOne({
                        service: model.service,
                        username: model.username
                    }, model, {
                        upsert: true
                    });
                    onlineModelUsernames.push(model.username);
                }
            }
            await this.aggregatorPerformerModel.updateMany({
                username: {
                    $nin: onlineModelUsernames
                },
                service: 'chaturbate'
            }, {
                isStreaming: false,
                isOnline: false
            });
        }
        catch (e) {
        }
        finally {
            job.remove();
            this.agendaService.schedule('5 minutes from now', 'syncChaturbatePerformerData', {});
        }
    }
    async syncStripcashodels(job) {
        try {
            const [stripcashEnabled, userId] = await Promise.all([
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_STRIPCASH_ENABLED),
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.CAM_AGG_STRIPCASH_USER_ID)
            ]);
            if (!stripcashEnabled || !userId)
                throw new Error('Missing config!');
            const onlineModelUsernames = [];
            const onlineModels = await this.stripcashService.listOnline({
                userId
            });
            for (const model of onlineModels) {
                await this.aggregatorPerformerModel.updateOne({
                    service: model.service,
                    username: model.username
                }, model, {
                    upsert: true
                });
                onlineModelUsernames.push(model.username);
            }
            await this.aggregatorPerformerModel.updateMany({
                username: {
                    $nin: onlineModelUsernames
                },
                service: 'stripcash'
            }, {
                isStreaming: false,
                isOnline: false
            });
        }
        catch (e) {
        }
        finally {
            job.remove();
            this.agendaService.schedule('5 minutes from now', 'syncStripcashPerformerData', {});
        }
    }
    async syncTags() {
        const aggregator = await this.aggregatorPerformerModel.aggregate([{
                $group: {
                    _id: null,
                    tagsArray: {
                        $addToSet: '$tags'
                    }
                }
            }]);
        if (!aggregator)
            return;
        const tags = [];
        aggregator[0].tagsArray.forEach(tagItems => tags.push(...tagItems));
        const uniqueTags = lodash_1.uniq(tags).filter(tag => !!tag);
        if (!(uniqueTags === null || uniqueTags === void 0 ? void 0 : uniqueTags.length))
            return;
        for (const tag of uniqueTags) {
            const alias = kernel_1.StringHelper.createAlias(tag);
            const tagItem = await this.aggregatorCategoryModel.findOne({ alias });
            if (!tagItem) {
                await this.aggregatorCategoryModel.create({
                    name: tag,
                    alias,
                    tags: [tag]
                });
            }
        }
    }
};
CamAggregatorService = __decorate([
    common_1.Injectable(),
    __param(6, common_1.Inject(providers_1.AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER)),
    __param(7, common_1.Inject(providers_1.AGGREGATOR_TAG_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [settings_1.SettingService,
        xlovecam_service_1.XLoveCamService,
        chaturbate_service_1.ChaturbateService,
        bongacams_service_1.BongacamsService,
        stripcash_service_1.StripcashService,
        kernel_1.AgendaService,
        mongoose_1.Model,
        mongoose_1.Model])
], CamAggregatorService);
exports.CamAggregatorService = CamAggregatorService;
//# sourceMappingURL=cam-aggregator.service.js.map