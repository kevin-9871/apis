import { DataResponse } from 'src/kernel';
import { PostService } from '../services';
import { PostDto } from '../dtos';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    details(id: string): Promise<DataResponse<PostDto>>;
}
