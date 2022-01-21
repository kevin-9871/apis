"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingModel = void 0;
const mongoose_1 = require("mongoose");
class SettingModel extends mongoose_1.Document {
    constructor() {
        super(...arguments);
        this.group = 'system';
        this.public = false;
        this.type = 'text';
        this.visible = true;
        this.editable = true;
    }
}
exports.SettingModel = SettingModel;
//# sourceMappingURL=setting.model.js.map