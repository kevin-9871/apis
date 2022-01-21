import { DataResponse } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { StreamService } from '../services/stream.service';
import { StreamPayload, TokenCreatePayload } from '../payloads';
import { Webhook } from '../dtos';
import { TokenResponse } from '../constant';
export declare class StreamController {
    private readonly streamService;
    constructor(streamService: StreamService);
    getSessionId(performer: PerformerDto, param: StreamPayload): Promise<DataResponse<string>>;
    getPerformerSessionId(params: StreamPayload): Promise<DataResponse<string>>;
    goLive(performer: PerformerDto): Promise<DataResponse<{
        conversation: import("../../message/models").ConversationModel;
        sessionId: any;
    }>>;
    join(performerId: string): Promise<DataResponse<{
        sessionId: any;
    }>>;
    requestPrivateChat(performerId: string, user: UserDto): Promise<DataResponse<any>>;
    accpetPrivateChat(id: string, performer: PerformerDto): Promise<DataResponse<any>>;
    joinGroupChat(id: string, user: UserDto): Promise<DataResponse<any>>;
    startGroupChat(performer: PerformerDto): Promise<DataResponse<any>>;
    antmediaWebhook(payload: Webhook): Promise<DataResponse<unknown>>;
    getOneTimeToken(user: UserDto, payload: TokenCreatePayload): Promise<DataResponse<TokenResponse>>;
}
