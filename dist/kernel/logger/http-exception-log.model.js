"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionLogModel = void 0;
const mongoose = require("mongoose");
const http_exception_log_schema_1 = require("./http-exception-log.schema");
mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.HttpExceptionLogModel = mongoose.model('HttpExceptionLog', http_exception_log_schema_1.HttpExceptionLogSchema);
//# sourceMappingURL=http-exception-log.model.js.map