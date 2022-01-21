import { FileService } from '../services';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    downloadFile(response: any, key: string): Promise<any>;
}
