import { DataResponse } from 'src/kernel';
import { LanguageService } from '../services/language.service';
export declare class LanguageController {
    private readonly languageService;
    constructor(languageService: LanguageService);
    list(): DataResponse<any>;
}
