import { DataResponse } from 'src/kernel';
import { CurrencyCodeService } from '../services';
export declare class CurrecyCodeController {
    private readonly currencyCodeService;
    constructor(currencyCodeService: CurrencyCodeService);
    list(): DataResponse<{
        [key: string]: any;
    }[]>;
}
