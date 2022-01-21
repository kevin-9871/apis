import { Response, Request as Req } from 'express';
import { DataResponse, SearchRequest } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { PhotoService } from '../services';
import { PhotoSearchService } from '../services/photo-search.service';
export declare class UserPhotosController {
    private readonly photoSearchService;
    private readonly photoService;
    private readonly authService;
    constructor(photoSearchService: PhotoSearchService, photoService: PhotoService, authService: AuthService);
    list(id: string, req: SearchRequest, user: UserDto, request: any): Promise<DataResponse<import("src/kernel").PageableData<import("../dtos").PerformerPhotoResponse>>>;
    checkAuth(request: Req, response: Response): Promise<Response<any, Record<string, any>>>;
}
