import { SearchRequest } from 'src/kernel';
export declare class PaymentInformationPayload {
    type: string;
}
export declare class AdminCreatePaymentInformationPayload {
    type: string;
    sourceId: string;
    sourceType: string;
}
export declare class AdminSearchPaymentInformationPayload extends SearchRequest {
    type: string;
    sourceId: string;
    sourceType: string;
}
