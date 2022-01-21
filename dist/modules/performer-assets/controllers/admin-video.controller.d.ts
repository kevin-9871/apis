import { DataResponse } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoService } from '../services/video.service';
import { VideoSearchRequest, VideoUpdatePayload } from '../payloads';
import { VideoSearchService } from '../services/video-search.service';
export declare class AdminPerformerVideosController {
    private readonly videoService;
    private readonly videoSearchService;
    constructor(videoService: VideoService, videoSearchService: VideoSearchService);
    uploadVideo(files: Record<string, any>, payload: VideoCreatePayload): Promise<any>;
    details(id: string, req: any): Promise<DataResponse<import("../dtos").VideoDto>>;
    search(req: VideoSearchRequest, request: any): Promise<DataResponse<import("src/kernel").PageableData<import("../dtos").VideoDto>>>;
    update(id: string, payload: VideoUpdatePayload, updater: PerformerDto, files: Record<string, any>): Promise<DataResponse<import("../dtos").VideoDto>>;
    remove(id: string): Promise<DataResponse<boolean>>;
}
