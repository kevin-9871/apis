import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { CategoryService, CategorySearchService } from '../services';
import { CategoryCreatePayload, CategoryUpdatePayload, CategorySearchRequestPayload } from '../payloads';
import { PerformerCategoryDto } from '../dtos';
export declare class AdminCategoryController {
    private readonly categoryService;
    private readonly categorySearchService;
    constructor(categoryService: CategoryService, categorySearchService: CategorySearchService);
    create(currentUser: UserDto, payload: CategoryCreatePayload): Promise<DataResponse<PerformerCategoryDto>>;
    update(id: string, currentUser: UserDto, payload: CategoryUpdatePayload): Promise<DataResponse<PerformerCategoryDto>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(req: CategorySearchRequestPayload): Promise<DataResponse<PageableData<PerformerCategoryDto>>>;
    details(id: string): Promise<DataResponse<PerformerCategoryDto>>;
}
