import { RuntimeException } from 'src/kernel';
export declare class InvalidImageException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
