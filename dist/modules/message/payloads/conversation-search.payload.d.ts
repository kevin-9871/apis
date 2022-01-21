import { SearchRequest } from 'src/kernel/common';
export declare class ConversationSearchPayload extends SearchRequest {
    keyword: string;
    type: string;
}
