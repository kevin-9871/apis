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
exports.RefundRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const mailer_1 = require("../../mailer");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const dtos_3 = require("../../performer-assets/dtos");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const moment = require("moment");
const services_3 = require("../../payment/services");
const dtos_4 = require("../../payment/dtos");
const constants_2 = require("../constants");
const duplicate_exception_1 = require("../exceptions/duplicate.exception");
const product_service_1 = require("../../performer-assets/services/product.service");
const refund_request_dto_1 = require("../dtos/refund-request.dto");
const refund_request_provider_1 = require("../providers/refund-request.provider");
let RefundRequestService = class RefundRequestService {
    constructor(refundRequestModel, userService, performerService, productService, mailService, settingService, orderService, queueEventService) {
        this.refundRequestModel = refundRequestModel;
        this.userService = userService;
        this.performerService = performerService;
        this.productService = productService;
        this.mailService = mailService;
        this.settingService = settingService;
        this.orderService = orderService;
        this.queueEventService = queueEventService;
    }
    async search(req, user) {
        const query = {};
        if (user.roles.includes('admin') && req.userId) {
            query.userId = req.userId;
        }
        else if (!user.roles.includes('admin')) {
            query.userId = user._id;
        }
        if (req.performerId) {
            query.performerId = req.performerId;
        }
        if (req.sourceId) {
            query.sourceId = req.sourceId;
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
            this.refundRequestModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.refundRequestModel.countDocuments(query)
        ]);
        const pIds = data.map(d => d.performerId);
        const uIds = data.map(d => d.userId);
        const orderIds = data.map(d => d.sourceId);
        const [performers, users, orders, products] = await Promise.all([
            this.performerService.findByIds(pIds) || [],
            this.userService.findByIds(uIds) || [],
            this.orderService.findByIds(orderIds) || [],
            this.productService.findByPerformerIds(pIds) || []
        ]);
        const requests = data.map((request) => {
            const performer = request.performerId &&
                performers.find(p => p._id.toString() === request.performerId.toString());
            const userModel = request.userId &&
                users.find(p => p._id.toString() === request.userId.toString());
            const order = request.sourceId &&
                orders.find(o => o._id.toString() === request.sourceId.toString());
            const product = order &&
                products.find(p => p._id.toString() === order.productId.toString());
            return Object.assign(Object.assign({}, request), { performerInfo: new dtos_2.PerformerDto(performer).toResponse(true), userInfo: new dtos_1.UserDto(userModel).toResponse(true), orderInfo: new dtos_4.OrderDto(order), productInfo: new dtos_3.ProductDto(product) });
        });
        return {
            total,
            data: requests.map(d => new refund_request_dto_1.RefundRequestDto(d))
        };
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { userId: user._id, updatedAt: new Date(), createdAt: new Date() });
        const request = await this.refundRequestModel.findOne({
            userId: user._id,
            sourceId: data.sourceId,
            performerId: data.performerId,
            token: data.token
        });
        if (request) {
            throw new duplicate_exception_1.DuplicateRequestException();
        }
        const resp = await this.refundRequestModel.create(data);
        const adminEmail = (await this.settingService.getKeyValue(constants_1.SETTING_KEYS.ADMIN_EMAIL)) ||
            process.env.ADMIN_EMAIL;
        adminEmail &&
            (await this.mailService.send({
                subject: 'New refund request',
                to: adminEmail,
                data: {
                    request: resp
                },
                template: 'refund-request'
            }));
        return new refund_request_dto_1.RefundRequestDto(resp);
    }
    async updateStatus(id, payload) {
        const request = await this.refundRequestModel.findById(id);
        if (!request) {
            throw new common_1.NotFoundException();
        }
        const oldStatus = request.status;
        lodash_1.merge(request, payload);
        request.updatedAt = new Date();
        await request.save();
        const event = {
            channel: constants_2.REFUND_REQUEST_CHANNEL,
            eventName: constants_2.REFUND_REQUEST_ACTION.UPDATED,
            data: {
                oldStatus,
                request
            }
        };
        await this.queueEventService.publish(event);
        return request;
    }
};
RefundRequestService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(refund_request_provider_1.REFUND_REQUEST_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.UserService,
        services_2.PerformerService,
        product_service_1.ProductService,
        mailer_1.MailerService,
        settings_1.SettingService,
        services_3.OrderService,
        kernel_1.QueueEventService])
], RefundRequestService);
exports.RefundRequestService = RefundRequestService;
//# sourceMappingURL=refund-request.service.js.map