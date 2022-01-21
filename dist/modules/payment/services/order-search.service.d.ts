import { Model } from 'mongoose';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { OrderModel } from '../models';
import { OrderDto } from '../dtos';
import { OrderSearchPayload } from '../payloads';
export declare class OrderSearchService {
    private readonly Order;
    private readonly performerService;
    private readonly userService;
    constructor(Order: Model<OrderModel>, performerService: PerformerService, userService: UserService);
    search(req: OrderSearchPayload): Promise<{
        total: number;
        data: OrderDto[];
    }>;
    private _mapSellerInfo;
    private _mapBuyerInfo;
}
