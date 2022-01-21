import { DataResponse } from 'src/kernel';
import { Response } from 'express';
import { SettingService } from 'src/modules/settings';
import { ResendVerificationEmailPaload } from '../payloads';
import { AuthService, VerificationService } from '../services';
export declare class VerifycationController {
    private readonly verificationService;
    private readonly authService;
    private readonly settingService;
    constructor(verificationService: VerificationService, authService: AuthService, settingService: SettingService);
    resendVerificationEmail(payload: ResendVerificationEmailPaload): Promise<DataResponse<{
        success: boolean;
    }>>;
    verifyEmail(res: Response, token: string): Promise<void>;
}
