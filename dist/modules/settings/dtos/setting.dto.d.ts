import { ObjectId } from 'mongodb';
export interface SettingInterface {
    key: string;
    value: any;
    name: string;
    description: string;
    group: string;
    public: boolean;
    type: string;
    visible: boolean;
    editable: boolean;
    meta: any;
    extra: string;
}
export declare class SettingDto {
    _id: ObjectId;
    key: string;
    value: any;
    name: string;
    description: string;
    group: string;
    public: boolean;
    type: string;
    visible: boolean;
    meta: any;
    createdAt: Date;
    updatedAt: Date;
    extra: string;
    constructor(data?: Partial<SettingDto>);
    getValue(): any;
}
