"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResponse = exports.ResultStatus = void 0;
var ResultStatus;
(function (ResultStatus) {
    ResultStatus[ResultStatus["OK"] = 0] = "OK";
    ResultStatus[ResultStatus["FAIL"] = 1] = "FAIL";
    ResultStatus[ResultStatus["ERROR"] = 2] = "ERROR";
})(ResultStatus = exports.ResultStatus || (exports.ResultStatus = {}));
class DataResponse {
    constructor(status, data, message, error) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.error = error;
    }
    isOk() {
        return this.status === ResultStatus.OK;
    }
    isFail() {
        return this.status === ResultStatus.FAIL;
    }
    isError() {
        return this.status === ResultStatus.ERROR;
    }
    static ok(data) {
        return new DataResponse(ResultStatus.OK, data);
    }
    static fail(error) {
        return new DataResponse(ResultStatus.FAIL, error.data, error.message, error);
    }
    static error(error, data) {
        return new DataResponse(ResultStatus.ERROR, data, error.message, error);
    }
}
exports.DataResponse = DataResponse;
//# sourceMappingURL=data-response.model.js.map