import { PageableData, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { FavouriteModel } from '../models';
import { PerformerService } from '../../performer/services';
import { FavouriteSearchPayload } from '../payload';
import { FavouriteDto } from '../dtos';
export declare class FavouriteService {
    private readonly FavouriteModel;
    private readonly performerService;
    private readonly queueEventService;
    constructor(FavouriteModel: Model<FavouriteModel>, performerService: PerformerService, queueEventService: QueueEventService);
    find(params: any): Promise<FavouriteModel[]>;
    findOne(params: any): Promise<FavouriteModel>;
    findById(id: string): Promise<FavouriteModel>;
    doLike(favoriteId: string, ownerId: ObjectId): Promise<any>;
    doUnlike(favoriteId: string, ownerId: ObjectId): Promise<any>;
    userSearch(req: FavouriteSearchPayload, currentUser: UserDto): Promise<PageableData<FavouriteDto>>;
    performerSearch(req: FavouriteSearchPayload, currentUser: PerformerDto): Promise<PageableData<FavouriteDto>>;
    getAllFollowerIdsByPerformerId(performerId: string | ObjectId): Promise<ObjectId[]>;
}
