import { DataResponse } from 'src/kernel';
import { StudioService } from 'src/modules/studio/services';
import { LoginByEmailPayload } from '../payloads';
import { AuthService } from '../services';
export declare class StudioLoginController {
    private readonly studoService;
    private readonly authService;
    constructor(studoService: StudioService, authService: AuthService);
    loginByEmail(req: LoginByEmailPayload): Promise<DataResponse<{
        token: string;
    }>>;
}
