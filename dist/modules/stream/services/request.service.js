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
exports.RequestService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
let RequestService = class RequestService {
    constructor(httpService, settingService) {
        this.httpService = httpService;
        this.settingService = settingService;
    }
    init() {
        return Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.ANT_MEDIA_API_ENDPOINT),
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.ANT_MEDIA_APPNAME)
        ]);
    }
    async create(data) {
        const [apiEndpoint, appName] = await this.init();
        if (!apiEndpoint || !appName) {
            throw new kernel_1.MissingServerConfig();
        }
        return new Promise(resolve => {
            this.httpService
                .post(`${apiEndpoint}/${appName}/rest/v2/broadcasts/create`, data)
                .subscribe(resp => {
                resolve(kernel_1.DataResponse.ok(resp.data));
            }, ({ response: resp, code }) => {
                if (code) {
                    resolve(kernel_1.DataResponse.error(new Error('Bad Request'), code));
                    return;
                }
                if ((resp === null || resp === void 0 ? void 0 : resp.status) && [400, 200].includes(resp.status)) {
                    resolve(kernel_1.DataResponse.ok(resp.data));
                    return;
                }
                resolve(kernel_1.DataResponse.error(new Error('Stream Server Error'), lodash_1.pick(resp, ['statusText', 'status', 'data'])));
            });
        });
    }
    async generateOneTimeToken(id, payload) {
        const [apiEndpoint, appName] = await this.init();
        if (!apiEndpoint || !appName) {
            throw new kernel_1.MissingServerConfig();
        }
        return new Promise(resolve => {
            this.httpService
                .get(`${apiEndpoint}/${appName}/rest/v2/broadcasts/${id}/token`, {
                params: payload
            })
                .subscribe(resp => {
                resolve(kernel_1.DataResponse.ok(resp.data));
            }, ({ response: resp, code }) => {
                if (code) {
                    resolve(kernel_1.DataResponse.error(new Error('Bad Request'), code));
                    return;
                }
                resolve(kernel_1.DataResponse.error(new Error('Stream Server Error'), lodash_1.pick(resp, ['statusText', 'status', 'data'])));
            });
        });
    }
    async removeAllTokenRelateStreamId(id) {
        const [apiEndpoint, appName] = await this.init();
        if (!apiEndpoint || !appName) {
            throw new kernel_1.MissingServerConfig();
        }
        return new Promise(resolve => {
            this.httpService
                .delete(`${apiEndpoint}/${appName}/rest/v2/broadcasts/${id}/tokens`)
                .subscribe(resp => {
                resolve(kernel_1.DataResponse.ok(resp.data));
            }, ({ response: resp, code }) => {
                if (code) {
                    resolve(kernel_1.DataResponse.error(new Error('Bad Request'), code));
                    return;
                }
                resolve(kernel_1.DataResponse.error(new Error('Stream Server Error'), lodash_1.pick(resp, ['statusText', 'status', 'data'])));
            });
        });
    }
    async getAllTokenRelateStreamId(id, payload) {
        const [apiEndpoint, appName] = await this.init();
        if (!apiEndpoint || !appName) {
            throw new kernel_1.MissingServerConfig();
        }
        const { offset, size } = payload;
        return new Promise(resolve => {
            this.httpService
                .delete(`${apiEndpoint}/${appName}/rest/v2/broadcasts/${id}/tokens/${offset}/${size}`)
                .subscribe(resp => {
                resolve(kernel_1.DataResponse.ok(resp.data));
            }, ({ response: resp, code }) => {
                if (code) {
                    resolve(kernel_1.DataResponse.error(new Error('Bad Request'), code));
                    return;
                }
                resolve(kernel_1.DataResponse.error(new Error('Stream Server Error'), lodash_1.pick(resp, ['statusText', 'status', 'data'])));
            });
        });
    }
    async getBroadcast(id) {
        const [apiEndpoint, appName] = await this.init();
        if (!apiEndpoint || !appName) {
            throw new kernel_1.MissingServerConfig();
        }
        return new Promise(resolve => {
            this.httpService
                .get(`${apiEndpoint}/${appName}/rest/v2/broadcasts/${id}`)
                .subscribe(resp => {
                resolve(kernel_1.DataResponse.ok(resp.data));
            }, ({ response: resp, code }) => {
                if (code) {
                    resolve(kernel_1.DataResponse.error(new Error('Bad Request'), code));
                    return;
                }
                resolve(kernel_1.DataResponse.error(new Error('Stream Server Error'), lodash_1.pick(resp, ['statusText', 'status', 'data'])));
            });
        });
    }
};
RequestService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService,
        settings_1.SettingService])
], RequestService);
exports.RequestService = RequestService;
//# sourceMappingURL=request.service.js.map