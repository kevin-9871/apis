import { QueueEvent, QueueEventService } from 'src/kernel';
import { StudioService } from '../services';
export declare class StudioMemberListener {
    private readonly studioService;
    private readonly queueEventService;
    constructor(studioService: StudioService, queueEventService: QueueEventService);
    handler(event: QueueEvent): Promise<void>;
}
