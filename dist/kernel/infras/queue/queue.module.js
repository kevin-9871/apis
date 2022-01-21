"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var QueueModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const queue_service_1 = require("./queue.service");
const queue_event_service_1 = require("./queue-event.service");
let QueueModule = QueueModule_1 = class QueueModule {
    static forRoot(opts) {
        const queueServiceProvider = {
            provide: queue_service_1.QueueService,
            useFactory: async () => {
                const config = Object.assign({ prefix: process.env.REDIS_PRIFIX || 'bq', stallInterval: 5000, nearTermWindow: 1200000, delayedDebounce: 1000, redis: {
                        host: process.env.REDIS_HOST || '127.0.0.1',
                        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
                        db: parseInt(process.env.REDIS_DB, 10) || 0,
                        options: {}
                    }, isWorker: true, getEvents: true, sendEvents: true, storeJobs: false, ensureScripts: true, activateDelayedJobs: false, removeOnSuccess: true, removeOnFailure: true, redisScanCount: 100 }, opts || {});
                return new queue_service_1.QueueService(config);
            },
            inject: []
        };
        const queueEventServiceProvider = {
            provide: queue_event_service_1.QueueEventService,
            useFactory: async () => {
                const config = Object.assign({ prefix: 'qe', stallInterval: 5000, nearTermWindow: 1200000, delayedDebounce: 1000, redis: {
                        host: '127.0.0.1',
                        port: 6379,
                        db: 0,
                        options: {}
                    }, isWorker: true, getEvents: true, sendEvents: true, storeJobs: false, ensureScripts: true, activateDelayedJobs: false, removeOnSuccess: true, removeOnFailure: true, redisScanCount: 100 }, opts || {});
                return new queue_event_service_1.QueueEventService(new queue_service_1.QueueService(config));
            },
            inject: [queue_service_1.QueueService]
        };
        return {
            module: QueueModule_1,
            providers: [queueServiceProvider, queueEventServiceProvider],
            exports: [queueServiceProvider, queueEventServiceProvider]
        };
    }
};
QueueModule = QueueModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], QueueModule);
exports.QueueModule = QueueModule;
//# sourceMappingURL=queue.module.js.map