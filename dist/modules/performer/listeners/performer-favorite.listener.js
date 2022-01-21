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
exports.PerformerFavoriteListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../favourite/constants");
const mongoose_1 = require("mongoose");
const constants_2 = require("../../../kernel/constants");
const providers_1 = require("../providers");
const HANDLE_FAVORITE_FOR_PERFORMER = 'HANDLE_FAVORITE_FOR_PERFORMER';
let PerformerFavoriteListener = class PerformerFavoriteListener {
    constructor(queueEventService, performerModel) {
        this.queueEventService = queueEventService;
        this.performerModel = performerModel;
        this.queueEventService.subscribe(constants_1.PERFORMER_FAVORITE_CHANNEL, HANDLE_FAVORITE_FOR_PERFORMER, this.handleFavorite.bind(this));
    }
    async handleFavorite(event) {
        try {
            const { eventName } = event;
            if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED].includes(eventName)) {
                return;
            }
            const { performerId } = event.data;
            const increase = eventName === constants_2.EVENT.CREATED ? 1 : -1;
            await this.performerModel.updateOne({ _id: performerId }, {
                $inc: {
                    'stats.favorites': increase
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};
PerformerFavoriteListener = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(providers_1.PERFORMER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model])
], PerformerFavoriteListener);
exports.PerformerFavoriteListener = PerformerFavoriteListener;
//# sourceMappingURL=performer-favorite.listener.js.map