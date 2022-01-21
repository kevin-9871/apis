import { DataResponse } from 'src/kernel';
import { CountryService } from '../services/country.service';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    list(): DataResponse<any>;
}
