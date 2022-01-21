import { QueueEventService, QueueEvent } from 'src/kernel';
import { MailerService } from 'src/modules/mailer/services';
import { UserService } from 'src/modules/user/services';
import { Model } from 'mongoose';
import { ProductService } from 'src/modules/performer-assets/services';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { OrderModel } from '../models';
export declare class CreateOrderFromPurchasedItemListener {
    private readonly queueEventService;
    private readonly mailService;
    private readonly userService;
    private readonly performerService;
    private readonly productService;
    private readonly fileService;
    private readonly Order;
    private readonly logger;
    constructor(queueEventService: QueueEventService, mailService: MailerService, userService: UserService, performerService: PerformerService, productService: ProductService, fileService: FileService, Order: Model<OrderModel>);
    handler(event: QueueEvent): Promise<void>;
    private _emailNotification;
}
