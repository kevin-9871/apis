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
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const common_2 = require("../../../kernel/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const json2csv_1 = require("json2csv");
const payloads_1 = require("../payloads");
const dtos_1 = require("../dtos");
const services_2 = require("../services");
let AdminUserController = class AdminUserController {
    constructor(userService, userSearchService, authService) {
        this.userService = userService;
        this.userSearchService = userSearchService;
        this.authService = authService;
    }
    async search(req) {
        return kernel_1.DataResponse.ok(await this.userSearchService.search(req));
    }
    async createUser(payload) {
        const user = await this.userService.create(payload, {
            roles: payload.roles,
            emailVerified: payload.emailVerified,
            status: payload.status
        });
        if (payload.password) {
            await Promise.all([
                this.authService.create({
                    type: 'email',
                    value: payload.password,
                    source: 'user',
                    key: payload.email,
                    sourceId: user._id
                }),
                this.authService.create({
                    type: 'username',
                    value: payload.password,
                    source: 'user',
                    key: payload.username,
                    sourceId: user._id
                })
            ]);
        }
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
    async updateUser(payload, userId) {
        await this.userService.adminUpdate(userId, payload);
        const user = await this.userService.findById(userId);
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
    async getDetails(id) {
        const user = await this.userService.findById(id);
        return kernel_1.DataResponse.ok(new dtos_1.UserDto(user).toResponse(true));
    }
    async exportCsv(query, nameFile, res) {
        const fileName = nameFile || 'users_export.csv';
        const fields = [
            {
                label: 'username',
                value: 'username'
            },
            {
                label: 'Email',
                value: 'email'
            },
            {
                label: 'Phone',
                value: 'phone'
            },
            {
                label: 'Status',
                value: 'status'
            },
            {
                label: 'Gender',
                value: 'gender'
            },
            {
                label: 'Country',
                value: 'country'
            },
            {
                label: 'Balance',
                value: 'balance'
            }
        ];
        const { data } = await this.userSearchService.search(Object.assign(Object.assign({}, query), { limit: 9999 }));
        const json2csv = new json2csv_1.Parser({ fields });
        const csv = json2csv.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment(fileName);
        return res.send(csv);
    }
    async stats() {
        const results = await this.userService.stats();
        return kernel_1.DataResponse.ok(results);
    }
};
__decorate([
    common_1.Get('/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "search", null);
__decorate([
    common_1.Post('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserAuthCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "createUser", null);
__decorate([
    common_1.Put('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserAuthUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "updateUser", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getDetails", null);
__decorate([
    common_1.Get('/export/csv'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Query('fileName')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserSearchRequestPayload, String, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "exportCsv", null);
__decorate([
    common_1.Get('/stats'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "stats", null);
AdminUserController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/users'),
    __metadata("design:paramtypes", [services_2.UserService,
        services_2.UserSearchService,
        services_1.AuthService])
], AdminUserController);
exports.AdminUserController = AdminUserController;
//# sourceMappingURL=admin-user.controller.js.map