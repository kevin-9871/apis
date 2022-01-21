import { RuntimeException } from './runtime.exception';
export declare class ForbiddenException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
