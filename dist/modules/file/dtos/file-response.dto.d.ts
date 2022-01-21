import { ObjectId } from 'mongodb';
import { FileDto } from './file.dto';
export declare class FileResponseDto {
    _id?: string | ObjectId;
    url?: string;
    thumbnailUrl?: string;
    static fromFile(file: FileDto): FileResponseDto;
}
