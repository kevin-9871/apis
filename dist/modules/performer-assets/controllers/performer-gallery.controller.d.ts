import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { GalleryCreatePayload, GallerySearchRequest } from '../payloads';
import { GalleryService } from '../services/gallery.service';
import { GalleryUpdatePayload } from '../payloads/gallery-update.payload';
export declare class PerformerGalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    createGallery(payload: GalleryCreatePayload, creator: UserDto): Promise<any>;
    updateGallery(id: string, payload: GalleryUpdatePayload, creator: UserDto): Promise<any>;
    searchGallery(req: GallerySearchRequest, user: UserDto, request: any): Promise<any>;
    view(id: string, user: UserDto): Promise<any>;
    delete(id: string): Promise<DataResponse<boolean>>;
}
