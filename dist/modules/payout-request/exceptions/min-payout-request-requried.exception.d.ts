import { HttpException } from '@nestjs/common';
export declare const MIN_PAYOUT_REQUEST_REQUIRED = "MIN_PAYOUT_REQUEST_REQUIRED";
export declare class MinPayoutRequestRequiredException extends HttpException {
    constructor(response?: Record<string, any>);
}
