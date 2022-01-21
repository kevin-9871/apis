import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AgendaService, EntityNotFoundException, StringHelper } from 'src/kernel';
import { uniq } from 'lodash';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { COUNTRIES } from 'src/modules/utils/constants';
import { XLoveCamService } from './xlovecam.service';
import { ChaturbateService } from './chaturbate.service';
import { AggregatorPerformerInfoModel } from '../models/aggregator-performer-info.model';
import { AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER, AGGREGATOR_TAG_MODEL_PROVIDER } from '../providers';
import { BongacamsService } from './bongacams.service';
import { StripcashService } from './stripcash.service';
import { AggregatorCategoryModel } from '../models/aggregator-category.model';

@Injectable()
export class CamAggregatorService {
  constructor(
    private readonly settingService: SettingService,
    private readonly xLoveCamService: XLoveCamService,
    private readonly chaturbateService: ChaturbateService,
    private readonly bongaCamsService: BongacamsService,
    private readonly stripcashService: StripcashService,
    private readonly agendaService: AgendaService,
    @Inject(AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER)
    private readonly aggregatorPerformerModel: Model<AggregatorPerformerInfoModel>,
    @Inject(AGGREGATOR_TAG_MODEL_PROVIDER)
    private readonly aggregatorCategoryModel: Model<AggregatorCategoryModel>
  ) {
    this.defineJobs();
  }

  private async defineJobs() {
    const collection = (this.agendaService as any)._collection;
    await collection.deleteMany({
      name: {
        $in: [
          'syncLovexCamsPerformerData',
          'syncBongaCamsPerformerData',
          'syncChaturbatePerformerData',
          'syncStripcashPerformerData'
        ]
      }
    });
    this.agendaService.define('syncLovexCamsPerformerData', this.syncXLoveCamsModels.bind(this));
    this.agendaService.schedule('10 seconds from now', 'syncLovexCamsPerformerData', {});

    this.agendaService.define('syncBongaCamsPerformerData', this.syncBongaCamsModels.bind(this));
    this.agendaService.schedule('10 seconds from now', 'syncBongaCamsPerformerData', {});

    this.agendaService.define('syncChaturbatePerformerData', this.syncChaturbateModels.bind(this));
    this.agendaService.schedule('10 seconds from now', 'syncChaturbatePerformerData', {});

    this.agendaService.define('syncStripcashPerformerData', this.syncStripcashodels.bind(this));
    this.agendaService.schedule('10 seconds from now', 'syncStripcashPerformerData', {});
  }

  public static detectCountry(text: string) {
    // detect name, code, language or text include in the name
    if (!text) return null;
    let lowerCase = text.toLocaleLowerCase();
    if (lowerCase === 'english') lowerCase = 'us';
    return COUNTRIES.find(country => {
      const cName = country.name.toLowerCase();
      const cName2 = country.code?.toLowerCase() || '';
      const lName = country.language?.name?.toLowerCase() || '';
      const lName2 = country.language?.code?.toLowerCase() || '';
      if ([cName, cName2, lName, lName2].includes(lowerCase)) {
        return true;
      }
      // detect in language
      // otherwise detect if split name by special chars?
      let others = [];
      if (text.includes('-')) {
        others = text.split('-');
      } else if (text.includes(';')) {
        others = text.split(';');
      } else if (text.includes(',')) {
        others = text.split(',');
      } else {
        return false;
      }
      if (!others.length) return false;
      let i = others.length - 1;
      while (i >= 0) {
        if (others[i] &&
          [cName, cName2, lName, lName2].includes(others[i].toLowerCase().trim())) {
          return true;
        }
        i -= 1;
      }

      return false;
    });
  }

  public async getCategories(query = {}) {
    return this.aggregatorCategoryModel.find(query);
  }

  public async getCategory(id: string) {
    const category = await this.aggregatorCategoryModel.findOne({ _id: id });
    if (!category) throw new EntityNotFoundException();

    return category;
  }

  public async updateCategory(id: string, payload: any) {
    const category = await this.aggregatorCategoryModel.findOne({ _id: id });
    if (!category) throw new EntityNotFoundException();

    if (payload.tags) category.tags = payload.tags;
    if (payload.active !== null) category.active = payload.active;
    if (payload.name) category.name = payload.name;
    // eslint-disable-next-line no-useless-escape
    if (payload.alias) category.alias = payload.alias.replace(/["~!@#$%^&*\(\)_+=`{}\[\]\|\\:;'<>,.\/?"\- \t\r\n]+/g, '-');
    await category.save();

    return category;
  }

  public async listOnline(options?: any): Promise<any> {
    const [
      xlovecam,
      bongacams,
      stripcash,
      chaturbate
    ] = await Promise.all([
      this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_XLOVECAM_ENABLED),
      this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_BONGACAMS_ENABLED),
      this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_STRIPCASH_ENABLED),
      this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_CHATURBATE_ENABLED)
    ]);

    const inServices = [];
    if (xlovecam) inServices.push('xlovecam');
    if (bongacams) inServices.push('bongacams');
    if (stripcash) inServices.push('stripcash');
    if (chaturbate) inServices.push('chaturbate');
    if (!inServices.length) return {
      data: [],
      count: 0
    };

    const { limit = 60, offset = 0, category = null, gender = null, tag = null, q = null, country = null } = options;
    const query = {
      isOnline: true,
      service: {
        $in: inServices
      }
    } as any;
    const sort = { 
      // isOnline: -1,
      updatedAt: -1
    };
    if (category !==null && category.length >0 ) {
      const cat = await this.aggregatorCategoryModel.findOne({ alias: category });
      if (cat) {
        query.tags = {
          $in: cat.tags
        }
      }
    }
    if (gender && gender.length > 0) {
      query.gender = gender;
    }
    if (tag && tag.length > 0) {
      query.tags = tag;
    }
    if (country && country.length > 0) {
      query.country = country.toUpperCase();
    }
    if (q) {
      query.$or = [{
        username: {
          $regex: q,
          $options: 'i'
        }
      }, {
        tags: q
      }];

      // allow to search offline model
      delete query.isOnline;
    }
    const [data, count] = await Promise.all([
      this.aggregatorPerformerModel
        .find(query)
        .limit(parseInt(limit, 10))
        .skip(parseInt(offset, 10))
        .sort(sort),
      this.aggregatorPerformerModel.countDocuments(query)
    ]);

    return {
      data,
      count
    }
  }

  public async getDetails(key: string, username: string) {
    // x - xlovecam
    // b - bongacams
    // s - stripcash
    // c - chaturbate
    const query = { username } as any;
    switch (key) {
      case 'x': case 'xlovecam':
        query.service = 'xlovecam';
        break;
      case 'b': case 'bongacams':
        query.service = 'bongacams';
        break;
      case 's': case 'stripcash':
        query.service = 'stripcash';
        break;
      case 'c': case 'chaturbate':
        query.service = 'chaturbate';
        break;
      default: break;
    }

    const detail = await this.aggregatorPerformerModel.findOne(query);

    if (detail.service === 'chaturbate' && !detail.iframe?.includes(`https://chaturbate.com/embed/${detail.username}`)) {
      const [
        campaign,
        tour
      ] = await Promise.all([
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_CHATURBATE_CAMPAIGN),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_CHATURBATE_TOUR)
      ]);
      detail.iframe = `https://chaturbate.com/embed/${detail.username}/?join_overlay=1&campaign=${campaign}&disable_sound=0&bgcolor=white%27&tour=${tour}&amp=&room=${detail.username}`;
    }
    return detail;
  }

  public async getRelatedCams(username: string, options?: any) {
    const limit = options?.limit || 20;
    const aggregate = this.aggregatorPerformerModel
      .aggregate([{
        $match: {
          isOnline: true,
          username: {
            $ne: username
          }
        }
      }, {
        $sample: {
          size: limit
        }
      }]);
    if (!aggregate) return [];
    return aggregate;
  }

  private async syncXLoveCamsModels(job) {
    try {
      const [xLoveCamEnabled, authItemId, authSecret, authServiceId] = await Promise.all([
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_XLOVECAM_ENABLED),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_XLOVECAM_AUTH_ITEM_ID),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_XLOVECAM_AUTH_SECRET),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_XLOVECAM_AUTH_SERVICE_ID)
      ])
      if (!xLoveCamEnabled || !authItemId || !authSecret) throw new Error('Missing config!');

      const onlineModelUsernames = [];
      for (let offset = 0; offset <= 190; offset += 10) {
        // eslint-disable-next-line no-await-in-loop
        const onlineModels = await this.xLoveCamService.listOnline({
          offset,
          authItemId,
          authSecret,
          authServiceId
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const model of onlineModels) {
          // eslint-disable-next-line no-await-in-loop
          await this.aggregatorPerformerModel.updateOne({
            service: model.service,
            username: model.username
          }, model, {
            upsert: true
          });
          onlineModelUsernames.push(model.username);
        }
      }
      await this.aggregatorPerformerModel.updateMany({
        username: {
          $nin: onlineModelUsernames
        },
        service: 'xlovecam'
      }, {
        isStreaming: false,
        isOnline: false
      });
    // eslint-disable-next-line no-empty
    } catch (e) {  
    } finally {
      job.remove();
      this.agendaService.schedule('5 minutes from now', 'syncLovexCamsPerformerData', {});
    }
  }

  private async syncBongaCamsModels(job) {
    try {
      const [bongacamsEnabled, bongacamsC] = await Promise.all([
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_BONGACAMS_ENABLED),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_BONGACAMS_C)
      ])
      if (!bongacamsEnabled || !bongacamsC) throw new Error('Missing config!');

      const onlineModelUsernames = [];
      const onlineModels = await this.bongaCamsService.listOnline({
        c: bongacamsC
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const model of onlineModels) {
        // eslint-disable-next-line no-await-in-loop
        await this.aggregatorPerformerModel.updateOne({
          service: model.service,
          username: model.username
        }, model, {
          upsert: true
        });
        onlineModelUsernames.push(model.username);
      }
      await this.aggregatorPerformerModel.updateMany({
        username: {
          $nin: onlineModelUsernames
        },
        service: 'bongacams'
      }, {
        isStreaming: false,
        isOnline: false
      });
    // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      job.remove();
      this.agendaService.schedule('5 minutes from now', 'syncBongaCamsPerformerData', {});
    }
  }

  private async syncChaturbateModels(job) {
    try {
      const [chaturbateEnabled, campaign, tour] = await Promise.all([
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_CHATURBATE_ENABLED),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_CHATURBATE_CAMPAIGN),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_CHATURBATE_TOUR)
      ])
      if (!chaturbateEnabled || !campaign || !tour) throw new Error('Missing config!');

      const onlineModelUsernames = [];
      for (let offset = 0; offset <= 400; offset += 100) {
        // eslint-disable-next-line no-await-in-loop
        const onlineModels = await this.chaturbateService.listOnline({
          offset,
          campaign,
          tour
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const model of onlineModels) {
          // eslint-disable-next-line no-await-in-loop
          await this.aggregatorPerformerModel.updateOne({
            service: model.service,
            username: model.username
          }, model, {
            upsert: true
          });
          onlineModelUsernames.push(model.username);
        }
      }
      
      await this.aggregatorPerformerModel.updateMany({
        username: {
          $nin: onlineModelUsernames
        },
        service: 'chaturbate'
      }, {
        isStreaming: false,
        isOnline: false
      });
    // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      job.remove();
      this.agendaService.schedule('5 minutes from now', 'syncChaturbatePerformerData', {});
    }
  }

  private async syncStripcashodels(job) {
    try {
      const [stripcashEnabled, userId] = await Promise.all([
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_STRIPCASH_ENABLED),
        this.settingService.getKeyValue(SETTING_KEYS.CAM_AGG_STRIPCASH_USER_ID)
      ])
      if (!stripcashEnabled || !userId) throw new Error('Missing config!');

      const onlineModelUsernames = [];
      const onlineModels = await this.stripcashService.listOnline({
        userId
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const model of onlineModels) {
        // eslint-disable-next-line no-await-in-loop
        await this.aggregatorPerformerModel.updateOne({
          service: model.service,
          username: model.username
        }, model, {
          upsert: true
        });
        onlineModelUsernames.push(model.username);
      }
      
      await this.aggregatorPerformerModel.updateMany({
        username: {
          $nin: onlineModelUsernames
        },
        service: 'stripcash'
      }, {
        isStreaming: false,
        isOnline: false
      });
    // eslint-disable-next-line no-empty
    } catch (e) {
    } finally {
      job.remove();
      this.agendaService.schedule('5 minutes from now', 'syncStripcashPerformerData', {});
    }
  }

  // dont need this
  public async syncTags() {
    const aggregator = await this.aggregatorPerformerModel.aggregate([{
      $group: {
        _id: null,
        tagsArray: {
          $addToSet: '$tags'
        }
      }
    }]) as any;
    if (!aggregator) return;
    const tags = [];
    aggregator[0].tagsArray.forEach(tagItems => tags.push(...tagItems));
    const uniqueTags = uniq(tags).filter(tag => !!tag);
    if (!uniqueTags?.length) return;
    // create SEO tag and add to DB
    // eslint-disable-next-line no-restricted-syntax
    for (const tag of uniqueTags) {
      const alias = StringHelper.createAlias(tag);
      // eslint-disable-next-line no-await-in-loop
      const tagItem = await this.aggregatorCategoryModel.findOne({ alias });
      if (!tagItem) {
        // eslint-disable-next-line no-await-in-loop
        await this.aggregatorCategoryModel.create({
          name: tag,
          alias,
          tags: [tag]
        });
      }
    }
  }
}
