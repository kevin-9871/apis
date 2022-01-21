import { HttpException } from '@nestjs/common';
export declare class StreamServerErrorException extends HttpException {
    constructor(response: Record<string, any>);
}
