import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { RedisModule } from 'nestjs-redis';
import { AgendaModule, MongoDBModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { SettingModule } from '../settings/setting.module';
import { CamAggregatorController } from './controllers/cam-aggregator.controller';
import { camAggregatorProviders } from './providers';
import { BongacamsService } from './services/bongacams.service';
import { CamAggregatorService } from './services/cam-aggregator.service';
import { ChaturbateService } from './services/chaturbate.service';
import { StripcashService } from './services/stripcash.service';
import { XLoveCamService } from './services/xlovecam.service';

@Module({
  imports: [
    MongoDBModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      // useFactory: async (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService]
    }),
    AgendaModule.register(),
    HttpModule,
    SettingModule,
    AuthModule
  ],
  providers: [...camAggregatorProviders, XLoveCamService, ChaturbateService, BongacamsService, StripcashService, CamAggregatorService],
  controllers: [CamAggregatorController],
  exports: []
})
export class CamAggregatorModule {}
