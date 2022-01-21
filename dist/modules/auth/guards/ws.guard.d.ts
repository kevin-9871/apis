import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import { AuthService } from '../services';
export declare class WSGuard implements CanActivate {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
