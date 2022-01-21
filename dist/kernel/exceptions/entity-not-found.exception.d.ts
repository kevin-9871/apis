import { RuntimeException } from './runtime.exception';
export declare class EntityNotFoundException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
