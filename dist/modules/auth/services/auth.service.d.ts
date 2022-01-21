import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { ConfigService } from 'nestjs-config';
import { StudioService } from 'src/modules/studio/services';
import { AuthCreateDto, AuthUpdateDto } from '../dtos';
import { AuthModel, ForgotModel } from '../models';
export declare class AuthService {
    private readonly AuthModel;
    private readonly ForgotModel;
    private readonly userService;
    private readonly performerService;
    private readonly mailService;
    private readonly config;
    private readonly studioService;
    constructor(AuthModel: Model<AuthModel>, ForgotModel: Model<ForgotModel>, userService: UserService, performerService: PerformerService, mailService: MailerService, config: ConfigService, studioService: StudioService);
    generateSalt(byteSize?: number): string;
    encryptPassword(pw: string, salt: string): string;
    create(data: AuthCreateDto): Promise<AuthModel>;
    changeNewKey(sourceId: any, type: any, newKey: any): Promise<AuthModel>;
    update(data: AuthUpdateDto): Promise<boolean>;
    findBySource(options: {
        source: string;
        sourceId?: ObjectId;
        type: string;
        key?: string;
    }): Promise<AuthModel | null>;
    verifyPassword(pw: string, auth: AuthModel): boolean;
    generateJWT(auth: any, options?: any): string;
    verifyJWT(token: string): string | false | object;
    decodeJWT(token: string): any;
    getSourceFromJWT(jwt: string): Promise<any>;
    forgot(auth: AuthModel, source: {
        _id: ObjectId;
        email: string;
    }): Promise<boolean>;
    getForgot(token: string): Promise<ForgotModel>;
}
