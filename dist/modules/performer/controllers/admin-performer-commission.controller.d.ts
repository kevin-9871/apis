import { DataResponse } from 'src/kernel';
import { ObjectId } from 'mongodb';
import { PerformerCommissionPayload } from '../payloads';
import { PerformerCommissionDto } from '../dtos';
import { PerformerCommissionService } from '../services/performer-commission.service';
export declare class AdminPerformerCommissionController {
    private readonly performerCommissionService;
    constructor(performerCommissionService: PerformerCommissionService);
    update(performerId: ObjectId, payload: PerformerCommissionPayload): Promise<DataResponse<PerformerCommissionDto>>;
}
