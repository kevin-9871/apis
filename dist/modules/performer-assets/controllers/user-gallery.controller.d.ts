import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { GalleryService } from '../services/gallery.service';
import { GallerySearchRequest } from '../payloads';
export declare class UserGalleryController {
    private readonly galleryService;
    private readonly authService;
    constructor(galleryService: GalleryService, authService: AuthService);
    searchGallery(req: GallerySearchRequest, user: UserDto, request: any): Promise<any>;
    view(id: string, user: UserDto): Promise<any>;
}
