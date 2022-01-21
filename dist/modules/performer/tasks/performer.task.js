"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerTask = exports.CHECK_ONLINE_STATUS_SCHEDULE = void 0;
const common_1 = require("@nestjs/common");
const agenda_1 = require("../../../kernel/infras/agenda");
const lodash_1 = require("lodash");
const nestjs_redis_1 = require("nestjs-redis");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_1 = require("../services");
exports.CHECK_ONLINE_STATUS_SCHEDULE = 'CHECK_ONLINE_STATUS_SCHEDULE';
let PerformerTask = class PerformerTask {
    constructor(redisService, agendaService, socketUserService, performerService) {
        this.redisService = redisService;
        this.agendaService = agendaService;
        this.socketUserService = socketUserService;
        this.performerService = performerService;
        this.agendaService.define(exports.CHECK_ONLINE_STATUS_SCHEDULE, {}, this.modelOnlineStatusHandler.bind(this));
        this.agendaService.every('2 minutes', exports.CHECK_ONLINE_STATUS_SCHEDULE);
    }
    async modelOnlineStatusHandler(job, done) {
        try {
            const query = job.attrs.data;
            const onlinePerformers = await this.performerService.find(Object.assign(Object.assign({}, query), { isOnline: true }));
            if (!onlinePerformers.length) {
                return;
            }
            const redisClient = this.redisService.getClient();
            const promises = [];
            const connectedSockets = await this.socketUserService.getConnectedSocket();
            const connectedSocketIds = Object.keys(connectedSockets).map(id => id);
            const sockets = {};
            let results = await Promise.all(onlinePerformers.map(p => redisClient.smembers(p._id)));
            results.forEach((v, i) => {
                sockets[onlinePerformers[i]._id] = v;
            });
            if (!connectedSocketIds.length) {
                await Promise.all(onlinePerformers.map(p => sockets[p._id].length && redisClient.srem(p._id, sockets[p._id])));
            }
            else {
                Object.keys(sockets).forEach(p_id => {
                    const disconnectSockets = lodash_1.difference(sockets[p_id], connectedSocketIds);
                    if (disconnectSockets.length) {
                        promises.push(redisClient.srem(p_id, disconnectSockets));
                    }
                });
                await Promise.all(promises);
            }
            results = await Promise.all(onlinePerformers.map(p => redisClient.smembers(p._id)));
            results.forEach((v, i) => {
                sockets[onlinePerformers[i]._id] = v;
            });
            await Promise.all(Object.keys(sockets).map(p_id => {
                if (!sockets[p_id].length) {
                    return this.performerService.offline(p_id);
                }
                return null;
            }));
        }
        catch (err) {
            console.log(err);
        }
        finally {
            done();
        }
    }
};
PerformerTask = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_redis_1.RedisService,
        agenda_1.AgendaService,
        socket_user_service_1.SocketUserService,
        services_1.PerformerService])
], PerformerTask);
exports.PerformerTask = PerformerTask;
//# sourceMappingURL=performer.task.js.map