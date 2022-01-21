import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { StudioService } from 'src/modules/studio/services';
import { ObjectId } from 'mongodb';
import { EarningModel } from '../models/earning.model';
import { EarningSearchRequestPayload, UpdateEarningStatusPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
import { EarningDto, IEarning, IEarningStatResponse } from '../dtos/earning.dto';
import { PerformerDto } from '../../performer/dtos';
import { PurchaseItemService } from '../../purchased-item/services';
export declare class EarningService {
    private readonly earningModel;
    private readonly userService;
    private readonly performerService;
    private readonly studioService;
    private readonly paymentService;
    constructor(earningModel: Model<EarningModel>, userService: UserService, performerService: PerformerService, studioService: StudioService, paymentService: PurchaseItemService);
    search(req: EarningSearchRequestPayload, user?: UserDto): Promise<PageableData<IEarning>>;
    getInfo(id: string | ObjectId, role: string): Promise<PerformerDto | import("../../user/models").UserModel | import("../../studio/dtos").StudioDto>;
    details(id: string): Promise<EarningDto>;
    adminStats(req: EarningSearchRequestPayload): Promise<IEarningStatResponse>;
    stats(req: EarningSearchRequestPayload): Promise<IEarningStatResponse>;
    calculatePayoutRequestStats(q: any): Promise<{
        totalPrice: any;
        paidPrice: any;
        remainingPrice: any;
    }>;
    updatePaidStatus(payload: UpdateEarningStatusPayload): Promise<any>;
}
