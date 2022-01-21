export interface IConvertOptions {
    toPath?: string;
    size?: string;
}
export interface IConvertResponse {
    fileName: string;
    toPath: string;
}
export declare class VideoService {
    convert2Mp4(filePath: string, options?: IConvertOptions): Promise<IConvertResponse>;
    getDuration(filePath: string): Promise<number>;
    createThumbs(filePath: string, options: {
        toFolder: string;
        count?: number;
        size?: string;
    }): Promise<string[]>;
}
