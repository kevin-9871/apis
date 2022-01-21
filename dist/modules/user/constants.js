"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENDERS = exports.GENDER_TRANSGENDER = exports.GENDER_FEMALE = exports.GENDER_MALE = exports.STATUS = exports.STATUS_INACTIVE = exports.STATUS_ACTIVE = exports.STATUS_PENDING = exports.USER_ROLES = exports.ROLE_USER = exports.ROLE_ADMIN = void 0;
exports.ROLE_ADMIN = 'admin';
exports.ROLE_USER = 'user';
exports.USER_ROLES = {
    ADMIN: exports.ROLE_ADMIN,
    USER: exports.ROLE_USER
};
exports.STATUS_PENDING = 'pending';
exports.STATUS_ACTIVE = 'active';
exports.STATUS_INACTIVE = 'inactive';
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "pending";
    STATUS["ACTIVE"] = "active";
    STATUS["INACTIVE"] = "inactive";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
exports.GENDER_MALE = 'male';
exports.GENDER_FEMALE = 'female';
exports.GENDER_TRANSGENDER = 'transgender';
exports.GENDERS = [exports.GENDER_MALE, exports.GENDER_FEMALE, exports.GENDER_TRANSGENDER];
//# sourceMappingURL=constants.js.map