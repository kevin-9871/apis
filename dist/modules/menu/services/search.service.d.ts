import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { MenuModel } from '../models';
import { MenuSearchRequestPayload } from '../payloads';
import { MenuDto } from '../dtos';
export declare class MenuSearchService {
    private readonly menuModel;
    constructor(menuModel: Model<MenuModel>);
    search(req: MenuSearchRequestPayload): Promise<PageableData<MenuDto>>;
    userSearch(req: MenuSearchRequestPayload): Promise<PageableData<MenuDto>>;
}
