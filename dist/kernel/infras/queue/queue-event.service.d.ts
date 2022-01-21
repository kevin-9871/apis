import { QueueEvent } from 'src/kernel/events';
import { QueueEventServiceAbstract } from './queue-event-abstract.service';
import { QueueService } from './queue.service';
export declare class QueueEventService extends QueueEventServiceAbstract {
    private queueService;
    private queueInstances;
    constructor(queueService: QueueService);
    private getQueueInstance;
    subscribe(channel: string, topic: string, handler: Function): Promise<void>;
    publish(event: QueueEvent): Promise<void>;
}
