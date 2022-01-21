import { DataResponse } from 'src/kernel';
import { UserDto } from '../../user/dtos';
import { OrderSearchPayload } from '../payloads';
import { OrderSearchService } from '../services/order-search.service';
import { OrderService } from '../services';
import { OrderUpdatePayload } from '../payloads/order-update.payload';
export declare class OrderController {
    private readonly orderSearchService;
    private readonly orderService;
    constructor(orderSearchService: OrderSearchService, orderService: OrderService);
    userGetOrderDetails(orderId: string, user: UserDto): Promise<DataResponse<any>>;
    getOrderDetails(orderId: string, user: UserDto): Promise<DataResponse<any>>;
    getUserOrders(req: OrderSearchPayload, user: UserDto): Promise<DataResponse<any>>;
    search(req: OrderSearchPayload, user: UserDto): Promise<DataResponse<any>>;
    update(orderId: string, payload: OrderUpdatePayload, user: UserDto): Promise<DataResponse<any>>;
}
