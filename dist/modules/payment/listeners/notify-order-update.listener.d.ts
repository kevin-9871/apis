import { QueueEventService, QueueEvent } from 'src/kernel';
import { MailerService } from 'src/modules/mailer/services';
import { UserService } from 'src/modules/user/services';
export declare class NotifyOrderUpdateListener {
    private readonly queueEventService;
    private readonly mailService;
    private readonly userService;
    private readonly logger;
    constructor(queueEventService: QueueEventService, mailService: MailerService, userService: UserService);
    handler(event: QueueEvent): Promise<void>;
}
