import { HttpException } from '@nestjs/common';
export declare class EmailVerificationFailureException extends HttpException {
    constructor(error: string | Record<string, any>);
}
