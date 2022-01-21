import { PerformerService } from 'src/modules/performer/services';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { StudioDto } from '../dtos';
import { StudioUpdatePayload } from '../payloads';
import { StudioModel } from '../models';
export declare class StudioService {
    private readonly performerService;
    private readonly studioModel;
    private readonly fileService;
    private readonly queueEventService;
    constructor(performerService: PerformerService, studioModel: Model<StudioModel>, fileService: FileService, queueEventService: QueueEventService);
    findById(id: string | ObjectId): Promise<StudioDto>;
    find(condition?: {}): Promise<StudioModel[]>;
    findByIds(ids: string[] | ObjectId[]): Promise<StudioDto[]>;
    findByEmail(email: string): Promise<StudioModel>;
    register(payload: any): Promise<StudioDto>;
    update(id: string | ObjectId, payload: Partial<StudioUpdatePayload>): Promise<any>;
    updateStats(id: string | ObjectId, payload: Record<string, number>): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    uploadDocument(studio: StudioDto, fileId: ObjectId): Promise<boolean>;
    search(req: any): Promise<{
        data: import("mongoose").LeanDocument<StudioModel>[];
        total: number;
    }>;
    stats(id: string | ObjectId): Promise<{
        totalOnlineToday: any;
        totalHoursOnline: any;
        totalPerformer?: number;
        totalTokenEarned?: number;
        totalTokenSpent?: number;
    }>;
    detail(id: string | ObjectId, jwtToken: string): Promise<Partial<import("../dtos").IStudio>>;
    updateBalance(id: string | ObjectId, amount: number): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    updateVerificationStatus(userId: string | ObjectId): Promise<any>;
}
