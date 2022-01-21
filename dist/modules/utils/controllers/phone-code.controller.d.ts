import { DataResponse } from 'src/kernel';
import { PhoneCodeService } from '../services/phone-code.service';
export declare class PhoneCodeController {
    private readonly phoneCodeService;
    constructor(phoneCodeService: PhoneCodeService);
    list(): DataResponse<any>;
}
