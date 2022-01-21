export declare class Event {
    channel: string;
    eventName?: string;
    data: any;
    priority?: number;
    constructor(data: Event);
}
