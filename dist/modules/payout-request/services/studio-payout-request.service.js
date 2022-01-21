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
exports.StudioPayoutRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mailer_1 = require("../../mailer");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const earning_service_1 = require("../../earning/services/earning.service");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const dtos_1 = require("../../studio/dtos");
const services_1 = require("../../studio/services");
const dtos_2 = require("../../performer/dtos");
const services_2 = require("../../performer/services");
const moment = require("moment");
const services_3 = require("../../payment-information/services");
const constants_2 = require("../constants");
const exceptions_1 = require("../exceptions");
const payout_request_dto_1 = require("../dtos/payout-request.dto");
const payout_request_provider_1 = require("../providers/payout-request.provider");
let StudioPayoutRequestService = class StudioPayoutRequestService {
    constructor(payoutRequestModel, studioService, mailService, settingService, earningService, performerService, paymentInformationService) {
        this.payoutRequestModel = payoutRequestModel;
        this.studioService = studioService;
        this.mailService = mailService;
        this.settingService = settingService;
        this.earningService = earningService;
        this.performerService = performerService;
        this.paymentInformationService = paymentInformationService;
    }
    async findById(id) {
        const request = await this.payoutRequestModel.findById(id);
        if (!request) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = new payout_request_dto_1.PayoutRequestDto(request);
        if (data.sourceId) {
            const studio = await this.studioService.findById(request.sourceId);
            data.studioInfo = studio ? new dtos_1.StudioDto(studio).toResponse() : null;
        }
        return data;
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { sourceId: user._id });
        const query = {
            sourceType: constants_2.SOURCE_TYPE.STUDIO,
            sourceId: user._id,
            fromDate: data.fromDate,
            toDate: data.toDate
        };
        let payoutRequest = await this.payoutRequestModel.findOne(query);
        if (payoutRequest) {
            throw new exceptions_1.DuplicateRequestException();
        }
        const [statEarning, minPayoutRequest] = await Promise.all([
            this.earningService.calculatePayoutRequestStats({
                targetId: query.sourceId,
                fromDate: data.fromDate,
                toDate: data.toDate
            }),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.MINIMUM_PAYOUT_REQUEST) || 0
        ]);
        if (statEarning.totalPrice < minPayoutRequest) {
            throw new exceptions_1.MinPayoutRequestRequiredException();
        }
        payoutRequest = await this.payoutRequestModel.create(Object.assign(Object.assign({}, data), { tokenMustPay: statEarning.totalPrice, previousPaidOut: statEarning.paidPrice, pendingToken: statEarning.remainingPrice }));
        const adminEmail = (await this.settingService.getKeyValue(constants_1.SETTING_KEYS.ADMIN_EMAIL)) ||
            process.env.ADMIN_EMAIL;
        adminEmail &&
            (await this.mailService.send({
                subject: 'New payout request',
                to: adminEmail,
                data: {
                    request: payoutRequest
                },
                template: 'payout-request'
            }));
        return new payout_request_dto_1.PayoutRequestDto(payoutRequest);
    }
    async update(id, payload, studio) {
        const payout = await this.payoutRequestModel.findOne({ _id: id });
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (studio._id.toString() !== payout.sourceId.toString()) {
            throw new common_1.ForbiddenException();
        }
        lodash_1.merge(payout, payload);
        const statEarning = await this.earningService.calculatePayoutRequestStats({
            targetId: payout.sourceId,
            fromDate: payload.fromDate,
            toDate: payload.toDate
        });
        payout.tokenMustPay = statEarning.totalPrice;
        payout.previousPaidOut = statEarning.paidPrice;
        payout.pendingToken = statEarning.remainingPrice;
        payout.updatedAt = new Date();
        await payout.save();
        const adminEmail = (await this.settingService.getKeyValue(constants_1.SETTING_KEYS.ADMIN_EMAIL)) ||
            process.env.ADMIN_EMAIL;
        adminEmail &&
            (await this.mailService.send({
                subject: 'Update payout request',
                to: adminEmail,
                data: {
                    request: payout
                },
                template: 'payout-request'
            }));
        return new payout_request_dto_1.PayoutRequestDto(payout);
    }
    async details(id, user) {
        const payout = await this.payoutRequestModel.findById(id);
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user._id.toString() !== payout.sourceId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const data = new payout_request_dto_1.PayoutRequestDto(payout);
        if (data.sourceId) {
            const studio = await this.studioService.findById(payout.sourceId);
            data.studioInfo = studio ? new dtos_1.StudioDto(studio).toResponse() : null;
        }
        return data;
    }
    getRequestSource(request) {
        const { sourceType, sourceId } = request;
        switch (sourceType) {
            case 'performer':
                return this.performerService.findById(sourceId);
            case 'studio':
                return this.studioService.findById(sourceId);
            default:
                return null;
        }
    }
    async adminDetails(id) {
        const request = await this.payoutRequestModel.findById(id);
        if (!request) {
            throw new kernel_1.EntityNotFoundException();
        }
        const { paymentAccountType } = request;
        const sourceInfo = await this.getRequestSource(request);
        const paymentAccountInfo = sourceInfo
            ? await this.paymentInformationService.detail({ type: paymentAccountType }, sourceInfo)
            : null;
        const data = new payout_request_dto_1.PayoutRequestDto(Object.assign(Object.assign({}, request.toObject()), { sourceInfo,
            paymentAccountInfo }));
        return data;
    }
    async performerRequest(req, studio) {
        const query = {};
        if (req.status) {
            query.status = req.status;
        }
        query.studioRequestId = studio._id;
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lte: moment(req.toDate).endOf('day')
            };
        }
        const [data, total] = await Promise.all([
            this.payoutRequestModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.payoutRequestModel.countDocuments(query)
        ]);
        const requests = data.map(d => new payout_request_dto_1.PayoutRequestDto(d));
        const performerIds = data.map(d => d.performerId);
        const [performers] = await Promise.all([
            this.performerService.findByIds(performerIds) || []
        ]);
        requests.forEach((request) => {
            const performer = performers.find(p => p._id.toString() === request.performerId.toString());
            request.performerInfo = performer
                ? new dtos_2.PerformerDto(performer).toResponse(true)
                : null;
        });
        return {
            total,
            data: requests
        };
    }
};
StudioPayoutRequestService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(payout_request_provider_1.PAYOUT_REQUEST_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.StudioService,
        mailer_1.MailerService,
        settings_1.SettingService,
        earning_service_1.EarningService,
        services_2.PerformerService,
        services_3.PaymentInformationService])
], StudioPayoutRequestService);
exports.StudioPayoutRequestService = StudioPayoutRequestService;
//# sourceMappingURL=studio-payout-request.service.js.map