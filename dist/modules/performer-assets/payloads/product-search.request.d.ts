import { SearchRequest } from 'src/kernel/common';
export declare class ProductSearchRequest extends SearchRequest {
    performerId: string;
    status: string;
    publish: boolean;
    productId: string;
    type: string;
}
