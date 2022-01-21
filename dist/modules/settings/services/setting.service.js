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
var SettingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const path_1 = require("path");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
const constants_1 = require("../constants");
const providers_2 = require("../../menu/providers");
let SettingService = SettingService_1 = class SettingService {
    constructor(menuModel, settingModel, queueEventService) {
        this.menuModel = menuModel;
        this.settingModel = settingModel;
        this.queueEventService = queueEventService;
        this.queueEventService.subscribe(constants_1.SETTING_CHANNEL, 'HANDLE_SETTINGS_CHANGE', this.subscribeChange.bind(this));
    }
    async publishChange(setting) {
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_1.SETTING_CHANNEL,
            eventName: 'update',
            data: new dtos_1.SettingDto(setting)
        }));
    }
    async subscribeChange(event) {
        const { data } = event;
        if (data.meta && data.value && data.meta.upload) {
            const { settingDir } = kernel_1.getConfig('file');
            const fileName = data.value.replace(`${kernel_1.getConfig('file').baseUrl}/settings/`, '');
            this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: services_1.MEDIA_FILE_CHANNEL,
                eventName: services_1.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
                data: {
                    type: services_1.DELETE_FILE_TYPE.FILE_PATH,
                    currentFile: path_1.join(settingDir, fileName)
                }
            }));
        }
        await this.syncCache();
    }
    async syncCache() {
        const settings = await this.settingModel.find();
        for (const setting of settings) {
            const dto = new dtos_1.SettingDto(setting);
            SettingService_1._settingCache[dto.key] = dto;
            if (dto.visible && dto.public) {
                SettingService_1._publicSettingsCache[dto.key] = dto.value;
            }
        }
    }
    async get(key) {
        if (SettingService_1._settingCache[key]) {
            return SettingService_1._settingCache[key];
        }
        const data = await this.settingModel.findOne({ key });
        if (!data) {
            return null;
        }
        const dto = new dtos_1.SettingDto(data);
        SettingService_1._settingCache[key] = dto;
        return dto;
    }
    async getKeyValue(key) {
        if (SettingService_1._settingCache[key]) {
            return SettingService_1._settingCache[key].value;
        }
        const data = await this.settingModel.findOne({ key });
        if (!data) {
            return null;
        }
        const dto = new dtos_1.SettingDto(data);
        SettingService_1._settingCache[key] = dto;
        return dto.value;
    }
    async create(data) {
        const setting = await this.get(data.key);
        if (setting) {
            throw new Error('Setting key exist');
        }
        await this.syncCache();
        return this.settingModel.create(data);
    }
    async update(key, data) {
        const setting = await this.settingModel.findOne({ key });
        if (!setting) {
            throw new kernel_1.EntityNotFoundException();
        }
        data.description && setting.set('description', data.description);
        data.name && setting.set('name', data.name);
        setting.set('value', data.value);
        await setting.save();
        const dto = new dtos_1.SettingDto(setting);
        await this.publishChange(dto);
        return dto;
    }
    async getPublicSettings() {
        const menus = await this.getPublicMenus();
        SettingService_1._publicSettingsCache.menus =
            menus && menus.length ? menus : [];
        return SettingService_1._publicSettingsCache;
    }
    async getPublicMenus() {
        return this.menuModel.find({});
    }
    async getEditableSettings(group) {
        const query = { editable: true };
        if (group) {
            query.group = group;
        }
        const settings = await this.settingModel.find(query);
        return settings.map(s => new dtos_1.SettingDto(s));
    }
    static getByKey(key) {
        return SettingService_1._settingCache[key] || null;
    }
    static getValueByKey(key) {
        return SettingService_1._settingCache[key]
            ? SettingService_1._settingCache[key].value
            : null;
    }
};
SettingService._settingCache = {};
SettingService._publicSettingsCache = {};
SettingService = SettingService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_2.MENU_PROVIDER)),
    __param(1, common_1.Inject(providers_1.SETTING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], SettingService);
exports.SettingService = SettingService;
//# sourceMappingURL=setting.service.js.map