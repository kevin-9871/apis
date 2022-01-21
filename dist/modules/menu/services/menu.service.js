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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const providers_1 = require("../providers");
const models_1 = require("../models");
const dtos_1 = require("../dtos");
let MenuService = class MenuService {
    constructor(Menu) {
        this.Menu = Menu;
    }
    async checkOrdering(ordering, id) {
        const query = { ordering };
        if (id) {
            query._id = { $ne: id };
        }
        const count = await this.Menu.countDocuments(query);
        if (!count) {
            return ordering;
        }
        return this.checkOrdering(ordering + 1, id);
    }
    async findById(id) {
        const query = { _id: id };
        const menu = await this.Menu.findOne(query);
        if (!menu)
            return null;
        return menu;
    }
    async create(payload) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        data.ordering = await this.checkOrdering(payload.ordering || 0);
        const menu = await this.Menu.create(data);
        return new dtos_1.MenuDto(menu);
    }
    async update(id, payload) {
        const menu = await this.findById(id);
        if (!menu) {
            throw new common_1.NotFoundException();
        }
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date() });
        data.ordering = await this.checkOrdering(payload.ordering || 0, menu._id);
        lodash_1.merge(menu, data);
        await menu.save();
        return menu;
    }
    async delete(id) {
        const menu = id instanceof models_1.MenuModel ? id : await this.findById(id);
        if (!menu) {
            throw new common_1.NotFoundException('Menu not found');
        }
        await this.Menu.deleteOne({ _id: id });
        return true;
    }
};
MenuService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.MENU_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], MenuService);
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map