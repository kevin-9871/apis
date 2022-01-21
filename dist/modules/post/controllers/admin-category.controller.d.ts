import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CategoryService } from '../services';
import { CategoryCreatePayload, CategoryUpdatePayload } from '../payloads';
import { CategoryModel } from '../models';
export declare class AdminCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(currentUser: UserDto, payload: CategoryCreatePayload): Promise<DataResponse<CategoryModel>>;
    update(id: string, currentUser: UserDto, payload: CategoryUpdatePayload): Promise<DataResponse<CategoryModel>>;
    delete(id: string): Promise<DataResponse<boolean>>;
}
