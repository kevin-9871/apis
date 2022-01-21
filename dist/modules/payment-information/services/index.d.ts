import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PageableData } from 'src/kernel';
import { StudioService } from 'src/modules/studio/services';
import { PerformerService } from 'src/modules/performer/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PaymentInformationModel } from '../models';
import { PaymentInformationPayload, AdminCreatePaymentInformationPayload, AdminSearchPaymentInformationPayload } from '../payloads';
export declare class PaymentInformationService {
    private readonly paymentInformationModel;
    private readonly studioService;
    private readonly performerService;
    constructor(paymentInformationModel: Model<PaymentInformationModel>, studioService: StudioService, performerService: PerformerService);
    findById(id: string | ObjectId): Promise<PaymentInformationModel>;
    create(payload: PaymentInformationPayload, user: any): Promise<import("mongoose").LeanDocument<PaymentInformationModel>>;
    detail(payload: PaymentInformationPayload, sourceId: string | ObjectId): Promise<PaymentInformationModel>;
    adminDetail(id: string | ObjectId): Promise<{
        sourceInfo: PerformerDto | import("../../studio/dtos").StudioDto;
        updatedAt: Date;
        _id: ObjectId;
        type: string;
        createdAt: Date;
        __v?: number;
        id?: any;
        sourceId: ObjectId;
        sourceType: string;
    }>;
    adminCreate(payload: AdminCreatePaymentInformationPayload): Promise<import("mongoose").LeanDocument<PaymentInformationModel>>;
    adminSearch(req: AdminSearchPaymentInformationPayload): Promise<PageableData<any>>;
}
