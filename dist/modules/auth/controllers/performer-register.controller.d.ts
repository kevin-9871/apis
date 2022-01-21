import { DataResponse } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { PerformerRegisterPayload } from '../payloads';
import { VerificationService, AuthService } from '../services';
export declare class PerformerRegisterController {
    private readonly performerService;
    private readonly authService;
    private readonly verificationService;
    private readonly fileService;
    constructor(performerService: PerformerService, authService: AuthService, verificationService: VerificationService, fileService: FileService);
    performerRegister(payload: PerformerRegisterPayload, files: Record<string, FileDto>): Promise<DataResponse<{
        message: string;
    }>>;
}
