import { QueueEventService, QueueEvent } from 'src/kernel';
import { Model } from 'mongoose';
import { GalleryModel } from '../models';
import { PhotoService } from '../services';
export declare class PerformerAssetsListener {
    private readonly queueEventService;
    private readonly photoService;
    private readonly galleryModel;
    private readonly logger;
    constructor(queueEventService: QueueEventService, photoService: PhotoService, galleryModel: Model<GalleryModel>);
    handlePhotoCount(event: QueueEvent): Promise<void>;
    handleDeleteGallery(event: QueueEvent): Promise<void>;
}
