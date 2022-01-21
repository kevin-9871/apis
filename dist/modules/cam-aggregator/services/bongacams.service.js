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
exports.BongacamsService = void 0;
const common_1 = require("@nestjs/common");
const querystring_1 = require("querystring");
const cam_aggregator_service_1 = require("./cam-aggregator.service");
let BongacamsService = class BongacamsService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    getGender(gender) {
        const lowerCase = (gender || '').toLowerCase();
        if (lowerCase.includes('couple'))
            return 'couple';
        if (lowerCase.includes('transgender'))
            return 'transgender';
        if (lowerCase.includes('female'))
            return 'female';
        if (lowerCase.includes('male'))
            return 'male';
        return lowerCase;
    }
    async listOnline(newOptions) {
        const options = Object.assign({ type: 'api', api_type: 'json', c: '694510', api_v: '1' }, (newOptions || {}));
        const models = await new Promise((resolve) => this.httpService
            .get(`https://bngpt.com/promo.php?${querystring_1.stringify(options)}`)
            .subscribe((resp) => resolve(resp.data || []), ({ response: resp, code }) => resolve([])));
        return models.map(model => {
            var _a;
            const country = cam_aggregator_service_1.CamAggregatorService.detectCountry(model.homecountry) ||
                cam_aggregator_service_1.CamAggregatorService.detectCountry(model.primary_language) ||
                cam_aggregator_service_1.CamAggregatorService.detectCountry(model.primary_language_key);
            return {
                id: model.username,
                avatar: (_a = model.profile_images) === null || _a === void 0 ? void 0 : _a.profile_image,
                username: model.username,
                dateOfBirth: model.birthday,
                phone: null,
                isOnline: true,
                watching: null,
                gender: this.getGender(model.gender),
                isStreaming: true,
                isFavorite: false,
                socials: false,
                stats: {
                    views: null,
                    favorites: model.members_count
                },
                lastStreamingTime: null,
                streamingStatus: model.chat_status,
                streamingTitle: '',
                country: (country === null || country === void 0 ? void 0 : country.code) || null,
                countryFlag: (country === null || country === void 0 ? void 0 : country.flag) || null,
                city: null,
                state: null,
                zipcode: null,
                address: null,
                languages: [model.primary_language],
                categoryIds: [],
                categories: [],
                service: 'bongacams',
                aboutMe: '',
                tags: model.tags,
                iframe: model.embed_chat_url,
                profileLink: model.chat_url_on_home_page,
                age: model.display_age
            };
        });
    }
};
BongacamsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], BongacamsService);
exports.BongacamsService = BongacamsService;
//# sourceMappingURL=bongacams.service.js.map