import { NestInterceptor, Type } from '@nestjs/common';
import { IFileUploadOptions } from '../lib';
export interface IMultiFileUpload {
    type: string;
    fieldName: string;
    options: IFileUploadOptions;
}
export declare function MultiFileUploadInterceptor(data: IMultiFileUpload[], opts?: any): Type<NestInterceptor<any, any>>;
