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
exports.PaymentInformationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../studio/services");
const services_2 = require("../../performer/services");
const lodash_1 = require("lodash");
const dtos_1 = require("../../performer/dtos");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let PaymentInformationService = class PaymentInformationService {
    constructor(paymentInformationModel, studioService, performerService) {
        this.paymentInformationModel = paymentInformationModel;
        this.studioService = studioService;
        this.performerService = performerService;
    }
    async findById(id) {
        return this.paymentInformationModel.findOne({ _id: id });
    }
    async create(payload, user) {
        var _a;
        const { type } = payload;
        let payment = await this.paymentInformationModel.findOne({
            sourceId: user._id,
            type
        });
        if (!payment) {
            payment = await this.paymentInformationModel.create({
                sourceId: user._id,
                sourceType: ((_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('studio'))
                    ? constants_1.BANKING_SOURCE.STUDIO
                    : constants_1.BANKING_SOURCE.PERFORMER,
                type
            });
        }
        Object.keys(payload).forEach((field) => {
            payment.set(field, payload[field]);
        });
        await payment.save();
        return payment.toObject();
    }
    async detail(payload, sourceId) {
        const { type } = payload;
        return this.paymentInformationModel.findOne({ sourceId, type });
    }
    async adminDetail(id) {
        const paymentInfo = await this.paymentInformationModel.findById(id);
        if (!paymentInfo) {
            throw new kernel_1.EntityNotFoundException();
        }
        const { sourceType, sourceId } = paymentInfo;
        const sourceInfo = sourceType === constants_1.BANKING_SOURCE.STUDIO
            ? await this.studioService.findById(sourceId)
            : await this.performerService.findById(sourceId);
        return Object.assign(Object.assign({}, paymentInfo.toObject()), { sourceInfo });
    }
    async adminCreate(payload) {
        const { type, sourceId, sourceType } = payload;
        let payment = await this.paymentInformationModel.findOne({
            sourceId,
            type
        });
        if (!payment) {
            payment = await this.paymentInformationModel.create({
                sourceId,
                sourceType,
                type
            });
        }
        Object.keys(payload).forEach((field) => {
            payment.set(field, payload[field]);
        });
        await payment.save();
        return payment.toObject();
    }
    async adminSearch(req) {
        const query = {};
        Object.keys(req).forEach((field) => {
            if (['type', 'sourceId', 'sourceType'].includes(field)) {
                query[field] = req[field];
            }
        });
        let sort = {};
        if (req.sort) {
            sort = {
                [req.sortBy || 'updatedAt']: req.sort || -1
            };
        }
        const [data, total] = await Promise.all([
            this.paymentInformationModel
                .find(query)
                .skip(parseInt(req.offset, 10))
                .limit(parseInt(req.limit, 10))
                .sort(sort)
                .lean()
                .exec(),
            this.paymentInformationModel.countDocuments(query)
        ]);
        const source = {};
        data.forEach((d) => {
            source[`${d.sourceId}`] = lodash_1.pick(d, ['sourceId', 'sourceType']);
        });
        const sourceInfos = (await Promise.all(Object.keys(source).map((sourceId) => {
            if (source[sourceId].sourceType === constants_1.BANKING_SOURCE.STUDIO) {
                return this.studioService.findById(sourceId);
            }
            if (source[sourceId].sourceType === constants_1.BANKING_SOURCE.PERFORMER) {
                return this.performerService.findById(sourceId);
            }
            return null;
        })));
        data.forEach((d) => {
            const sourceInfo = sourceInfos.find((s) => `${s._id}` === `${d.sourceId}`);
            if (sourceInfo) {
                d['sourceInfo'] = sourceInfo;
            }
        });
        return {
            data,
            total
        };
    }
};
PaymentInformationService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.BANKING_INFORMATION_MODEL_PROVIDE)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.StudioService,
        services_2.PerformerService])
], PaymentInformationService);
exports.PaymentInformationService = PaymentInformationService;
//# sourceMappingURL=index.js.map