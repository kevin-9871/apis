import { Request as Req } from 'express';
import { AuthService } from 'src/modules/auth/services';
import { DataResponse } from 'src/kernel';
import { UserService } from '../services';
import { UserDto, IUserResponse } from '../dtos';
import { UserUpdatePayload } from '../payloads';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    me(request: Req): Promise<DataResponse<IUserResponse>>;
    updateMe(currentUser: UserDto, payload: UserUpdatePayload): Promise<DataResponse<IUserResponse>>;
    getShippingInfo(req: any): Promise<any>;
}
