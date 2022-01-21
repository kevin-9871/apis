import { DataResponse } from 'src/kernel';
import { MailerService } from '../services';
import { EmailTemplateUpdatePayload } from '../payloads/email-template-update.payload';
export declare class MailerController {
    private readonly mailService;
    constructor(mailService: MailerService);
    verify(): Promise<DataResponse<any>>;
    update(payload: EmailTemplateUpdatePayload, id: string): Promise<DataResponse<any>>;
    getAll(): Promise<DataResponse<any>>;
    findOne(id: string): Promise<DataResponse<any>>;
}
