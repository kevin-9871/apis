import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CategoryModel } from '../models';
import { CategoryCreatePayload, CategoryUpdatePayload } from '../payloads';
export declare class CategoryService {
    private readonly categoryModel;
    private readonly queueEventService;
    constructor(categoryModel: Model<CategoryModel>, queueEventService: QueueEventService);
    find(params: any): Promise<CategoryModel[]>;
    findByIdOrSlug(id: string | ObjectId): Promise<CategoryModel>;
    generateSlug(type: string, title: string, id?: string | ObjectId): any;
    create(payload: CategoryCreatePayload, user?: UserDto): Promise<CategoryModel>;
    update(id: string | ObjectId, payload: CategoryUpdatePayload, user?: UserDto): Promise<CategoryModel>;
    delete(id: string | ObjectId | CategoryModel): Promise<void>;
}
