export interface IPostAuthor {
    _id?: any;
    name?: string;
    avatar?: string;
    roles?: string[];
}
export declare class PostDto {
    _id: any;
    authorId: any;
    author: IPostAuthor;
    type: string;
    title: string;
    slug: string;
    content: string;
    shortDescription: string;
    categoryIds: string[];
    status: string;
    meta: any[];
    image: any;
    updatedBy: any;
    createdBy: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PostDto>);
}
