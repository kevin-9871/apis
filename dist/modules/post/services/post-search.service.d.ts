import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { PostModel } from '../models';
import { AdminSearch } from '../payloads';
export declare class PostSearchService {
    private readonly postModel;
    private userService;
    constructor(postModel: Model<PostModel>, userService: UserService);
    adminSearch(req: AdminSearch): Promise<PageableData<PostModel>>;
}
