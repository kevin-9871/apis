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
exports.ModelListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const constants_2 = require("../constants");
const providers_1 = require("../providers");
const services_2 = require("../services");
let ModelListener = class ModelListener {
    constructor(studioModel, studioService, queueEventService, settingService, fileService) {
        this.studioModel = studioModel;
        this.studioService = studioService;
        this.queueEventService = queueEventService;
        this.settingService = settingService;
        this.fileService = fileService;
        this.queueEventService.subscribe(constants_2.STUDIO_CHANNEL, 'STUDIO_CREATED', this.createStudioHandler.bind(this));
    }
    async createStudioHandler(event) {
        try {
            if (event.eventName !== constants_2.STUDIO_EVENT_NAME.CREATED)
                return;
            const { data } = event;
            const studio = await this.studioService.findById(data._id);
            if (!studio)
                return;
            const [defaultStudioCommission] = await Promise.all([
                this.settingService.getKeyValue(constants_1.SETTING_KEYS.STUDIO_COMMISSION),
                studio.documentVerificationId
                    ? this.fileService.addRef(studio.documentVerificationId, {
                        itemId: studio._id,
                        itemType: 'studio-document'
                    })
                    : null
            ]);
            studio.commission = defaultStudioCommission || parseInt(process.env.COMMISSION_RATE, 10);
            await this.studioModel.updateOne({ _id: data._id }, { $set: { defaultStudioCommission } });
        }
        catch (error) {
            console.log(error);
        }
    }
};
ModelListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.STUDIO_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_2.StudioService,
        kernel_1.QueueEventService,
        settings_1.SettingService,
        services_1.FileService])
], ModelListener);
exports.ModelListener = ModelListener;
//# sourceMappingURL=model.listener.js.map