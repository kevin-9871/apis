import { FileDto } from 'src/modules/file';
import { UserService } from '../services';
export declare class AdminAvatarController {
    private readonly userService;
    static avatarDir: string;
    constructor(userService: UserService);
    uploadUserAvatar(userId: string, file: FileDto): Promise<any>;
}
