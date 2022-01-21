import { UserDto } from 'src/modules/user/dtos';
import { DataResponse, PageableData } from 'src/kernel';
import { FavouriteService } from '../services';
import { FavouriteSearchPayload } from '../payload';
import { FavouriteDto } from '../dtos';
export declare class UserFavouriteController {
    private readonly favouriteService;
    constructor(favouriteService: FavouriteService);
    like(id: string, user: UserDto): Promise<DataResponse<any>>;
    unlike(id: string, user: UserDto): Promise<DataResponse<any>>;
    userSearch(req: FavouriteSearchPayload, user: UserDto): Promise<DataResponse<PageableData<FavouriteDto>>>;
}
