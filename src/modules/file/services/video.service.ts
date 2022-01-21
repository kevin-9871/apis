import * as Ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import { StringHelper } from 'src/kernel';
import { ConvertMp4ErrorException } from '../exceptions';

export interface IConvertOptions {
  toPath?: string;
  size?: string; // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#video-frame-size-options
}

export interface IConvertResponse {
  fileName: string;
  toPath: string;
}

export class VideoService {
  public async convert2Mp4(
    filePath: string,
    options = {} as IConvertOptions
  ): Promise<IConvertResponse> {
    try {
      const fileName = `${StringHelper.randomString(5)}_${StringHelper.getFileName(filePath, true)}.mp4`;
      const toPath = options.toPath || join(StringHelper.getFilePath(filePath), fileName);

      return new Promise((resolve, reject) => {
        const command = new Ffmpeg(filePath)
          // set target codec
          .videoCodec('libx264')
          // .addOption('-vf', 'scale=2*trunc(iw/2):-2')
          .outputOptions('-strict -2')
          .on('end', () => resolve({
            fileName,
            toPath
          }))
          .on('error', reject)
          .toFormat('mp4');

        if (options.size) {
          command.size(options.size);
        }
        // save to file
        command.save(toPath);
      });
    } catch (e) {
      throw new ConvertMp4ErrorException(e);
    }
  }

  public async getDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => Ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }

      return resolve(parseInt(metadata.format.duration, 10));
    }));
  }

  public async createThumbs(filePath: string, options: {
    toFolder: string;
    count?: number;
    size?: string;
  }): Promise<string[]> {
    let thumbs = [];
    return new Promise((resolve, reject) => new Ffmpeg(filePath)
      .on('filenames', (filenames) => {
        thumbs = filenames;
      })
      .on('end', () => resolve(thumbs))
      .on('error', reject)
      .screenshot({
        folder: options.toFolder,
        filename: `${StringHelper.randomString(5)}-%s.png`,
        count: options.count || 3,
        size: options.size || '320x240'
      }));
  }
}
