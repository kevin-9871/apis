import { DynamicModule } from '@nestjs/common';
import * as Agenda from 'agenda';
import { AgendaModuleOptions, AgendaModuleAsyncOptions } from './interfaces';
export declare class AgendaService extends Agenda {
}
export declare class AgendaModule {
    static register(options?: AgendaModuleOptions): DynamicModule;
    static registerAsync(options: AgendaModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
