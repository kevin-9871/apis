import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { LoginByEmailPayload, LoginByUsernamePayload } from '../payloads';
import { AuthService } from '../services';
export declare class LoginController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    loginByEmail(req: LoginByEmailPayload): Promise<DataResponse<{
        token: string;
    }>>;
    loginByUsername(req: LoginByUsernamePayload): Promise<DataResponse<{
        token: string;
    }>>;
}
