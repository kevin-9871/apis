import { HttpService } from '@nestjs/common';
export declare class StripcashService {
    private httpService;
    constructor(httpService: HttpService);
    listOnline(newOptions?: any): Promise<any>;
}
