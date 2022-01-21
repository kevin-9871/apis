import { Injectable } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { EarningService } from 'src/modules/earning/services/earning.service';
import { StudioService } from 'src/modules/studio/services';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
import {
  PAYOT_REQUEST_CHANEL,
  PAYOUT_REQUEST_EVENT,
  STATUES
} from '../constants';

const PAYOUT_REQUEST_UPDATE = 'PAYOUT_REQUEST_UPDATE';

@Injectable()
export class UpdatePayoutRequestListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    private readonly mailService: MailerService,
    private readonly earningService: EarningService,
    private readonly performerService: PerformerService,
    private readonly studioService: StudioService
  ) {
    this.queueEventService.subscribe(
      PAYOT_REQUEST_CHANEL,
      PAYOUT_REQUEST_UPDATE,
      this.handler.bind(this)
    );
  }

  async handler(event: QueueEvent) {
    try {
      const request = event.data.request as PayoutRequestDto;
      const { status, sourceId, sourceType } = request;
      if (event.eventName === PAYOUT_REQUEST_EVENT.UPDATED) {
        const source = sourceType === 'performer'
          ? await this.performerService.findById(sourceId)
          : await this.studioService.findById(sourceId);
        if (!source) {
          return;
        }

        if (
          status === STATUES.APPROVED
          && event.data.oldStatus === STATUES.PENDING
        ) {
          const payload = {
            targetId: sourceId,
            fromDate: request.fromDate,
            toDate: request.toDate
          };
          await this.earningService.updatePaidStatus(payload);
        }

        if (source.email) {
          await this.mailService.send({
            subject: 'Update payout request',
            to: source.email,
            data: { request },
            template: 'payout-request-update'
          });
        }
      }
    } catch (err) {
      // TODO - log me
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }
}
