import { DataResponse, PageableData } from 'src/kernel';
import { CategorySearchService, CategoryService } from '../services';
import { CategorySearchRequestPayload } from '../payloads';
import { PerformerCategoryDto } from '../dtos';
export declare class CategoryController {
    private readonly categorySearchService;
    private readonly categoryService;
    constructor(categorySearchService: CategorySearchService, categoryService: CategoryService);
    getList(req: CategorySearchRequestPayload): Promise<DataResponse<PageableData<PerformerCategoryDto>>>;
    details(id: string): Promise<DataResponse<PerformerCategoryDto>>;
}
