import { SearchRequest } from 'src/kernel/common';
export declare class VideoSearchRequest extends SearchRequest {
    performerId: string;
    status: string;
    isSaleVideo: boolean;
}
