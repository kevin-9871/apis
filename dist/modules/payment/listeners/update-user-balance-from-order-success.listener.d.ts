import { QueueEventService, QueueEvent } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { TokenPackageService } from 'src/modules/token-package/services';
export declare class UpdateUserBalanceFromOrderSuccessListener {
    private readonly queueEventService;
    private readonly userService;
    private readonly tokenService;
    private readonly logger;
    constructor(queueEventService: QueueEventService, userService: UserService, tokenService: TokenPackageService);
    handler(event: QueueEvent): Promise<void>;
}
