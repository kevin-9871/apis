import { ObjectId } from 'mongodb';
export interface IUserResponse {
    _id?: ObjectId;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    roles?: string[];
    timezone?: string;
    avatar?: string;
    status?: string;
    gender?: string;
    balance?: number;
    country?: string;
    city?: string;
    dateOfBirth?: Date;
    state?: string;
    emailVerified?: boolean;
    stats?: {
        totalViewTime?: number;
        totalTokenEarned?: number;
        totalTokenSpent?: number;
    };
    isOnline?: boolean;
    onlineAt?: Date;
    offlineAt?: Date;
    totalOnlineTime?: number;
    createdAt?: Date;
}
export declare class UserDto {
    _id: ObjectId;
    name?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    timezone?: string;
    roles: string[];
    avatarId?: string | ObjectId;
    avatarPath?: string;
    status?: string;
    username: string;
    gender?: string;
    balance?: number;
    dateOfBirth: Date;
    city?: string;
    stats?: any;
    state?: string;
    country: string;
    emailVerified: boolean;
    isOnline?: boolean;
    onlineAt?: Date;
    offlineAt?: Date;
    totalOnlineTime?: number;
    createdAt?: Date;
    constructor(data?: Partial<UserDto>);
    toResponse(includePrivateInfo?: boolean): IUserResponse;
    toPrivateRequestResponse(): {
        _id: ObjectId;
        avatar: string;
        roles: string[];
        username: string;
        balance: number;
        isOnline: boolean;
    };
}
