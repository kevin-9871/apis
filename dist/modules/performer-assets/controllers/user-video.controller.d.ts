import { Response, Request as Req } from 'express';
import { DataResponse } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';
export declare class UserVideosController {
    private readonly videoService;
    private readonly videoSearchService;
    private readonly authService;
    constructor(videoService: VideoService, videoSearchService: VideoSearchService, authService: AuthService);
    search(req: VideoSearchRequest, user: UserDto, request: any): Promise<DataResponse<import("src/kernel").PageableData<import("../dtos").VideoDto>>>;
    details(id: string, user: UserDto, req: any): Promise<DataResponse<import("../dtos").VideoDto>>;
    view(id: string): Promise<DataResponse<{
        ok: number;
        n: number;
        nModified: number;
    }>>;
    checkAuth(request: Req, response: Response): Promise<Response<any, Record<string, any>>>;
}
