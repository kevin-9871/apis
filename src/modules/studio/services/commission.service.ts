import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  PerformerCommissionDto,
  PerformerDto
} from 'src/modules/performer/dtos';
import { PerformerSearchPayload } from 'src/modules/performer/payloads';
import {
  PerformerCommissionService,
  PerformerSearchService,
  PerformerService
} from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings/services';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { Model } from 'mongoose';
import { merge } from 'lodash';
import { ObjectId } from 'mongodb';
import { EntityNotFoundException } from 'src/kernel';
import { StudioDto } from '../dtos';
import { UpdateCommissionPayload } from '../payloads';
import { STUDIO_MODEL_PROVIDER } from '../providers';
import { StudioModel } from '../models';

@Injectable()
export class StudioCommissionService {
  constructor(
    @Inject(forwardRef(() => PerformerCommissionService))
    private readonly performerCommissionService: PerformerCommissionService,
    @Inject(forwardRef(() => PerformerSearchService))
    private readonly performerSearchService: PerformerSearchService,
    private readonly settingService: SettingService,
    private readonly performerService: PerformerService,
    @Inject(STUDIO_MODEL_PROVIDER)
    private readonly studioModel: Model<StudioModel>
  ) {}

  async searchMemberCommissions(query: PerformerSearchPayload, user) {
    const { data, total } = await this.performerSearchService.search(
      query,
      user
    );

    const performerIds = data.map(p => p._id);
    const performerCommissions = performerIds.length
      ? await this.performerCommissionService.findByPerformerIds(performerIds)
      : [];

    const [
      defaultStudioCommission,
      defaultPerformerCommssion
    ] = await Promise.all([
      this.settingService.getKeyValue(SETTING_KEYS.STUDIO_COMMISSION),
      this.settingService.getKeyValue(SETTING_KEYS.PERFORMER_COMMISSION)
    ]);
    const performers = data.map(performer => {
      const commission = performerCommissions.find(
        c => c.performerId.toString() === performer._id.toString()
      );
      if (commission) {
        return {
          ...performer,
          commissionSetting: new PerformerCommissionDto(commission)
        };
      }

      return {
        ...performer,
        commissionSetting: {
          performerId: performer._id,
          tipCommission: defaultPerformerCommssion,
          albumCommission: defaultPerformerCommssion,
          groupCallCommission: defaultPerformerCommssion,
          privateCallCommission: defaultPerformerCommssion,
          productCommission: defaultPerformerCommssion,
          videoCommission: defaultPerformerCommssion,
          studioCommission: defaultStudioCommission,
          memberCommission: parseInt(process.env.COMMISSION_RATE, 10)
        }
      };
    });

    return {
      total,
      data: performers.map(d => new PerformerDto(d).toResponse(true))
    };
  }

  async studioUpdateMemberCommission(
    id: string,
    payload: UpdateCommissionPayload,
    studio: StudioDto
  ) {
    return this.performerCommissionService.studioUpdate(
      id,
      payload,
      studio._id
    );
  }

  async adminUpdateStudioCommission(
    studioId: string | ObjectId,
    payload: UpdateCommissionPayload
  ) {
    const studio = await this.studioModel.findOne({ _id: studioId });
    if (!studio) {
      throw new EntityNotFoundException();
    }

    merge(studio, payload);
    await studio.save();
    const [performers, defaultPerformerCommssion] = await Promise.all([
      this.performerService.find({ studioId }),
      this.settingService.getKeyValue(SETTING_KEYS.PERFORMER_COMMISSION)
    ]);
    const performerIds = performers.map(p => p._id);
    const commissions = await this.performerCommissionService.findByPerformerIds(
      performerIds
    );

    await Promise.all(
      performerIds.map(id => {
        const commission = commissions.find(
          c => c.performerId.toString() === id.toString()
        );
        if (!commission) {
          const data = {} as PerformerCommissionDto;
          data.performerId = id;
          data.tipCommission = defaultPerformerCommssion;
          data.privateCallCommission = defaultPerformerCommssion;
          data.groupCallCommission = defaultPerformerCommssion;
          data.productCommission = defaultPerformerCommssion;
          data.albumCommission = defaultPerformerCommssion;
          data.videoCommission = defaultPerformerCommssion;
          data.studioCommission = payload.commission;
          return this.performerCommissionService.create(id, data);
        }

        commission.studioCommission = payload.commission;
        return commission.save();
      })
    );

    return studio;
  }
}
