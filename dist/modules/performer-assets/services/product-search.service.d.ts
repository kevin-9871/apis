import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { PaymentTokenService } from 'src/modules/purchased-item/services';
import { ProductSearchRequest } from '../payloads';
import { UserDto } from '../../user/dtos';
import { ProductDto } from '../dtos';
import { ProductModel } from '../models';
export declare class ProductSearchService {
    private readonly productModel;
    private readonly performerService;
    private readonly fileService;
    private readonly paymentTokenService;
    constructor(productModel: Model<ProductModel>, performerService: PerformerService, fileService: FileService, paymentTokenService: PaymentTokenService);
    adminSearch(req: ProductSearchRequest): Promise<PageableData<ProductDto>>;
    performerSearch(req: ProductSearchRequest, user: UserDto, jwToken: string): Promise<PageableData<ProductDto>>;
    userSearch(req: ProductSearchRequest, user?: UserDto): Promise<PageableData<ProductDto>>;
}
