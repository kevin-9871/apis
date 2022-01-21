/// <reference types="node" />
import * as sharp from 'sharp';
export declare class ImageService {
    createThumbnail(filePath: string, options?: {
        width?: number;
        height?: number;
        toPath?: string;
    }): Promise<Buffer | sharp.OutputInfo>;
    getMetaData(filePath: string): Promise<sharp.Metadata>;
    replaceWithoutExif(filePath: string): Promise<Buffer>;
}
