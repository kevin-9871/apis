import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { SettingService } from 'src/modules/settings';
import { QueueEventService } from 'src/kernel';
import { OrderService } from 'src/modules/payment/services';
import { ProductService } from '../../performer-assets/services/product.service';
import { RefundRequestDto } from '../dtos/refund-request.dto';
import { RefundRequestCreatePayload, RefundRequestSearchPayload, RefundRequestUpdatePayload } from '../payloads/refund-request.payload';
import { RefundRequestModel } from '../models/refund-request.model';
export declare class RefundRequestService {
    private readonly refundRequestModel;
    private readonly userService;
    private readonly performerService;
    private readonly productService;
    private readonly mailService;
    private readonly settingService;
    private readonly orderService;
    private readonly queueEventService;
    constructor(refundRequestModel: Model<RefundRequestModel>, userService: UserService, performerService: PerformerService, productService: ProductService, mailService: MailerService, settingService: SettingService, orderService: OrderService, queueEventService: QueueEventService);
    search(req: RefundRequestSearchPayload, user?: UserDto): Promise<any>;
    create(payload: RefundRequestCreatePayload, user?: UserDto): Promise<RefundRequestDto>;
    updateStatus(id: string | ObjectId, payload: RefundRequestUpdatePayload): Promise<any>;
}
