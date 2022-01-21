"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = common_1.createParamDecorator((data, req) => {
    const user = req.user || req.args[0].user || req.args[0].authUser;
    return user;
});
//# sourceMappingURL=current-user.decorator.js.map