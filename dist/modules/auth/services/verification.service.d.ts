import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { MailerService } from 'src/modules/mailer';
import { ConfigService } from 'nestjs-config';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { StudioService } from 'src/modules/studio/services';
import { VerificationModel } from '../models';
export declare class VerificationService {
    private readonly VerificationModel;
    private readonly mailService;
    private readonly config;
    private readonly userService;
    private readonly performerService;
    private readonly studioService;
    constructor(VerificationModel: Model<VerificationModel>, mailService: MailerService, config: ConfigService, userService: UserService, performerService: PerformerService, studioService: StudioService);
    sendVerificationEmail(sourceId: string | ObjectId, email: string, sourceType: string): Promise<void>;
    verifyEmail(token: string): Promise<void>;
}
