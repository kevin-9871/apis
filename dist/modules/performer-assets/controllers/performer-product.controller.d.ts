import { UserDto } from 'src/modules/user/dtos';
import { ProductService } from '../services/product.service';
import { ProductCreatePayload, ProductSearchRequest } from '../payloads';
import { ProductSearchService } from '../services/product-search.service';
export declare class PerformerProductController {
    private readonly productService;
    private readonly productSearchService;
    constructor(productService: ProductService, productSearchService: ProductSearchService);
    create(files: Record<string, any>, payload: ProductCreatePayload, creator: UserDto): Promise<any>;
    update(id: string, files: Record<string, any>, payload: ProductCreatePayload, updater: UserDto): Promise<any>;
    delete(id: string): Promise<any>;
    details(id: string, request: any): Promise<any>;
    search(req: ProductSearchRequest, user: UserDto, request: any): Promise<any>;
    userSearch(req: ProductSearchRequest): Promise<any>;
}
