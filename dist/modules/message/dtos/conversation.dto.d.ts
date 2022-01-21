import { ObjectId } from 'mongodb';
import { IUserResponse } from 'src/modules/user/dtos';
import { IPerformerResponse } from 'src/modules/performer/dtos';
import { IRecipient } from '../models';
export declare class ConversationDto {
    _id: ObjectId;
    type: string;
    name: string;
    recipients: IRecipient[];
    lastMessage: string;
    lastSenderId: string | ObjectId;
    lastMessageCreatedAt: Date;
    meta: any;
    streamId: string | ObjectId;
    createdAt: Date;
    updatedAt: Date;
    recipientInfo?: IUserResponse | IPerformerResponse;
    totalNotSeenMessages?: number;
    performerId?: string | ObjectId;
    constructor(data?: Partial<ConversationDto>);
    serializeConversation(): string;
}
