import { PerformerDto } from 'src/modules/performer/dtos';
import { DataResponse, PageableData } from 'src/kernel';
import { FavouriteService } from '../services';
import { FavouriteSearchPayload } from '../payload';
import { FavouriteDto } from '../dtos';
export declare class PerformerFavouriteController {
    private readonly favouriteService;
    constructor(favouriteService: FavouriteService);
    performerSearch(req: FavouriteSearchPayload, user: PerformerDto): Promise<DataResponse<PageableData<FavouriteDto>>>;
}
