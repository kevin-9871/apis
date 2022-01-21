"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
const lodash_1 = require("lodash");
const file_1 = require("../../file");
class UserDto {
    constructor(data) {
        this.roles = ['user'];
        data
            && Object.assign(this, lodash_1.pick(data, [
                '_id',
                'name',
                'firstName',
                'lastName',
                'email',
                'phone',
                'roles',
                'avatarId',
                'timezone',
                'avatarPath',
                'status',
                'username',
                'gender',
                'balance',
                'stats',
                'country',
                'city',
                'dateOfBirth',
                'state',
                'emailVerified',
                'isOnline',
                'onlineAt',
                'offlineAt',
                'totalOnlineTime',
                'createdAt'
            ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            avatar: file_1.FileDto.getPublicUrl(this.avatarPath),
            roles: this.roles,
            username: this.username,
            isOnline: this.isOnline
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), { name: this.name || `${this.firstName} ${this.lastName}`, email: this.email, phone: this.phone, status: this.status, gender: this.gender, firstName: this.firstName, lastName: this.lastName, balance: this.balance, country: this.country, city: this.city, stats: this.stats, dateOfBirth: this.dateOfBirth, state: this.state, timezone: this.timezone, emailVerified: this.emailVerified, onlineAt: this.onlineAt, offlineAt: this.offlineAt, totalOnlineTime: this.totalOnlineTime, createdAt: this.createdAt });
    }
    toPrivateRequestResponse() {
        return {
            _id: this._id,
            avatar: file_1.FileDto.getPublicUrl(this.avatarPath),
            roles: this.roles,
            username: this.username,
            balance: this.balance,
            isOnline: this.isOnline
        };
    }
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map