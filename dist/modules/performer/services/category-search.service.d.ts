import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { CategoryModel } from '../models';
import { CategorySearchRequestPayload } from '../payloads';
import { PerformerCategoryDto } from '../dtos';
export declare class CategorySearchService {
    private readonly categoryModel;
    constructor(categoryModel: Model<CategoryModel>);
    search(req: CategorySearchRequestPayload): Promise<PageableData<PerformerCategoryDto>>;
}
