"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIALIZE_COMMISSION = exports.whiteListIps = exports.BLOCK_ACTION = exports.PERFORMER_STEAMING_STATUS_CHANNEL = exports.PERFORMER_CHANNEL = exports.BLOCK_USERS_CHANNEL = exports.DIRECT_DEPOSIT_ACCOUNT_TYPE = exports.PERFORMER_BANK_TRANSFER_TYPE = exports.PERFORMER_STATUSES = void 0;
exports.PERFORMER_STATUSES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending'
};
exports.PERFORMER_BANK_TRANSFER_TYPE = ['wireTransfer', 'paypal', 'check'];
exports.DIRECT_DEPOSIT_ACCOUNT_TYPE = ['credit', 'savings'];
exports.BLOCK_USERS_CHANNEL = 'BLOCK_USERS_CHANNEL';
exports.PERFORMER_CHANNEL = 'PERFORMER_CHANNEL';
exports.PERFORMER_STEAMING_STATUS_CHANNEL = 'PERFORMER_STEAMING_STATUS_CHANNEL';
exports.BLOCK_ACTION = {
    CREATED: 'CREATED',
    DELETED: 'DELETED',
    UPDATED: 'UPDATED'
};
exports.whiteListIps = ['127.0.0.1', '0.0.0.1'];
exports.INITIALIZE_COMMISSION = [
    'tipCommission',
    'albumCommission',
    'groupCallCommission',
    'privateCallCommission',
    'productCommission',
    'videoCommission'
];
//# sourceMappingURL=constants.js.map