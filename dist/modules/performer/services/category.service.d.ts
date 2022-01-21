import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
import { CategoryModel } from '../models';
import { CategoryCreatePayload, CategoryUpdatePayload } from '../payloads';
export declare class CategoryService {
    private readonly categoryModel;
    constructor(categoryModel: Model<CategoryModel>);
    find(params: any): Promise<CategoryModel[]>;
    findByIdOrSlug(id: string | ObjectId): Promise<CategoryModel>;
    generateSlug(name: string, id?: string | ObjectId): any;
    create(payload: CategoryCreatePayload, user?: UserDto): Promise<CategoryModel>;
    update(id: string | ObjectId, payload: CategoryUpdatePayload, user?: UserDto): Promise<CategoryModel>;
    delete(id: string | ObjectId | CategoryModel): Promise<void>;
}
