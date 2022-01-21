import { HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
export declare class CountryService {
    private httpService;
    constructor(httpService: HttpService);
    private countryList;
    getList(): any;
    findCountryByIP(ip: string): Promise<AxiosResponse<any>>;
}
