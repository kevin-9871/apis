import { ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
export declare class HttpExceptionLogFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost): Promise<any>;
}
