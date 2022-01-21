import { ObjectId } from 'mongodb';
import { PostMetaPayload } from './post-meta.payload';
export declare class PostCreatePayload {
    title: string;
    authorId: string | ObjectId;
    type: string;
    slug?: string;
    content: string;
    shortDescription: string;
    categoryIds?: string[];
    status: string;
    image?: string;
    meta?: PostMetaPayload[];
}
