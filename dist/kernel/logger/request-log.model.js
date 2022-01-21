"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLogModel = void 0;
const mongoose = require("mongoose");
const request_log_schema_1 = require("./request-log.schema");
mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.RequestLogModel = mongoose.model('RequestLog', request_log_schema_1.RequestLogSchema);
//# sourceMappingURL=request-log.model.js.map