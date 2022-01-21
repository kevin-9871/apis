import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PURCHASED_ITEM_SUCCESS_CHANNEL } from 'src/modules/purchased-item/constants';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { EVENT } from 'src/kernel/constants';
import { MailerService } from 'src/modules/mailer/services';
import { AuthService } from 'src/modules/auth/services';
import { pick } from 'lodash';
import { PURCHASE_ITEM_TYPE } from '../../purchased-item/constants';
import { ProductService } from '../services';
import { PRODUCT_TYPE } from '../constants';

const UPDATE_STOCK_CHANNEL = 'UPDATE_STOCK_CHANNEL';

@Injectable()
export class StockProductListener {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly queueEventService: QueueEventService,
    private readonly productService: ProductService,
    private readonly fileService: FileService,
    private readonly mailService: MailerService
  ) {
    this.queueEventService.subscribe(
      PURCHASED_ITEM_SUCCESS_CHANNEL,
      UPDATE_STOCK_CHANNEL,
      this.handleStockProducts.bind(this)
    );
  }

  public async handleStockProducts(event: QueueEvent) {
    const transaction = event.data;
    if (![EVENT.CREATED].includes(event.eventName) || transaction?.type !== PURCHASE_ITEM_TYPE.PRODUCT) {
      return;
    }

    const product = await this.productService.findById(transaction.targetId);
    if (product?.type !== PRODUCT_TYPE.PHYSICAL) return;
    await this.productService.updateStock(transaction.targetId, -1);
    // TODO - fix for digital product link
  }

  public async sendDigitalProductLink(transaction, performer, user, fileId) {
    const auth = await this.authService.findBySource({ source: 'user', type: 'email' ,sourceId: transaction.sourceId }) || await this.authService.findBySource({ source: 'user', type: 'username' ,sourceId: transaction.sourceId })
    const jwToken = this.authService.generateJWT(pick(auth, ['_id', 'source', 'sourceId']), { expiresIn: 3 * 60 * 60 }); // 3hours expiration
    const file = await this.fileService.findById(fileId);
    if (file) {
      const digitalLink = jwToken ? `${new FileDto(file).getUrl()}?productId=${transaction.targetId}&token=${jwToken}` : `${new FileDto(file).getUrl()}?productId=${transaction.targetId}`;
      await this.mailService.send({
        subject: 'Digital file',
        to: user.email,
        data: {
          performer,
          user,
          transaction,
          digitalLink
        },
        template: 'send-user-digital-product'
      });
    }
  }
}
