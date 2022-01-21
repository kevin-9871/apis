import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { EarningService } from 'src/modules/earning/services/earning.service';
import { StudioService } from 'src/modules/studio/services';
export declare class UpdatePayoutRequestListener {
    private readonly queueEventService;
    private readonly mailService;
    private readonly earningService;
    private readonly performerService;
    private readonly studioService;
    constructor(queueEventService: QueueEventService, mailService: MailerService, earningService: EarningService, performerService: PerformerService, studioService: StudioService);
    handler(event: QueueEvent): Promise<void>;
}
