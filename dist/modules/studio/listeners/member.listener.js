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
exports.StudioMemberListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const services_1 = require("../services");
let StudioMemberListener = class StudioMemberListener {
    constructor(studioService, queueEventService) {
        this.studioService = studioService;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe('STUDIO_MEMBER_CHANNEL', 'STUDIO_CREATE_UPDATE_MEMBER', this.handler.bind(this));
    }
    async handler(event) {
        try {
            if (event.eventName !== constants_1.EVENT.CREATED ||
                event.eventName !== constants_1.EVENT.UPDATED) {
                return;
            }
            const { studioId, total } = event.data;
            await this.studioService.updateStats(studioId, {
                'stats.totalPerformer': total || 1
            });
        }
        catch (error) {
            console.log(error);
        }
    }
};
StudioMemberListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [services_1.StudioService,
        kernel_1.QueueEventService])
], StudioMemberListener);
exports.StudioMemberListener = StudioMemberListener;
//# sourceMappingURL=member.listener.js.map