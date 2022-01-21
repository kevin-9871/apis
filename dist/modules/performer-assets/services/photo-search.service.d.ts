import { Model } from 'mongoose';
import { PageableData, SearchRequest } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { PaymentTokenService } from 'src/modules/purchased-item/services';
import { UserDto } from 'src/modules/user/dtos';
import { ObjectId } from 'mongodb';
import { GalleryService } from './gallery.service';
import { PhotoSearchRequest } from '../payloads';
import { PerformerPhotoResponse, PhotoDto } from '../dtos';
import { PhotoModel } from '../models';
export declare class PhotoSearchService {
    private readonly photoModel;
    private readonly performerService;
    private readonly galleryService;
    private readonly fileService;
    private readonly paymentTokenService;
    constructor(photoModel: Model<PhotoModel>, performerService: PerformerService, galleryService: GalleryService, fileService: FileService, paymentTokenService: PaymentTokenService);
    adminSearch(req: PhotoSearchRequest, jwToken: string): Promise<PageableData<PhotoDto>>;
    userSearch(galleryId: string | ObjectId, req: SearchRequest, user: UserDto, jwToken: string): Promise<PageableData<PerformerPhotoResponse>>;
    performerSearch(req: PhotoSearchRequest, user: UserDto, jwToken: string): Promise<PageableData<PhotoDto>>;
}
