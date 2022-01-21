import { FilterQuery, Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { QueueEventService } from 'src/kernel';
import { ObjectId } from 'mongodb';
import { FileService } from 'src/modules/file/services';
import { FileDto } from 'src/modules/file';
import { UserService } from 'src/modules/user/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { MemberSetActivePayload } from 'src/modules/studio/payloads';
import { PerformerBroadcastSetting } from '../payloads/performer-broadcast-setting.payload';
import { PerformerCommissionService } from './index';
import { PerformerDto } from '../dtos';
import { PerformerModel, BlockSettingModel, PerformerCommissionModel } from '../models';
import { PerformerCreatePayload, PerformerUpdatePayload, BlockSettingPayload, PerformerRegisterPayload, DefaultPricePayload } from '../payloads';
import { CategoryService } from './category.service';
export declare class PerformerService {
    private readonly performerModel;
    private readonly userService;
    private readonly queueEventService;
    private readonly categoryService;
    private readonly socketUserService;
    private readonly blockSettingModel;
    private readonly performerCommissionModel;
    private readonly fileService;
    private readonly performerCommissionService;
    constructor(performerModel: Model<PerformerModel>, userService: UserService, queueEventService: QueueEventService, categoryService: CategoryService, socketUserService: SocketUserService, blockSettingModel: Model<BlockSettingModel>, performerCommissionModel: Model<PerformerCommissionModel>, fileService: FileService, performerCommissionService: PerformerCommissionService);
    findOne(filter: FilterQuery<PerformerModel>): import("mongoose").Query<PerformerModel, PerformerModel>;
    findById(id: string | ObjectId): Promise<PerformerDto>;
    checkBlockedByIp(blockSettings: any, countryCode: string): Promise<boolean>;
    checkBlockedByPerformer(blockSettings: any, userId: string | ObjectId): Promise<boolean>;
    findByUsername(username: string, countryCode?: string, currentUser?: UserDto): Promise<PerformerDto>;
    findByEmail(email: string): Promise<PerformerDto>;
    find(condition?: {}): Promise<PerformerModel[]>;
    findByIds(ids: any): Promise<PerformerDto[]>;
    register(payload: Partial<PerformerRegisterPayload>): Promise<PerformerDto>;
    getDetails(id: string | ObjectId, jwtToken: string): Promise<PerformerDto>;
    create(payload: PerformerCreatePayload, user?: UserDto): Promise<PerformerDto>;
    adminUpdate(id: string | ObjectId, payload: PerformerUpdatePayload): Promise<any>;
    studioUpdate(id: string, payload: MemberSetActivePayload, studioId: ObjectId): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    update(id: string | ObjectId, payload: Partial<PerformerUpdatePayload>): Promise<any>;
    viewProfile(id: string | ObjectId): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    updateBlockSetting(performerId: ObjectId, payload: BlockSettingPayload): Promise<BlockSettingModel>;
    getBlockSetting(performerId: ObjectId): Promise<BlockSettingModel>;
    checkBlock(performerId: any, countryCode: any, user: any): Promise<any>;
    updateSteamingStatus(id: string | ObjectId, status: string): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    updateLastStreamingTime(id: string | ObjectId, streamTime: number): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    offline(id: string | ObjectId): Promise<void>;
    updateVerificationStatus(userId: string | ObjectId): Promise<any>;
    updateBalance(id: string | ObjectId, amount: number): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    updateStats(id: string | ObjectId, payload: Record<string, number>): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    goLive(id: string | ObjectId): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    setStreamingStatus(id: string | ObjectId, streamingStatus: string): Promise<void>;
    updateAvatar(performerId: ObjectId, file: FileDto): Promise<FileDto>;
    updateDefaultPrice(id: ObjectId, payload: DefaultPricePayload): Promise<any>;
    updateBroadcastSetting(id: string | ObjectId, payload: PerformerBroadcastSetting): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    selfSuspendAccount(performerId: string | ObjectId, performer: PerformerDto): Promise<any>;
    stats(): Promise<{
        totalVideos: any;
        totalPhotos: any;
        totalGalleries: any;
        totalProducts: any;
        totalStreamTime: any;
        totalTokenEarned: any;
    }>;
    totalOnlineTodayStat(studioId: string | ObjectId): Promise<any>;
    totalHoursOnlineStat(studioId: string | ObjectId): Promise<any>;
    checkAuthDocument(req: any, user: UserDto): Promise<boolean>;
}
