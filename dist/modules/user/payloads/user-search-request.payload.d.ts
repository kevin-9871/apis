import { SearchRequest } from 'src/kernel/common';
export declare class UserSearchRequestPayload extends SearchRequest {
    name: string;
    q: string;
    role: string;
    gender: string;
    country: string;
    status: string;
}
