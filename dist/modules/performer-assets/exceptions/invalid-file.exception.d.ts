import { RuntimeException } from 'src/kernel';
export declare class InvalidFileException extends RuntimeException {
    constructor(msg?: string | object, error?: string);
}
