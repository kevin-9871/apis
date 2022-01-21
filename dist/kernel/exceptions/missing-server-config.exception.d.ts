import { HttpException } from '@nestjs/common';
export declare class MissingServerConfig extends HttpException {
    constructor(msg?: string | object);
}
