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
exports.XLoveCamService = void 0;
const common_1 = require("@nestjs/common");
const querystring_1 = require("querystring");
const kernel_1 = require("../../../kernel");
let XLoveCamService = class XLoveCamService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async listOnline({ lang = 'en', searchtxt = '', order = 'rating', category = '', s_language = '', price = '', age = '', boobs = '', hair_color = '', hair_length = '', eyes = '', height = '', weight = '', ethnic_group = '', tags = '', sex_apparence = '', body_apparence = '', sex_size = '', chat = '', offset = 0, limit = 10, authServiceId = '2', authItemId = '', authSecret = '' }) {
        const data = {
            authServiceId,
            authItemId,
            authSecret,
            lang,
            searchtxt,
            order,
            category,
            s_language,
            price,
            age,
            boobs,
            hair_color,
            hair_length,
            eyes,
            height,
            weight,
            ethnic_group,
            tags,
            sex_apparence,
            body_apparence,
            sex_size,
            chat,
            offset,
            limit
        };
        const models = await new Promise((resolve) => this.httpService
            .post('https://webservice-affiliate.xlovecam.com/model/listonline', querystring_1.stringify(data), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
            .subscribe((resp) => { var _a, _b; return resolve(((_b = (_a = resp.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.models_list) || []); }, ({ response: resp, code }) => resolve([])));
        const modelIds = models.map(m => m.model_id);
        const detailsData = await this.getDetails(modelIds, {
            authServiceId,
            authItemId,
            authSecret
        });
        const details = [];
        models.map(model => {
            var _a, _b, _c;
            const detail = detailsData[model.model_id];
            if (detail) {
                const modelData = {
                    id: model.model_id,
                    avatar: model.model_profil_photo,
                    username: model.nick,
                    dateOfBirth: null,
                    phone: null,
                    isOnline: true,
                    watching: null,
                    gender: ((_a = detail.model) === null || _a === void 0 ? void 0 : _a.sex) === 'F' ? 'female' : 'male',
                    isStreaming: true,
                    isFavorite: false,
                    socials: false,
                    stats: {},
                    lastStreamingTime: null,
                    streamingStatus: model.show_type === 'free' ? 'public' : 'private',
                    streamingTitle: (_b = detail.infoByLang) === null || _b === void 0 ? void 0 : _b.phantasm,
                    country: null,
                    countryFlag: null,
                    city: null,
                    state: null,
                    zipcode: null,
                    address: null,
                    languages: ['English'],
                    categoryIds: [],
                    categories: [],
                    service: 'xlovecam',
                    aboutMe: (_c = detail.infoByLang) === null || _c === void 0 ? void 0 : _c.description,
                    profileLink: model.model_link,
                    age: model.age
                };
                details.push(modelData);
            }
        });
        return details;
    }
    async getDetails(modelIds, options = {
        authServiceId: '2',
        authItemId: '18856',
        authSecret: '63389fc7199e9f7bf6c7ac63057cec86'
    }) {
        const { authServiceId, authItemId, authSecret } = options;
        let data = querystring_1.stringify({
            authServiceId,
            authItemId,
            authSecret
        });
        modelIds.forEach(id => {
            data += `&modelid[]=${id}`;
        });
        return new Promise((resolve) => this.httpService
            .post('https://webservice-affiliate.xlovecam.com/model/getprofileinfo', data, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
            .subscribe((resp) => { var _a; return resolve(((_a = resp.data) === null || _a === void 0 ? void 0 : _a.content) || {}); }, ({ response: resp, code }) => resolve({})));
    }
    async getDetails2(modelId) {
        var _a, _b;
        const authServiceId = '2';
        const authItemId = '18856';
        const authSecret = '63389fc7199e9f7bf6c7ac63057cec86';
        const data = querystring_1.stringify({
            authServiceId,
            authItemId,
            authSecret,
            'modelid[]': modelId
        });
        const jsonData = await new Promise((resolve) => this.httpService
            .post('https://webservice-affiliate.xlovecam.com/model/getprofileinfo', data, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
            .subscribe((resp) => { var _a; return resolve(((_a = resp.data) === null || _a === void 0 ? void 0 : _a.content) || {}); }, ({ response: resp, code }) => resolve({})));
        if (!jsonData[modelId])
            throw new kernel_1.EntityNotFoundException();
        const { model } = jsonData[modelId];
        const photos = Object.keys(model.photos).map(key => model.photos[key]);
        return {
            _id: modelId,
            avatar: (photos === null || photos === void 0 ? void 0 : photos.length) ? photos[0].thumbnail : null,
            username: model.nick,
            dateOfBirth: null,
            phone: null,
            isOnline: true,
            watching: null,
            gender: (model === null || model === void 0 ? void 0 : model.sex) === 'F' ? 'female' : 'male',
            isStreaming: true,
            isFavorite: false,
            socials: false,
            stats: {},
            lastStreamingTime: null,
            streamingStatus: model.show_type === 'free' ? 'public' : 'private',
            streamingTitle: (_a = jsonData[modelId].infoByLang) === null || _a === void 0 ? void 0 : _a.phantasm,
            country: null,
            city: null,
            state: null,
            zipcode: null,
            address: null,
            languages: ['English'],
            categoryIds: [],
            categories: [],
            service: 'xlovecam',
            aboutMe: (_b = jsonData[modelId].infoByLang) === null || _b === void 0 ? void 0 : _b.description,
            photos
        };
    }
};
XLoveCamService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], XLoveCamService);
exports.XLoveCamService = XLoveCamService;
//# sourceMappingURL=xlovecam.service.js.map