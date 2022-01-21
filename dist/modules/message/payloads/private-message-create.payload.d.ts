import { MessageCreatePayload } from './message-create.payload';
export declare class PrivateMessageCreatePayload extends MessageCreatePayload {
    recipientId: string;
    recipientType: string;
}
