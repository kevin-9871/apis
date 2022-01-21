"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueEventService = void 0;
const events_1 = require("../../events");
const queue_event_abstract_service_1 = require("./queue-event-abstract.service");
class QueueEventService extends queue_event_abstract_service_1.QueueEventServiceAbstract {
    constructor(queueService) {
        super();
        this.queueService = queueService;
        this.queueInstances = {};
    }
    getQueueInstance(channel, topic) {
        if (!this.queueInstances[channel]) {
            this.queueInstances[channel] = {};
        }
        if (!this.queueInstances[channel][topic]) {
            this.queueInstances[channel][topic] = this.queueService.createInstance(`${channel}_${topic}`);
        }
        return this.queueInstances[channel][topic];
    }
    subscribe(channel, topic, handler) {
        if (this.queueInstances[channel] && this.queueInstances[channel][topic]) {
            console.warn(`Cannot add same listener to same topic in ${channel}. Please create new topic name`);
            return;
        }
        const queue = this.getQueueInstance(channel, topic);
        queue.process(async (job) => {
            await handler(job.data);
        });
    }
    async publish(event) {
        if (!this.queueInstances[event.channel]) {
            console.warn(`No subscriber for channel ${event.channel}`);
            return;
        }
        Promise.all(Object.keys(this.queueInstances[event.channel]).map((topic) => this.queueInstances[event.channel][topic].createJob(event)
            .save()));
    }
}
exports.QueueEventService = QueueEventService;
//# sourceMappingURL=queue-event.service.js.map