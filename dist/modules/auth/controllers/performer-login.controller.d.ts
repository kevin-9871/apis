import { DataResponse } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { LoginByUsernamePayload, LoginByEmailPayload } from '../payloads';
import { AuthService } from '../services';
export declare class PerformerLoginController {
    private readonly performerService;
    private readonly authService;
    constructor(performerService: PerformerService, authService: AuthService);
    loginByUsername(req: LoginByUsernamePayload): Promise<DataResponse<{
        token: string;
    }>>;
    loginByEmail(req: LoginByEmailPayload): Promise<DataResponse<{
        token: string;
    }>>;
}
