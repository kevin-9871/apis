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
exports.StudioCommissionService = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../../performer/dtos");
const payloads_1 = require("../../performer/payloads");
const services_1 = require("../../performer/services");
const services_2 = require("../../settings/services");
const constants_1 = require("../../settings/constants");
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const kernel_1 = require("../../../kernel");
const providers_1 = require("../providers");
let StudioCommissionService = class StudioCommissionService {
    constructor(performerCommissionService, performerSearchService, settingService, performerService, studioModel) {
        this.performerCommissionService = performerCommissionService;
        this.performerSearchService = performerSearchService;
        this.settingService = settingService;
        this.performerService = performerService;
        this.studioModel = studioModel;
    }
    async searchMemberCommissions(query, user) {
        const { data, total } = await this.performerSearchService.search(query, user);
        const performerIds = data.map(p => p._id);
        const performerCommissions = performerIds.length
            ? await this.performerCommissionService.findByPerformerIds(performerIds)
            : [];
        const [defaultStudioCommission, defaultPerformerCommssion] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.STUDIO_COMMISSION),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.PERFORMER_COMMISSION)
        ]);
        const performers = data.map(performer => {
            const commission = performerCommissions.find(c => c.performerId.toString() === performer._id.toString());
            if (commission) {
                return Object.assign(Object.assign({}, performer), { commissionSetting: new dtos_1.PerformerCommissionDto(commission) });
            }
            return Object.assign(Object.assign({}, performer), { commissionSetting: {
                    performerId: performer._id,
                    tipCommission: defaultPerformerCommssion,
                    albumCommission: defaultPerformerCommssion,
                    groupCallCommission: defaultPerformerCommssion,
                    privateCallCommission: defaultPerformerCommssion,
                    productCommission: defaultPerformerCommssion,
                    videoCommission: defaultPerformerCommssion,
                    studioCommission: defaultStudioCommission,
                    memberCommission: parseInt(process.env.COMMISSION_RATE, 10)
                } });
        });
        return {
            total,
            data: performers.map(d => new dtos_1.PerformerDto(d).toResponse(true))
        };
    }
    async studioUpdateMemberCommission(id, payload, studio) {
        return this.performerCommissionService.studioUpdate(id, payload, studio._id);
    }
    async adminUpdateStudioCommission(studioId, payload) {
        const studio = await this.studioModel.findOne({ _id: studioId });
        if (!studio) {
            throw new kernel_1.EntityNotFoundException();
        }
        lodash_1.merge(studio, payload);
        await studio.save();
        const [performers, defaultPerformerCommssion] = await Promise.all([
            this.performerService.find({ studioId }),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.PERFORMER_COMMISSION)
        ]);
        const performerIds = performers.map(p => p._id);
        const commissions = await this.performerCommissionService.findByPerformerIds(performerIds);
        await Promise.all(performerIds.map(id => {
            const commission = commissions.find(c => c.performerId.toString() === id.toString());
            if (!commission) {
                const data = {};
                data.performerId = id;
                data.tipCommission = defaultPerformerCommssion;
                data.privateCallCommission = defaultPerformerCommssion;
                data.groupCallCommission = defaultPerformerCommssion;
                data.productCommission = defaultPerformerCommssion;
                data.albumCommission = defaultPerformerCommssion;
                data.videoCommission = defaultPerformerCommssion;
                data.studioCommission = payload.commission;
                return this.performerCommissionService.create(id, data);
            }
            commission.studioCommission = payload.commission;
            return commission.save();
        }));
        return studio;
    }
};
StudioCommissionService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerCommissionService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.PerformerSearchService))),
    __param(4, common_1.Inject(providers_1.STUDIO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerCommissionService,
        services_1.PerformerSearchService,
        services_2.SettingService,
        services_1.PerformerService,
        mongoose_1.Model])
], StudioCommissionService);
exports.StudioCommissionService = StudioCommissionService;
//# sourceMappingURL=commission.service.js.map