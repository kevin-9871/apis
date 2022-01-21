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
exports.PerformerCommissionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const payloads_1 = require("../../studio/payloads");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const providers_1 = require("../providers");
const performer_service_1 = require("./performer.service");
const dtos_1 = require("../dtos");
let PerformerCommissionService = class PerformerCommissionService {
    constructor(PerformerCommissionModel, performerService, settingService) {
        this.PerformerCommissionModel = PerformerCommissionModel;
        this.performerService = performerService;
        this.settingService = settingService;
    }
    async findOne(params) {
        return this.PerformerCommissionModel.findOne(params);
    }
    async findByPerformerIds(ids) {
        return this.PerformerCommissionModel.find({ performerId: { $in: ids } });
    }
    async create(performerId, payload) {
        const data = Object.assign({ performerId }, payload);
        return this.PerformerCommissionModel.create(data);
    }
    async update(payload, performerId) {
        let item = await this.PerformerCommissionModel.findOne({
            performerId
        });
        if (!item) {
            item = new this.PerformerCommissionModel();
        }
        item.performerId = performerId;
        item.tipCommission = payload.tipCommission;
        item.privateCallCommission = payload.privateCallCommission;
        item.groupCallCommission = payload.groupCallCommission;
        item.productCommission = payload.productCommission;
        item.albumCommission = payload.albumCommission;
        item.videoCommission = payload.videoCommission;
        return item.save();
    }
    async studioUpdate(id, payload, studioId) {
        const performer = await this.performerService.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (performer.studioId.toString() !== studioId.toString()) {
            throw new common_1.ForbiddenException();
        }
        let commission = await this.findOne({
            performerId: id
        });
        const [defaultPerformerCommssion, defaultStudioCommission] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.PERFORMER_COMMISSION),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.STUDIO_COMMISSION)
        ]);
        if (!commission) {
            const data = {};
            data.performerId = performer._id;
            data.tipCommission = defaultPerformerCommssion;
            data.privateCallCommission = defaultPerformerCommssion;
            data.groupCallCommission = defaultPerformerCommssion;
            data.productCommission = defaultPerformerCommssion;
            data.albumCommission = defaultPerformerCommssion;
            data.videoCommission = defaultPerformerCommssion;
            data.studioCommission = defaultStudioCommission;
            data.memberCommission = payload.commission;
            commission = await this.PerformerCommissionModel.create(data);
        }
        else {
            commission.memberCommission = payload.commission;
            await commission.save();
        }
        return new dtos_1.PerformerCommissionDto(commission);
    }
};
PerformerCommissionService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_COMMISSION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        performer_service_1.PerformerService,
        settings_1.SettingService])
], PerformerCommissionService);
exports.PerformerCommissionService = PerformerCommissionService;
//# sourceMappingURL=performer-commission.service.js.map