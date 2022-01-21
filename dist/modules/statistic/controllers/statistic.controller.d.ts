import { DataResponse } from 'src/kernel';
import { StatisticService } from '../services';
export declare class StatisticController {
    private readonly statisticService;
    constructor(statisticService: StatisticService);
    list(): Promise<DataResponse<any>>;
}
