"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCLUDE_FIELDS = exports.ROLE = exports.STATUS = exports.EVENT = exports.ACTION = void 0;
exports.ACTION = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete'
};
exports.EVENT = {
    CREATED: 'created',
    UPDATED: 'updated',
    DELETED: 'deleted'
};
exports.STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending'
};
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "user";
    ROLE["PERFORMER"] = "performer";
    ROLE["STUDIO"] = "studio";
})(ROLE = exports.ROLE || (exports.ROLE = {}));
exports.EXCLUDE_FIELDS = ['balance', 'status', 'emailVerified', 'roles'];
//# sourceMappingURL=constants.js.map