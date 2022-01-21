import { QueueEventService, QueueEvent } from 'src/kernel';
import { Model } from 'mongoose';
import { PerformerModel } from '../models';
export declare class PerformerAssetsListener {
    private readonly queueEventService;
    private readonly performerModel;
    constructor(queueEventService: QueueEventService, performerModel: Model<PerformerModel>);
    handlePhotoCount(event: QueueEvent): Promise<void>;
    handleVideoCount(event: QueueEvent): Promise<void>;
    handleProductCount(event: QueueEvent): Promise<void>;
}
