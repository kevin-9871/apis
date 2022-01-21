import { QueueEventService, QueueEvent } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { MailerService } from 'src/modules/mailer/services';
import { AuthService } from 'src/modules/auth/services';
import { ProductService } from '../services';
export declare class StockProductListener {
    private readonly authService;
    private readonly queueEventService;
    private readonly productService;
    private readonly fileService;
    private readonly mailService;
    constructor(authService: AuthService, queueEventService: QueueEventService, productService: ProductService, fileService: FileService, mailService: MailerService);
    handleStockProducts(event: QueueEvent): Promise<void>;
    sendDigitalProductLink(transaction: any, performer: any, user: any, fileId: any): Promise<void>;
}
