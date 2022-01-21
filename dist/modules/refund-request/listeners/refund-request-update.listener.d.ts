import { QueueEvent, QueueEventService } from 'src/kernel';
import { OrderService } from 'src/modules/payment/services';
export declare class RefundRequestUpdateListener {
    private readonly queueEventService;
    private readonly orderService;
    constructor(queueEventService: QueueEventService, orderService: OrderService);
    handler(event: QueueEvent): Promise<void>;
}
