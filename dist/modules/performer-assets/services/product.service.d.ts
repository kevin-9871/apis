import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { PaymentTokenService } from 'src/modules/purchased-item/services';
import { ProductDto } from '../dtos';
import { ProductCreatePayload, ProductUpdatePayload } from '../payloads';
import { ProductModel } from '../models';
export declare class ProductService {
    private readonly ProductModel;
    private readonly performerService;
    private readonly fileService;
    private readonly queueEventService;
    private readonly paymentTokenService;
    constructor(ProductModel: Model<ProductModel>, performerService: PerformerService, fileService: FileService, queueEventService: QueueEventService, paymentTokenService: PaymentTokenService);
    create(payload: ProductCreatePayload, digitalFile: FileDto, imageFile: FileDto, creator?: UserDto): Promise<ProductDto>;
    update(id: string | ObjectId, payload: ProductUpdatePayload, digitalFile: FileDto, imageFile: FileDto, updater?: UserDto): Promise<ProductDto>;
    delete(id: string | ObjectId): Promise<boolean>;
    getDetails(id: string | ObjectId): Promise<ProductDto>;
    performerGetDetails(id: string | ObjectId, jwToken: string): Promise<ProductDto>;
    findByIds(ids: any): Promise<ProductDto[]>;
    findById(id: any): Promise<ProductDto>;
    findByPerformerIds(ids: string[] | ObjectId[]): Promise<import("mongoose").LeanDocument<ProductModel>[]>;
    updateStock(id: string | ObjectId, num?: number): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    checkAuth(req: any, user: UserDto): Promise<boolean>;
}
