import { FileDto } from 'src/modules/file';
import { UserDto } from '../dtos';
import { UserService } from '../services';
export declare class AvatarController {
    private readonly userService;
    static avatarDir: string;
    constructor(userService: UserService);
    uploadAvatar(user: UserDto, file: FileDto): Promise<any>;
}
