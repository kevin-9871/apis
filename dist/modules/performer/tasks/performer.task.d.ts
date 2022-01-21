import { AgendaService } from 'src/kernel/infras/agenda';
import * as Agenda from 'agenda';
import { RedisService } from 'nestjs-redis';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { PerformerService } from '../services';
export declare const CHECK_ONLINE_STATUS_SCHEDULE = "CHECK_ONLINE_STATUS_SCHEDULE";
export declare class PerformerTask {
    private readonly redisService;
    private readonly agendaService;
    private readonly socketUserService;
    private readonly performerService;
    constructor(redisService: RedisService, agendaService: AgendaService, socketUserService: SocketUserService, performerService: PerformerService);
    modelOnlineStatusHandler(job: Agenda.Job<any>, done: (err?: Error) => void): Promise<void>;
}
