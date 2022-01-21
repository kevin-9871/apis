import { PageableData } from 'src/kernel/common';
import { DataResponse } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserSearchRequestPayload, UserAuthCreatePayload, UserAuthUpdatePayload } from '../payloads';
import { IUserResponse } from '../dtos';
import { UserService, UserSearchService } from '../services';
export declare class AdminUserController {
    private readonly userService;
    private readonly userSearchService;
    private readonly authService;
    constructor(userService: UserService, userSearchService: UserSearchService, authService: AuthService);
    search(req: UserSearchRequestPayload): Promise<DataResponse<PageableData<IUserResponse>>>;
    createUser(payload: UserAuthCreatePayload): Promise<DataResponse<IUserResponse>>;
    updateUser(payload: UserAuthUpdatePayload, userId: string): Promise<DataResponse<IUserResponse>>;
    getDetails(id: string): Promise<DataResponse<IUserResponse>>;
    exportCsv(query: UserSearchRequestPayload, nameFile: string, res: any): Promise<any>;
    stats(): Promise<DataResponse<{
        totalViewTime: any;
        totalTokenSpent: any;
    }>>;
}
