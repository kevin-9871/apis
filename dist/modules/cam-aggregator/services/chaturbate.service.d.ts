import { HttpService } from '@nestjs/common';
export declare class ChaturbateService {
    private httpService;
    private hsetKey;
    constructor(httpService: HttpService);
    private getGender;
    listOnline(newOptions?: any): Promise<any>;
}
