import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { MenuModel } from '../models';
import { MenuDto } from '../dtos';
import { MenuCreatePayload, MenuUpdatePayload } from '../payloads';
export declare class MenuService {
    private readonly Menu;
    constructor(Menu: Model<MenuModel>);
    checkOrdering(ordering: number, id?: string | ObjectId): any;
    findById(id: string | ObjectId): Promise<MenuModel>;
    create(payload: MenuCreatePayload): Promise<MenuDto>;
    update(id: string | ObjectId, payload: MenuUpdatePayload): Promise<MenuDto>;
    delete(id: string | ObjectId | MenuModel): Promise<boolean>;
}
