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
exports.StockProductListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../purchased-item/constants");
const file_1 = require("../../file");
const services_1 = require("../../file/services");
const constants_2 = require("../../../kernel/constants");
const services_2 = require("../../mailer/services");
const services_3 = require("../../auth/services");
const lodash_1 = require("lodash");
const constants_3 = require("../../purchased-item/constants");
const services_4 = require("../services");
const constants_4 = require("../constants");
const UPDATE_STOCK_CHANNEL = 'UPDATE_STOCK_CHANNEL';
let StockProductListener = class StockProductListener {
    constructor(authService, queueEventService, productService, fileService, mailService) {
        this.authService = authService;
        this.queueEventService = queueEventService;
        this.productService = productService;
        this.fileService = fileService;
        this.mailService = mailService;
        this.queueEventService.subscribe(constants_1.PURCHASED_ITEM_SUCCESS_CHANNEL, UPDATE_STOCK_CHANNEL, this.handleStockProducts.bind(this));
    }
    async handleStockProducts(event) {
        const transaction = event.data;
        if (![constants_2.EVENT.CREATED].includes(event.eventName) || (transaction === null || transaction === void 0 ? void 0 : transaction.type) !== constants_3.PURCHASE_ITEM_TYPE.PRODUCT) {
            return;
        }
        const product = await this.productService.findById(transaction.targetId);
        if ((product === null || product === void 0 ? void 0 : product.type) !== constants_4.PRODUCT_TYPE.PHYSICAL)
            return;
        await this.productService.updateStock(transaction.targetId, -1);
    }
    async sendDigitalProductLink(transaction, performer, user, fileId) {
        const auth = await this.authService.findBySource({ source: 'user', type: 'email', sourceId: transaction.sourceId }) || await this.authService.findBySource({ source: 'user', type: 'username', sourceId: transaction.sourceId });
        const jwToken = this.authService.generateJWT(lodash_1.pick(auth, ['_id', 'source', 'sourceId']), { expiresIn: 3 * 60 * 60 });
        const file = await this.fileService.findById(fileId);
        if (file) {
            const digitalLink = jwToken ? `${new file_1.FileDto(file).getUrl()}?productId=${transaction.targetId}&token=${jwToken}` : `${new file_1.FileDto(file).getUrl()}?productId=${transaction.targetId}`;
            await this.mailService.send({
                subject: 'Digital file',
                to: user.email,
                data: {
                    performer,
                    user,
                    transaction,
                    digitalLink
                },
                template: 'send-user-digital-product'
            });
        }
    }
};
StockProductListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_3.AuthService))),
    __metadata("design:paramtypes", [services_3.AuthService,
        kernel_1.QueueEventService,
        services_4.ProductService,
        services_1.FileService,
        services_2.MailerService])
], StockProductListener);
exports.StockProductListener = StockProductListener;
//# sourceMappingURL=stock-product.listener.js.map