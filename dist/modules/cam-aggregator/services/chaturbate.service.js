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
exports.ChaturbateService = void 0;
const common_1 = require("@nestjs/common");
const querystring_1 = require("querystring");
const cam_aggregator_service_1 = require("./cam-aggregator.service");
let ChaturbateService = class ChaturbateService {
    constructor(httpService) {
        this.httpService = httpService;
        this.hsetKey = 'CAMS_chaturbate';
    }
    getGender(gender) {
        switch (gender) {
            case 'f': return 'female';
            case 'm': return 'male';
            case 't': return 'transgender';
            case 'c': return 'couple';
            default: return gender;
        }
    }
    async listOnline(newOptions) {
        const options = Object.assign({ wm: 'ZCn7T', client_ip: 'request_ip', format: 'json', limit: 100, offset: 0 }, (newOptions || {}));
        const models = await new Promise((resolve) => this.httpService
            .get(`https://chaturbate.com/api/public/affiliates/onlinerooms/?${querystring_1.stringify(options)}`)
            .subscribe((resp) => { var _a; return resolve(((_a = resp.data) === null || _a === void 0 ? void 0 : _a.results) || []); }, ({ response: resp, code }) => resolve([])));
        return models.map(model => {
            const country = cam_aggregator_service_1.CamAggregatorService.detectCountry(model.location) ||
                cam_aggregator_service_1.CamAggregatorService.detectCountry(model.spoken_languages);
            return {
                id: model.username,
                avatar: model.image_url,
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
                    views: model.num_users,
                    favorites: model.num_followers
                },
                lastStreamingTime: null,
                streamingStatus: model.current_show,
                streamingTitle: '',
                country: (country === null || country === void 0 ? void 0 : country.code) || null,
                countryFlag: (country === null || country === void 0 ? void 0 : country.flag) || null,
                city: null,
                state: null,
                zipcode: null,
                address: null,
                languages: (model.spoken_languages || '').split(','),
                categoryIds: [],
                categories: [],
                service: 'chaturbate',
                aboutMe: model.room_subject,
                tags: model.tags,
                iframe: model.iframe_embed,
                profileLink: model.chat_room_url,
                age: model.age
            };
        });
    }
};
ChaturbateService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], ChaturbateService);
exports.ChaturbateService = ChaturbateService;
//# sourceMappingURL=chaturbate.service.js.map