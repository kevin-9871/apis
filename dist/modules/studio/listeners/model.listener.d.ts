import { Model } from 'mongoose';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { SettingService } from 'src/modules/settings';
import { StudioModel } from '../models';
import { StudioService } from '../services';
export declare class ModelListener {
    private readonly studioModel;
    private readonly studioService;
    private readonly queueEventService;
    private readonly settingService;
    private readonly fileService;
    constructor(studioModel: Model<StudioModel>, studioService: StudioService, queueEventService: QueueEventService, settingService: SettingService, fileService: FileService);
    createStudioHandler(event: QueueEvent): Promise<void>;
}
