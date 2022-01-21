import { AgendaService } from 'src/kernel/infras/agenda';
import { AuthService } from 'src/modules/auth/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
export declare const DISCONENNCT_OFFLINE_SOCKET_ISCHEDULE = "DISCONENNCT_OFFLINE_SOCKET_ISCHEDULE";
export declare class SocketUserTask {
    private readonly authService;
    private readonly agendaService;
    private readonly socketUserService;
    constructor(authService: AuthService, agendaService: AgendaService, socketUserService: SocketUserService);
    handler(_: any, done: (err?: Error) => void): Promise<void>;
}
