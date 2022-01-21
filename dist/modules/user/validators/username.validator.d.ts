import { ValidatorConstraintInterface } from 'class-validator';
export declare class Username implements ValidatorConstraintInterface {
    validate(text: string): boolean;
    defaultMessage(): string;
}
