export declare class SearchRequest {
    q: string;
    limit: number | string;
    offset: number | string;
    sortBy: string;
    sort: string;
    constructor(options?: Partial<SearchRequest>);
}
