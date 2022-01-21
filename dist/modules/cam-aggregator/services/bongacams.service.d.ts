import { HttpService } from '@nestjs/common';
export declare class BongacamsService {
    private httpService;
    constructor(httpService: HttpService);
    private getGender;
    listOnline(newOptions?: any): Promise<any>;
}
