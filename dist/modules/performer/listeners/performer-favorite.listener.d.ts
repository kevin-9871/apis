import { QueueEventService, QueueEvent } from 'src/kernel';
import { Model } from 'mongoose';
import { PerformerModel } from '../models';
export declare class PerformerFavoriteListener {
    private readonly queueEventService;
    private readonly performerModel;
    constructor(queueEventService: QueueEventService, performerModel: Model<PerformerModel>);
    handleFavorite(event: QueueEvent): Promise<void>;
}
