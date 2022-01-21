"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudioDto = void 0;
const lodash_1 = require("lodash");
class StudioDto {
    constructor(payload) {
        Object.assign(this, lodash_1.pick(payload, [
            '_id',
            'name',
            'username',
            'email',
            'status',
            'phone',
            'country',
            'city',
            'state',
            'zipcode',
            'address',
            'roles',
            'languages',
            'timezone',
            'createdAt',
            'updatedAt',
            'balance',
            'emailVerified',
            'stats',
            'documentVerificationId',
            'documentVerificationFile',
            'commission'
        ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            name: this.name,
            username: this.username,
            email: this.email,
            status: this.status,
            phone: this.phone,
            country: this.country,
            city: this.city,
            state: this.state,
            zipcode: this.zipcode,
            address: this.address,
            languages: this.languages,
            timezone: this.timezone,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            stats: this.stats
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        const privateInfo = {
            emailVerified: this.emailVerified,
            commission: this.commission,
            documentVerificationId: this.documentVerificationId,
            documentVerificationFile: this.documentVerificationFile,
            balance: this.balance,
            roles: this.roles
        };
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
}
exports.StudioDto = StudioDto;
//# sourceMappingURL=studio.dto.js.map