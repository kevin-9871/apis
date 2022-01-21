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
exports.StripcashService = void 0;
const common_1 = require("@nestjs/common");
const querystring_1 = require("querystring");
const cam_aggregator_service_1 = require("./cam-aggregator.service");
let StripcashService = class StripcashService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async listOnline(newOptions) {
        const options = Object.assign({ limit: 0, offset: 0, userId: '106150bfbb9ac378aac92fb495c8ed29229e11b849b66525428d363cec90b9fd' }, (newOptions || {}));
        const models = await new Promise((resolve) => this.httpService
            .get(`https://go.alxbgo.com/api/models?${querystring_1.stringify(options)}`)
            .subscribe((resp) => { var _a, _b; return resolve(((_a = resp.data) === null || _a === void 0 ? void 0 : _a.models) || ((_b = resp.data) === null || _b === void 0 ? void 0 : _b.results) || []); }, ({ response: resp, code }) => resolve([])));
        return models.map(model => {
            const country = cam_aggregator_service_1.CamAggregatorService.detectCountry(model.modelsCountry);
            return {
                id: model.username,
                avatar: model.avatarUrl || model.previewUrl,
                username: model.username,
                dateOfBirth: model.birthday,
                phone: null,
                isOnline: true,
                watching: null,
                gender: model.gender,
                isStreaming: true,
                isFavorite: false,
                socials: false,
                stats: {
                    views: model.viewersCount,
                    favorites: model.favoritedCount
                },
                lastStreamingTime: null,
                streamingStatus: model.status,
                streamingTitle: model.goalMessage,
                country: (country === null || country === void 0 ? void 0 : country.code) || null,
                countrFlag: (country === null || country === void 0 ? void 0 : country.flag) || null,
                city: null,
                state: null,
                zipcode: null,
                address: null,
                languages: model.languages,
                categoryIds: [],
                categories: [],
                service: 'stripcash',
                aboutMe: model.goalmessage || model.goalMessage,
                tags: model.tags,
                iframe: `https://lite-iframe.stripcdn.com/${model.username}?userId=${options.userId}`,
                profileLink: `https://go.gldrdr.com/?userId=${options.userId}&path=/cams/${model.username}`,
                age: model.age
            };
        });
    }
};
StripcashService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], StripcashService);
exports.StripcashService = StripcashService;
//# sourceMappingURL=stripcash.service.js.map