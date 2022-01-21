import { HttpService, Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { CamAggregatorService } from './cam-aggregator.service';

@Injectable()
export class StripcashService {
  constructor(
    private httpService: HttpService
  ) {
  }

  public async listOnline(newOptions?: any): Promise<any> {
    const options = {
      limit: 0,
      offset: 0,
      userId: '106150bfbb9ac378aac92fb495c8ed29229e11b849b66525428d363cec90b9fd',
      ...(newOptions || {})
    };
    const models = await new Promise((resolve) => this.httpService
      .get(`https://go.alxbgo.com/api/models?${stringify(options)}`)
      .subscribe(
        (resp: any) => resolve(resp.data?.models || resp.data?.results || []),
        ({ response: resp, code }) => resolve([])
      )
    ) as any[];

    return models.map(model => {
      const country = CamAggregatorService.detectCountry(model.modelsCountry);
      return {
        id: model.username,
        avatar: model.avatarUrl || model.previewUrl,
        username: model.username,
        dateOfBirth: model.birthday,
        phone: null,
        isOnline: true,
        watching: null,
        gender: model.gender,
        isStreaming: true,
        isFavorite: false,
        socials: false,
        stats: {
          views: model.viewersCount,
          favorites: model.favoritedCount
        },
        lastStreamingTime: null,
        streamingStatus: model.status,
        streamingTitle: model.goalMessage,
        country: country?.code || null,
        countrFlag: country?.flag || null,
        city: null,
        state: null,
        zipcode: null,
        address: null,
        languages: model.languages,
        categoryIds: [],
        categories: [],
        service: 'stripcash',
        aboutMe: model.goalmessage || model.goalMessage,
        tags: model.tags,
        iframe: `https://lite-iframe.stripcdn.com/${model.username}?userId=${options.userId}`,
        profileLink: `https://go.gldrdr.com/?userId=${options.userId}&path=/cams/${model.username}`,
        age: model.age
      }
    });
  }
}
