import { ObjectId } from 'mongodb';
export declare class AuthCreateDto {
    source: string;
    sourceId: ObjectId;
    type: string;
    key?: string;
    value?: string;
    constructor(data: Partial<AuthCreateDto>);
}
export declare class AuthUpdateDto extends AuthCreateDto {
}
