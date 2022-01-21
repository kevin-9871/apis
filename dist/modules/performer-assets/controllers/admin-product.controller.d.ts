import { UserDto } from 'src/modules/user/dtos';
import { ProductService } from '../services/product.service';
import { ProductCreatePayload, ProductSearchRequest } from '../payloads';
import { ProductSearchService } from '../services/product-search.service';
export declare class AdminPerformerProductsController {
    private readonly productService;
    private readonly productSearchService;
    constructor(productService: ProductService, productSearchService: ProductSearchService);
    create(files: Record<string, any>, payload: ProductCreatePayload, creator: UserDto): Promise<any>;
    update(id: string, files: Record<string, any>, payload: ProductCreatePayload, updater: UserDto): Promise<any>;
    delete(id: string): Promise<any>;
    details(id: string): Promise<any>;
    search(req: ProductSearchRequest): Promise<any>;
}
