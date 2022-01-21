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
exports.PayoutRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const services_1 = require("../../performer/services");
const mailer_1 = require("../../mailer");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const earning_service_1 = require("../../earning/services/earning.service");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const services_2 = require("../../studio/services");
const dtos_3 = require("../../studio/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const moment = require("moment");
const services_3 = require("../../payment-information/services");
const constants_2 = require("../constants");
const exceptions_1 = require("../exceptions");
const payout_request_dto_1 = require("../dtos/payout-request.dto");
const payout_request_provider_1 = require("../providers/payout-request.provider");
let PayoutRequestService = class PayoutRequestService {
    constructor(payoutRequestModel, studioService, queueEventService, performerService, mailService, settingService, earningService, paymentInformationService) {
        this.payoutRequestModel = payoutRequestModel;
        this.studioService = studioService;
        this.queueEventService = queueEventService;
        this.performerService = performerService;
        this.mailService = mailService;
        this.settingService = settingService;
        this.earningService = earningService;
        this.paymentInformationService = paymentInformationService;
    }
    async search(req, user) {
        var _a;
        const query = {};
        if (req.sourceId) {
            query.sourceId = string_helper_1.toObjectId(req.sourceId);
        }
        if (req.sourceType) {
            query.sourceType = req.sourceType;
        }
        if (req.status) {
            query.status = req.status;
        }
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
        const requests = data.map((d) => new payout_request_dto_1.PayoutRequestDto(d));
        if ((_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) {
            const sources = await Promise.all(requests.map((request) => this.getRequestSource(request)));
            requests.forEach((request) => {
                const sourceInfo = sources.find((source) => source && source._id.toString() === request.sourceId.toString());
                switch (request.sourceType) {
                    case 'performer':
                        request.performerInfo = sourceInfo
                            ? new dtos_2.PerformerDto(sourceInfo).toResponse(true)
                            : null;
                        break;
                    case 'studio':
                        request.studioInfo = sourceInfo
                            ? new dtos_3.StudioDto(sourceInfo).toResponse(true)
                            : null;
                        break;
                    default:
                        break;
                }
            });
        }
        return {
            total,
            data: requests
        };
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
    async findById(id) {
        const request = await this.payoutRequestModel.findById(id);
        return request;
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { performerId: user._id, studioRequestId: user.studioId, sourceId: user._id });
        const query = {
            sourceId: user._id,
            performerId: user._id,
            sourceType: constants_2.SOURCE_TYPE.PERFORMER,
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
    async update(id, payload, performer) {
        const payout = await this.payoutRequestModel.findOne({ _id: id });
        if (!payout) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (performer._id.toString() !== payout.sourceId.toString()) {
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
            const performerDto = await this.performerService.findById(payout.sourceId);
            data.performerInfo = performerDto
                ? performerDto.toSearchResponse()
                : null;
        }
        return data;
    }
    async adminDetails(id) {
        const request = await this.payoutRequestModel.findById(id);
        if (!request) {
            throw new kernel_1.EntityNotFoundException();
        }
        const { paymentAccountType } = request;
        const sourceInfo = await this.getRequestSource(request);
        const paymentAccountInfo = sourceInfo
            ? await this.paymentInformationService.detail({ type: paymentAccountType }, sourceInfo._id)
            : null;
        const data = new payout_request_dto_1.PayoutRequestDto(Object.assign(Object.assign({}, request.toObject()), { sourceInfo, paymentAccountInfo: paymentAccountInfo
                ? paymentAccountInfo.toObject()
                : null }));
        return data;
    }
    async updateStatus(id, payload, user) {
        const request = await this.payoutRequestModel.findById(id);
        if (!request) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user &&
            user.roles.includes('studio') &&
            user._id.toString() !== request.studioRequestId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const oldStatus = request.status;
        lodash_1.merge(request, payload);
        request.updatedAt = new Date();
        await request.save();
        const event = {
            channel: constants_2.PAYOT_REQUEST_CHANEL,
            eventName: constants_2.PAYOUT_REQUEST_EVENT.UPDATED,
            data: {
                request,
                oldStatus
            }
        };
        await this.queueEventService.publish(event);
        return request;
    }
};
PayoutRequestService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(payout_request_provider_1.PAYOUT_REQUEST_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_2.StudioService,
        kernel_1.QueueEventService,
        services_1.PerformerService,
        mailer_1.MailerService,
        settings_1.SettingService,
        earning_service_1.EarningService,
        services_3.PaymentInformationService])
], PayoutRequestService);
exports.PayoutRequestService = PayoutRequestService;
//# sourceMappingURL=payout-request.service.js.map