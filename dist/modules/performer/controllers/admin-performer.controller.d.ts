import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { ConversationService } from 'src/modules/message/services';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { PerformerDto, IPerformerResponse } from '../dtos';
import { PerformerCreatePayload, AdminUpdatePayload, PerformerSearchPayload } from '../payloads';
import { PerformerService, PerformerSearchService } from '../services';
export declare class AdminPerformerController {
    private readonly performerService;
    private readonly performerSearchService;
    private readonly conversationService;
    private readonly socketUserService;
    private readonly authService;
    constructor(performerService: PerformerService, performerSearchService: PerformerSearchService, conversationService: ConversationService, socketUserService: SocketUserService, authService: AuthService);
    search(req: PerformerSearchPayload, currentUser: UserDto): Promise<DataResponse<PageableData<IPerformerResponse>>>;
    searchOnline(req: PerformerSearchPayload, currentUser: UserDto): Promise<DataResponse<PageableData<IPerformerResponse>>>;
    create(currentUser: UserDto, payload: PerformerCreatePayload): Promise<DataResponse<PerformerDto>>;
    updateUser(payload: AdminUpdatePayload, performerId: string, req: any): Promise<DataResponse<PerformerDto>>;
    getDetails(performerId: string, req: any): Promise<DataResponse<IPerformerResponse>>;
    uploadPerformerDocument(userId: string, file: FileDto): Promise<any>;
    uploadPerformerAvatar(file: FileDto): Promise<any>;
    exportCsv(query: PerformerSearchPayload, nameFile: string, res: any, user: UserDto): Promise<any>;
    stats(): Promise<DataResponse<{
        totalVideos: any;
        totalPhotos: any;
        totalGalleries: any;
        totalProducts: any;
        totalStreamTime: any;
        totalTokenEarned: any;
    }>>;
}
