import { HttpService, Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { CamAggregatorService } from './cam-aggregator.service';

@Injectable()
export class BongacamsService {
  constructor(
    private httpService: HttpService
  ) {
  }

  private getGender(gender: string) {
    const lowerCase = (gender || '').toLowerCase();
    if (lowerCase.includes('couple')) return 'couple';
    if (lowerCase.includes('transgender')) return 'transgender';
    if (lowerCase.includes('female')) return 'female';
    if (lowerCase.includes('male')) return 'male';

    return lowerCase;
  }

  public async listOnline(newOptions?: any): Promise<any> {
    const options = {
      type: 'api',
      api_type: 'json',
      c: '694510',
      api_v: '1',
      ...(newOptions || {})
    };
    const models = await new Promise((resolve) => this.httpService
      .get(`https://bngpt.com/promo.php?${stringify(options)}`)
      .subscribe(
        (resp: any) => resolve(resp.data || []),
        ({ response: resp, code }) => resolve([])
      )
    ) as any[];
    
    return models.map(model => {
      const country = CamAggregatorService.detectCountry(model.homecountry) || 
        CamAggregatorService.detectCountry(model.primary_language) ||
        CamAggregatorService.detectCountry(model.primary_language_key);
      return {
        id: model.username,
        avatar: model.profile_images?.profile_image,
        username: model.username,
        dateOfBirth: model.birthday,
        phone: null,
        isOnline: true,
        watching: null,
        gender: this.getGender(model.gender),
        isStreaming: true,
        isFavorite: false,
        socials: false,
        stats: {
          views: null,
          favorites: model.members_count
        },
        lastStreamingTime: null,
        streamingStatus: model.chat_status,
        streamingTitle: '',
        country: country?.code || null,
        countryFlag: country?.flag || null,
        city: null,
        state: null,
        zipcode: null,
        address: null,
        languages: [model.primary_language],
        categoryIds: [],
        categories: [],
        service: 'bongacams',
        aboutMe: '',
        tags: model.tags,
        iframe: model.embed_chat_url,
        profileLink: model.chat_url_on_home_page,
        age: model.display_age
      }
    });
  }
}
