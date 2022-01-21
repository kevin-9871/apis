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
exports.CategorySearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
let CategorySearchService = class CategorySearchService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async search(req) {
        const query = {};
        if (req.q) {
            query.$or = [
                {
                    name: { $regex: req.q }
                }
            ];
        }
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.categoryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.categoryModel.countDocuments(query)
        ]);
        return {
            data: data.map(d => new dtos_1.PerformerCategoryDto(d)),
            total
        };
    }
};
CategorySearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_CATEGORY_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CategorySearchService);
exports.CategorySearchService = CategorySearchService;
//# sourceMappingURL=category-search.service.js.map