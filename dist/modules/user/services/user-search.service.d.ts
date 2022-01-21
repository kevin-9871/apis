import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import { UserModel } from '../models';
import { UserDto } from '../dtos';
import { UserSearchRequestPayload } from '../payloads';
export declare class UserSearchService {
    private readonly userModel;
    constructor(userModel: Model<UserModel>);
    search(req: UserSearchRequestPayload): Promise<PageableData<UserDto>>;
    searchByKeyword(req: any): Promise<import("mongoose").LeanDocument<UserModel>[]>;
}
