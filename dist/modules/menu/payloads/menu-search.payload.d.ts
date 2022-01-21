import { SearchRequest } from 'src/kernel/common';
export declare class MenuSearchRequestPayload extends SearchRequest {
    title?: string;
    public?: boolean;
    internal?: boolean;
    section: string;
}
