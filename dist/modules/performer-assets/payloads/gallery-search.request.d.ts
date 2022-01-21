import { SearchRequest } from 'src/kernel/common';
export declare class GallerySearchRequest extends SearchRequest {
    performerId: string;
    status: string;
    isSale: boolean;
}
