import { CamAggregatorService } from '../services/cam-aggregator.service';
export declare class CamAggregatorController {
    private readonly service;
    constructor(service: CamAggregatorService);
    onlineList(req: any): Promise<any>;
    getActiveCategories(): Promise<any>;
    getAllCategories(): Promise<any>;
    getCategory(id: string): Promise<any>;
    updateCategory(id: string, payload: any): Promise<any>;
    getDetails(key: string, username: string): Promise<any>;
    getDetails2(username: string): Promise<any>;
    getRelatedCams(username: string, query: any): Promise<any>;
}
