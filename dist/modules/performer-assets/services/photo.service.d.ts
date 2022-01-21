import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { PaymentTokenService } from 'src/modules/purchased-item/services';
import { AuthService } from 'src/modules/auth/services';
import { Request } from 'express';
import { PhotoDto } from '../dtos';
import { PhotoCreatePayload, PhotoUpdatePayload } from '../payloads';
import { GalleryService } from './gallery.service';
import { PhotoModel } from '../models';
export declare class PhotoService {
    private readonly PhotoModel;
    private readonly queueEventService;
    private readonly fileService;
    private readonly authService;
    private readonly paymentTokenService;
    private readonly galleryService;
    private readonly performerService;
    constructor(PhotoModel: Model<PhotoModel>, queueEventService: QueueEventService, fileService: FileService, authService: AuthService, paymentTokenService: PaymentTokenService, galleryService: GalleryService, performerService: PerformerService);
    find(condition?: {}): Promise<PhotoModel[]>;
    handleFileProcessed(event: QueueEvent): Promise<void>;
    create(file: FileDto, payload: PhotoCreatePayload, creator?: UserDto): Promise<PhotoDto>;
    updateInfo(id: string | ObjectId, payload: PhotoUpdatePayload, file: FileDto, updater?: UserDto): Promise<PhotoDto>;
    details(id: string | ObjectId, jwToken: string): Promise<PhotoDto>;
    delete(id: string | ObjectId): Promise<boolean>;
    deleteMany(condition: any): Promise<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
    deleteManyByIds(ids: string[] | ObjectId[]): import("mongoose").Query<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }, PhotoModel>;
    private handleDefaultCoverGallery;
    checkAuth(req: Request): Promise<boolean>;
}
