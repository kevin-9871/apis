import { Model } from 'mongoose';
import { MailerService } from 'src/modules/mailer';
import { SettingService } from 'src/modules/settings';
import { EarningService } from 'src/modules/earning/services/earning.service';
import { StudioDto } from 'src/modules/studio/dtos';
import { StudioService } from 'src/modules/studio/services';
import { PerformerService } from 'src/modules/performer/services';
import { PaymentInformationService } from 'src/modules/payment-information/services';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
import { PayoutRequestCreatePayload, PayoutRequestSearchPayload } from '../payloads/payout-request.payload';
import { PayoutRequestModel } from '../models/payout-request.model';
export declare class StudioPayoutRequestService {
    private readonly payoutRequestModel;
    private readonly studioService;
    private readonly mailService;
    private readonly settingService;
    private readonly earningService;
    private readonly performerService;
    private readonly paymentInformationService;
    constructor(payoutRequestModel: Model<PayoutRequestModel>, studioService: StudioService, mailService: MailerService, settingService: SettingService, earningService: EarningService, performerService: PerformerService, paymentInformationService: PaymentInformationService);
    findById(id: any): Promise<any>;
    create(payload: PayoutRequestCreatePayload, user: StudioDto): Promise<PayoutRequestDto>;
    update(id: string, payload: PayoutRequestCreatePayload, studio: StudioDto): Promise<PayoutRequestDto>;
    details(id: string, user: StudioDto): Promise<PayoutRequestDto>;
    getRequestSource(request: PayoutRequestDto | PayoutRequestModel): Promise<any>;
    adminDetails(id: string): Promise<PayoutRequestDto>;
    performerRequest(req: PayoutRequestSearchPayload, studio: StudioDto): Promise<{
        total: number;
        data: PayoutRequestDto[];
    }>;
}
