import { UserDto } from 'src/modules/user/dtos';
import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { TokenPackageService } from 'src/modules/token-package/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { OrderModel } from '../models';
import { OrderDto } from '../dtos';
import { OrderUpdatePayload } from '../payloads/order-update.payload';
export declare class OrderService {
    private readonly Order;
    private readonly tokenService;
    private readonly performerService;
    private readonly userService;
    private readonly queueEventService;
    constructor(Order: Model<OrderModel>, tokenService: TokenPackageService, performerService: PerformerService, userService: UserService, queueEventService: QueueEventService);
    createTokenOrderFromPayload(packageId: string | ObjectId, user: UserDto, orderStatus?: string): Promise<OrderModel>;
    findById(id: any): Promise<OrderDto>;
    findByIds(ids: any): Promise<OrderDto[]>;
    getDetails(id: string | ObjectId | OrderDto): Promise<OrderDto>;
    update(id: string | ObjectId, payload: OrderUpdatePayload): Promise<OrderModel>;
}
