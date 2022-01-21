import { Module, HttpModule } from '@nestjs/common';
import {
  CountryService,
  LanguageService,
  PhoneCodeService,
  TimeZonesService
} from './services';
import {
  CountryController,
  LanguageController,
  PhoneCodeController,
  TimezonesController
} from './controllers';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [
    CountryService,
    LanguageService,
    PhoneCodeService,
    TimeZonesService
  ],
  controllers: [
    CountryController,
    LanguageController,
    PhoneCodeController,
    TimezonesController
  ],
  exports: [
    CountryService
  ]
})
export class UtilsModule {}
