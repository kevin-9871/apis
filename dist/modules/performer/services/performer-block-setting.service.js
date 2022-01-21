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
exports.PerformerBlockSettingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const services_1 = require("../../utils/services");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let PerformerBlockSettingService = class PerformerBlockSettingService {
    constructor(PerformerBlockSetting, countryService) {
        this.PerformerBlockSetting = PerformerBlockSetting;
        this.countryService = countryService;
    }
    async findByPerformerId(performerId) {
        return this.PerformerBlockSetting.findOne({ performerId });
    }
    async checkBlockByPerformerId(performerId, userId, req) {
        const blockSetting = await this.findByPerformerId(performerId);
        if (blockSetting) {
            const { userIds, countries } = blockSetting;
            if (userIds.findIndex(id => `${id}` === `${userId}`) > -1) {
                return true;
            }
            if (req && countries.length) {
                let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                ipClient = Array.isArray(ipClient) ? ipClient.toString() : ipClient;
                if (ipClient.substr(0, 7) === '::ffff:') {
                    ipClient = ipClient.substr(7);
                }
                if (constants_1.whiteListIps.indexOf(ipClient) === -1) {
                    const resp = await this.countryService.findCountryByIP(ipClient);
                    if (resp &&
                        resp.status === 200 &&
                        resp.data &&
                        resp.data.countryCode) {
                        if (countries.findIndex(code => code === resp.data.countryCode) > -1) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
};
PerformerBlockSettingService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_BLOCK_SETTING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.CountryService])
], PerformerBlockSettingService);
exports.PerformerBlockSettingService = PerformerBlockSettingService;
//# sourceMappingURL=performer-block-setting.service.js.map