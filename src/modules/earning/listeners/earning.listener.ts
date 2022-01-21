import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import {
  PURCHASED_ITEM_SUCCESS_CHANNEL,
  PURCHASE_ITEM_TYPE
} from 'src/modules/purchased-item/constants';
import { EVENT, ROLE } from 'src/kernel/constants';
import {
  PerformerCommissionService,
  PerformerService
} from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings';
import { PurchasedItemDto } from 'src/modules/purchased-item/dtos';
import { PAYMENT_STATUS } from '../../payment/constants';
import { SETTING_KEYS } from '../../settings/constants';
import { EarningDto } from '../dtos/earning.dto';
import { EARNING_MODEL_PROVIDER } from '../providers/earning.provider';
import { EarningModel } from '../models/earning.model';

const UPDATE_EARNING_CHANNEL = 'EARNING_CHANNEL';

@Injectable()
export class TransactionEarningListener {
  constructor(
    @Inject(EARNING_MODEL_PROVIDER)
    private readonly earningModel: Model<EarningModel>,
    private readonly queueEventService: QueueEventService,
    private readonly performerService: PerformerService,
    private readonly settingService: SettingService,
    private readonly performerCommission: PerformerCommissionService
  ) {
    this.queueEventService.subscribe(
      PURCHASED_ITEM_SUCCESS_CHANNEL,
      UPDATE_EARNING_CHANNEL,
      this.handleListenEarning.bind(this)
    );
  }

  public async handleListenEarning(event: QueueEvent) {
    try {
      const transaction = event.data as PurchasedItemDto;
      if (event.eventName !== EVENT.CREATED || transaction?.status !== PAYMENT_STATUS.SUCCESS) {
        return;
      }

      // just support performer item on this time
      const performerId = transaction.sellerId;
      const performer = await this.performerService.findById(performerId);
      if (!performer) {
        return;
      }

      let commission = 0;
      let studioCommision = 0;
      const [
        setting,
        defaultStudioCommission,
        performerCommission,
        conversionRate
      ] = await Promise.all([
        this.settingService.get(SETTING_KEYS.PERFORMER_COMMISSION),
        this.settingService.getKeyValue(SETTING_KEYS.STUDIO_COMMISSION),
        this.performerCommission.findOne({ performerId: performer._id }),
        this.settingService.getKeyValue(SETTING_KEYS.CONVERSION_RATE)
      ]);
      if (performer.studioId) {
        studioCommision = performerCommission
          && typeof performerCommission.studioCommission === 'number'
          ? performerCommission.studioCommission
          : defaultStudioCommission;
        commission = performerCommission
          && typeof performerCommission.memberCommission === 'number'
          ? performerCommission.memberCommission
          : parseInt(process.env.COMMISSION_RATE, 10);
        const newStudioEarning = {
          conversionRate:
            conversionRate || parseInt(process.env.CONVERSION_RATE, 10),
          grossPrice: transaction.totalPrice,
          commission: studioCommision,
          netPrice: transaction.totalPrice * (studioCommision / 100),
          performerId: transaction.sellerId,
          userId: transaction.sourceId,
          transactionTokenId: transaction._id,
          type: transaction.type,
          createdAt: transaction.createdAt,
          transactionStatus: transaction.status,
          sourceId: transaction.sellerId,
          source: ROLE.PERFORMER,
          target: ROLE.STUDIO,
          targetId: performer.studioId
        } as EarningDto;
        await this.earningModel.create(newStudioEarning);
      } else if (performerCommission) {
        switch (transaction.type) {
          case PURCHASE_ITEM_TYPE.GROUP:
            commission = performerCommission.groupCallCommission;
            break;
          case PURCHASE_ITEM_TYPE.PRIVATE:
            commission = performerCommission.privateCallCommission;
            break;
          case PURCHASE_ITEM_TYPE.TIP:
            commission = performerCommission.tipCommission;
            break;
          case PURCHASE_ITEM_TYPE.PRODUCT:
            commission = performerCommission.productCommission;
            break;
          case PURCHASE_ITEM_TYPE.PHOTO:
            commission = performerCommission.albumCommission;
            break;
          case PURCHASE_ITEM_TYPE.SALE_VIDEO:
            commission = performerCommission.videoCommission;
            break;
          default:
            break;
        }
      } else {
        commission = setting.getValue();
      }

      // Performer Earning
      const grossPrice = performer.studioId
        ? transaction.totalPrice * (studioCommision / 100)
        : transaction.totalPrice;
      const netPrice = grossPrice * (commission / 100);
      // eslint-disable-next-line new-cap
      const newEarning = new this.earningModel();
      newEarning.set(
        'conversionRate',
        conversionRate || parseInt(process.env.CONVERSION_RATE, 10)
      );
      newEarning.set('grossPrice', grossPrice);
      newEarning.set('commission', commission);
      newEarning.set('netPrice', netPrice);
      newEarning.set('performerId', transaction.sellerId);
      newEarning.set('userId', transaction.sourceId);
      newEarning.set('transactionTokenId', transaction._id);
      newEarning.set('type', transaction.type);
      newEarning.set('createdAt', transaction.createdAt);
      newEarning.set('transactionStatus', transaction.status);
      newEarning.set('sourceId', transaction.sourceId);
      newEarning.set('targetId', transaction.sellerId);
      newEarning.set('source', ROLE.USER);
      newEarning.set('target', ROLE.PERFORMER);
      await newEarning.save();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
}
