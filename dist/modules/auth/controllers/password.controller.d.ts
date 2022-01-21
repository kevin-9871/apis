import { Response } from 'express';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { StudioService } from 'src/modules/studio/services';
import { UserDto } from 'src/modules/user/dtos';
import { DataResponse } from 'src/kernel';
import { AuthService } from '../services';
import { PasswordChangePayload, PasswordUserChangePayload, ForgotPayload } from '../payloads';
export declare class PasswordController {
    private readonly userService;
    private readonly authService;
    private readonly performerService;
    private readonly studioService;
    constructor(userService: UserService, authService: AuthService, performerService: PerformerService, studioService: StudioService);
    updatePassword(user: UserDto, payload: PasswordChangePayload): Promise<DataResponse<boolean>>;
    updateUserPassword(payload: PasswordUserChangePayload, user: UserDto): Promise<DataResponse<boolean>>;
    forgotPassword(req: ForgotPayload): Promise<DataResponse<{
        success: boolean;
    }>>;
    renderUpdatePassword(res: Response, token: string): Promise<void>;
    updatePasswordForm(res: Response, token: string, password: string): Promise<void>;
}
