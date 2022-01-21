import { DataResponse } from 'src/kernel';
import { PerformerSearchPayload } from 'src/modules/performer/payloads';
import { StudioDto } from '../dtos';
import { UpdateCommissionPayload } from '../payloads';
import { StudioCommissionService } from '../services/commission.service';
export declare class StudioCommissionController {
    private readonly studioCommissionService;
    constructor(studioCommissionService: StudioCommissionService);
    search(payload: PerformerSearchPayload, user: StudioDto): Promise<DataResponse<{
        total: number;
        data: Partial<import("../../performer/dtos").PerformerDto>[];
    }>>;
    updateMemberCommission(id: string, payload: UpdateCommissionPayload, studio: StudioDto): Promise<DataResponse<import("../../performer/dtos").PerformerCommissionDto>>;
    update(id: string, payload: UpdateCommissionPayload): Promise<DataResponse<import("../models").StudioModel>>;
}
