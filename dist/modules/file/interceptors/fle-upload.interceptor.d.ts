import { NestInterceptor, Type } from '@nestjs/common';
import { IFileUploadOptions } from '../lib';
export declare function FileUploadInterceptor(type?: string, fieldName?: string, options?: IFileUploadOptions): Type<NestInterceptor<any, any>>;
