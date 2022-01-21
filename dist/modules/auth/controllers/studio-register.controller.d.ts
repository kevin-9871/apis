import { DataResponse } from 'src/kernel';
import { StudioService } from 'src/modules/studio/services';
import { StudioCreatePayload } from 'src/modules/studio/payloads';
import { FileDto } from 'src/modules/file';
import { VerificationService, AuthService } from '../services';
export declare class StudioRegisterController {
    private readonly studioService;
    private readonly authService;
    private readonly verificationService;
    constructor(studioService: StudioService, authService: AuthService, verificationService: VerificationService);
    register(payload: StudioCreatePayload, file: FileDto): Promise<DataResponse<{
        message: string;
    }>>;
}
