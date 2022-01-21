import { QueueEventService, QueueEvent } from 'src/kernel';
import { MailerService } from 'src/modules/mailer/services';
import { UserService } from 'src/modules/user/services';
import { Model } from 'mongoose';
import { OrderModel } from '../models';
export declare class UpdateOrderStatusPaymentTransactionSuccessListener {
    private readonly queueEventService;
    private readonly mailService;
    private readonly userService;
    private readonly Order;
    private readonly logger;
    constructor(queueEventService: QueueEventService, mailService: MailerService, userService: UserService, Order: Model<OrderModel>);
    handler(event: QueueEvent): Promise<void>;
}
