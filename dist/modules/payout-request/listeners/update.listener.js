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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePayoutRequestListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const mailer_1 = require("../../mailer");
const earning_service_1 = require("../../earning/services/earning.service");
const services_2 = require("../../studio/services");
const constants_1 = require("../constants");
const PAYOUT_REQUEST_UPDATE = 'PAYOUT_REQUEST_UPDATE';
let UpdatePayoutRequestListener = class UpdatePayoutRequestListener {
    constructor(queueEventService, mailService, earningService, performerService, studioService) {
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.earningService = earningService;
        this.performerService = performerService;
        this.studioService = studioService;
        this.queueEventService.subscribe(constants_1.PAYOT_REQUEST_CHANEL, PAYOUT_REQUEST_UPDATE, this.handler.bind(this));
    }
    async handler(event) {
        try {
            const request = event.data.request;
            const { status, sourceId, sourceType } = request;
            if (event.eventName === constants_1.PAYOUT_REQUEST_EVENT.UPDATED) {
                const source = sourceType === 'performer'
                    ? await this.performerService.findById(sourceId)
                    : await this.studioService.findById(sourceId);
                if (!source) {
                    return;
                }
                if (status === constants_1.STATUES.APPROVED
                    && event.data.oldStatus === constants_1.STATUES.PENDING) {
                    const payload = {
                        targetId: sourceId,
                        fromDate: request.fromDate,
                        toDate: request.toDate
                    };
                    await this.earningService.updatePaidStatus(payload);
                }
                if (source.email) {
                    await this.mailService.send({
                        subject: 'Update payout request',
                        to: source.email,
                        data: { request },
                        template: 'payout-request-update'
                    });
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};
UpdatePayoutRequestListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mailer_1.MailerService,
        earning_service_1.EarningService,
        services_1.PerformerService,
        services_2.StudioService])
], UpdatePayoutRequestListener);
exports.UpdatePayoutRequestListener = UpdatePayoutRequestListener;
//# sourceMappingURL=update.listener.js.map