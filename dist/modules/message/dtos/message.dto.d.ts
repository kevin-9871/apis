import { ObjectId } from 'mongodb';
export declare class MessageDto {
    _id: ObjectId;
    conversationId: ObjectId;
    type: string;
    fileId: ObjectId;
    text: string;
    senderId: ObjectId;
    meta: any;
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
    senderInfo?: any;
    constructor(data?: Partial<MessageDto>);
}
