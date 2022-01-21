import { DataResponse } from 'src/kernel';
import { TimeZonesService } from '../services/timezones.service';
export declare class TimezonesController {
    private readonly timezonesService;
    constructor(timezonesService: TimeZonesService);
    list(): DataResponse<any>;
}
