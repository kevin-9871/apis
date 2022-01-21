export declare enum ResultStatus {
    OK = 0,
    FAIL = 1,
    ERROR = 2
}
export declare class DataResponse<D> {
    readonly status: ResultStatus;
    readonly data?: D;
    readonly message?: string;
    readonly error?: Error;
    constructor(status: ResultStatus, data?: D, message?: string, error?: Error);
    isOk(): boolean;
    isFail(): boolean;
    isError(): boolean;
    static ok<D>(data?: D): DataResponse<D>;
    static fail<D>(error: Error): DataResponse<D>;
    static error<D>(error: Error, data?: D): DataResponse<D>;
}
