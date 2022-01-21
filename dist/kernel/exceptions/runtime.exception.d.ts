import { HttpException, HttpStatus } from '@nestjs/common';
export declare class RuntimeException extends HttpException {
    protected constructor(message: string | object, error?: string, statusCode?: HttpStatus);
}
