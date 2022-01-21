"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerCommissionDto = void 0;
const lodash_1 = require("lodash");
class PerformerCommissionDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'performerId',
            'tipCommission',
            'privateCallCommission',
            'groupCallCommission',
            'productCommission',
            'albumCommission',
            'videoCommission',
            'studioCommission',
            'memberCommission',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt'
        ]));
    }
}
exports.PerformerCommissionDto = PerformerCommissionDto;
//# sourceMappingURL=performer-commission.dto.js.map