"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = exports.DELETE_FILE_TYPE = exports.FILE_EVENT = exports.MEDIA_FILE_CHANNEL = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const nestjs_config_1 = require("nestjs-config");
const kernel_1 = require("../../../kernel");
const fs_1 = require("fs");
const jwt = require("jsonwebtoken");
const path_1 = require("path");
const dtos_1 = require("../../performer-assets/dtos");
const dtos_2 = require("../../banner/dtos");
const providers_1 = require("../providers");
const dtos_3 = require("../dtos");
const image_service_1 = require("./image.service");
const video_service_1 = require("./video.service");
const no_file_exception_1 = require("../exceptions/no-file.exception");
const VIDEO_QUEUE_CHANNEL = 'VIDEO_PROCESS';
const PHOTO_QUEUE_CHANNEL = 'PHOTO_PROCESS';
exports.MEDIA_FILE_CHANNEL = 'MEDIA_FILE_CHANNEL';
exports.FILE_EVENT = {
    VIDEO_PROCSSED: 'VIDEO_PROCSSED',
    PHOTO_PROCESSED: 'PHOTO_PROCESSED',
    FILE_RELATED_MODULE_UPDATED: 'FILE_RELATED_MODULE_UPDATED',
    ASSETS_ITEM_DELETED: 'ASSETS_ITEM_DELETED'
};
exports.DELETE_FILE_TYPE = {
    FILEID: 'FILEID',
    FILE_PATH: 'FILE_PATH'
};
let FileService = class FileService {
    constructor(config, fileModel, imageService, videoService, queueEventService) {
        this.config = config;
        this.fileModel = fileModel;
        this.imageService = imageService;
        this.videoService = videoService;
        this.queueEventService = queueEventService;
        this.logger = new common_1.Logger('FileService');
        this.queueEventService.subscribe(VIDEO_QUEUE_CHANNEL, 'PROCESS_VIDEO', this._processVideo.bind(this));
        this.queueEventService.subscribe(PHOTO_QUEUE_CHANNEL, 'PROCESS_PHOTO', this._processPhoto.bind(this));
        this.queueEventService.subscribe(exports.MEDIA_FILE_CHANNEL, 'DELETE_MEDIA_FILE_IF_UPDATED', this.deleteMediaFileIfUpdated.bind(this));
        this.queueEventService.subscribe(exports.MEDIA_FILE_CHANNEL, 'DELETE_MEDIA_FILE_IF_ASSETS_DELETED', this.deleteMediaFileIfAssetsDeleted.bind(this));
    }
    async findById(id) {
        const model = await this.fileModel.findById(id);
        return model ? new dtos_3.FileDto(model) : null;
    }
    async findByIds(ids) {
        const items = await this.fileModel.find({
            _id: {
                $in: ids
            }
        });
        return items.map((i) => new dtos_3.FileDto(i));
    }
    async createFromMulter(type, multerData, fileUploadOptions) {
        const options = Object.assign({}, fileUploadOptions) || {};
        const publicDir = this.config.get('file.publicDir');
        if (options.replaceWithoutExif) {
            const buffer = await this.imageService.replaceWithoutExif(multerData.path);
            fs_1.unlinkSync(multerData.path);
            fs_1.writeFileSync(multerData.path, buffer);
        }
        if (options.replaceWithThumbail && options.generateThumbnail && options.thumbnailSize) {
            const buffer = await this.imageService.createThumbnail(multerData.path, options.thumbnailSize);
            fs_1.unlinkSync(multerData.path);
            fs_1.writeFileSync(multerData.path, buffer);
        }
        const data = {
            type,
            name: multerData.filename,
            description: '',
            mimeType: multerData.mimetype,
            server: options.server || 'local',
            path: multerData.path.replace(publicDir, ''),
            absolutePath: multerData.path,
            size: multerData.size,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: options.uploader ? options.uploader._id : null,
            updatedBy: options.uploader ? options.uploader._id : null
        };
        const file = await this.fileModel.create(data);
        return dtos_3.FileDto.fromModel(file);
    }
    async addRef(fileId, ref) {
        return this.fileModel.updateOne({ _id: fileId }, {
            $addToSet: {
                refItems: ref
            }
        });
    }
    async remove(fileId) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file) {
            throw new kernel_1.EntityNotFoundException();
        }
        const filePaths = [
            {
                absolutePath: file.absolutePath,
                path: file.path
            }
        ].concat(file.thumbnails || []);
        filePaths.forEach((fp) => {
            if (fs_1.existsSync(fp.absolutePath)) {
                fs_1.unlinkSync(fp.absolutePath);
            }
            else {
                const publicDir = this.config.get('file.publicDir');
                const filePublic = path_1.join(publicDir, fp.path);
                fs_1.existsSync(filePublic) && fs_1.unlinkSync(filePublic);
            }
        });
        return true;
    }
    async removeIfNotHaveRef(fileId) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (file.refItems && !file.refItems.length) {
            return false;
        }
        if (fs_1.existsSync(file.absolutePath)) {
            fs_1.unlinkSync(file.absolutePath);
        }
        else {
            const publicDir = this.config.get('file.publicDir');
            const filePublic = path_1.join(publicDir, file.path);
            fs_1.existsSync(filePublic) && fs_1.unlinkSync(filePublic);
        }
        return true;
    }
    async _processVideo(event) {
        if (event.eventName !== 'processVideo') {
            return;
        }
        const fileData = event.data.file;
        const options = event.data.options || {};
        try {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'processing'
                }
            });
            const publicDir = this.config.get('file.publicDir');
            const videoDir = this.config.get('file.videoDir');
            let videoPath;
            if (fs_1.existsSync(fileData.absolutePath)) {
                videoPath = fileData.absolutePath;
            }
            else if (fs_1.existsSync(path_1.join(publicDir, fileData.path))) {
                videoPath = path_1.join(publicDir, fileData.path);
            }
            if (!videoPath) {
                throw new no_file_exception_1.NoFileException();
            }
            const respVideo = await this.videoService.convert2Mp4(videoPath);
            const newAbsolutePath = respVideo.toPath;
            const newPath = respVideo.toPath.replace(publicDir, '');
            const respThumb = await this.videoService.createThumbs(videoPath, {
                toFolder: videoDir
            });
            const thumbnails = respThumb.map((name) => ({
                absolutePath: path_1.join(videoDir, name),
                path: path_1.join(videoDir, name).replace(publicDir, '')
            }));
            const duration = await this.videoService.getDuration(videoPath);
            fs_1.existsSync(videoPath) && fs_1.unlinkSync(videoPath);
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'finished',
                    absolutePath: newAbsolutePath,
                    path: newPath,
                    thumbnails,
                    duration
                }
            });
        }
        catch (e) {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'error'
                }
            });
            throw e;
        }
        finally {
            if (options.publishChannel) {
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: options.publishChannel,
                    eventName: exports.FILE_EVENT.VIDEO_PROCSSED,
                    data: {
                        meta: options.meta,
                        fileId: fileData._id
                    }
                }));
            }
        }
    }
    async queueProcessVideo(fileId, options) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: VIDEO_QUEUE_CHANNEL,
            eventName: 'processVideo',
            data: {
                file: new dtos_3.FileDto(file),
                options
            }
        }));
        return true;
    }
    async queueProcessPhoto(fileId, options) {
        const file = await this.fileModel.findOne({ _id: fileId });
        if (!file || file.status === 'processing') {
            return false;
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: PHOTO_QUEUE_CHANNEL,
            eventName: 'processPhoto',
            data: {
                file: new dtos_3.FileDto(file),
                options
            }
        }));
        return true;
    }
    async _processPhoto(event) {
        if (event.eventName !== 'processPhoto') {
            return;
        }
        const fileData = event.data.file;
        const options = event.data.options || {};
        try {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'processing'
                }
            });
            const publicDir = this.config.get('file.publicDir');
            const photoDir = this.config.get('file.photoDir');
            let photoPath;
            if (fs_1.existsSync(fileData.absolutePath)) {
                photoPath = fileData.absolutePath;
            }
            else if (fs_1.existsSync(path_1.join(publicDir, fileData.path))) {
                photoPath = path_1.join(publicDir, fileData.path);
            }
            if (!photoPath) {
                throw new no_file_exception_1.NoFileException();
            }
            const meta = await this.imageService.getMetaData(photoPath);
            const buffer = await this.imageService.createThumbnail(photoPath, options.thumbnailSize || {
                width: 250,
                height: 250
            });
            const thumbName = `${kernel_1.StringHelper.randomString(5)}_thumb${kernel_1.StringHelper.getExt(photoPath)}`;
            fs_1.writeFileSync(path_1.join(photoDir, thumbName), buffer);
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'finished',
                    width: meta.width,
                    height: meta.height,
                    thumbnails: [
                        {
                            path: path_1.join(photoDir, thumbName).replace(publicDir, ''),
                            absolutePath: path_1.join(photoDir, thumbName)
                        }
                    ]
                }
            });
        }
        catch (e) {
            await this.fileModel.updateOne({ _id: fileData._id }, {
                $set: {
                    status: 'error'
                }
            });
            throw e;
        }
        finally {
            if (options.publishChannel) {
                await this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: options.publishChannel,
                    eventName: exports.FILE_EVENT.PHOTO_PROCESSED,
                    data: {
                        meta: options.meta,
                        fileId: fileData._id
                    }
                }));
            }
        }
    }
    generateJwt(fileId) {
        const expiresIn = 60 * 60 * 3;
        return jwt.sign({
            fileId
        }, process.env.TOKEN_SECRET, {
            expiresIn
        });
    }
    async generateDownloadLink(fileId) {
        const newUrl = new URL('files/download', kernel_1.getConfig('app').baseUrl);
        newUrl.searchParams.append('key', this.generateJwt(fileId));
        return newUrl.href;
    }
    async getStreamToDownload(key) {
        try {
            const decoded = jwt.verify(key, process.env.TOKEN_SECRET);
            const file = await this.fileModel.findById(decoded.fileId);
            if (!file)
                throw new kernel_1.EntityNotFoundException();
            let filePath;
            const publicDir = this.config.get('file.publicDir');
            if (fs_1.existsSync(file.absolutePath)) {
                filePath = file.absolutePath;
            }
            else if (fs_1.existsSync(path_1.join(publicDir, file.path))) {
                filePath = path_1.join(publicDir, file.path);
            }
            else {
                throw new kernel_1.EntityNotFoundException();
            }
            return {
                file,
                stream: fs_1.createReadStream(filePath)
            };
        }
        catch (e) {
            throw new kernel_1.EntityNotFoundException();
        }
    }
    async deleteMediaFileIfUpdated(event) {
        try {
            const { data, eventName } = event;
            if (eventName !== exports.FILE_EVENT.FILE_RELATED_MODULE_UPDATED) {
                return;
            }
            const { type, currentFile, newFile } = data;
            if (`${currentFile}` === `${newFile}`) {
                return;
            }
            if (type === exports.DELETE_FILE_TYPE.FILEID) {
                const file = await this.findById(currentFile);
                if (!file) {
                    return;
                }
                this.remove(file._id);
            }
            else if (type === exports.DELETE_FILE_TYPE.FILE_PATH) {
                if (fs_1.existsSync(currentFile)) {
                    fs_1.unlinkSync(currentFile);
                }
                else {
                    const publicDir = this.config.get('file.publicDir');
                    const filePublic = path_1.join(publicDir, currentFile);
                    fs_1.existsSync(filePublic) && fs_1.unlinkSync(filePublic);
                }
            }
        }
        catch (e) {
            this.logger.error(e);
        }
    }
    async deleteMediaFileIfAssetsDeleted(event) {
        try {
            const { data, eventName } = event;
            if (eventName !== exports.FILE_EVENT.ASSETS_ITEM_DELETED) {
                return;
            }
            const { type, metadata } = data;
            if (type === 'video') {
                const video = new dtos_1.VideoDto(metadata);
                const { fileId, thumbnailId, trailerId } = video;
                await Promise.all([
                    fileId && this.remove(fileId),
                    thumbnailId && this.remove(thumbnailId),
                    trailerId && this.remove(trailerId)
                ]);
            }
            else if (type === 'gallery') {
            }
            else if (type === 'photo') {
                const photo = new dtos_1.PhotoDto(metadata);
                const { fileId } = photo;
                fileId && await this.remove(fileId);
            }
            else if (type === 'digital_product') {
                const product = new dtos_1.ProductDto(metadata);
                const { digitalFileId, imageId } = product;
                await Promise.all([
                    digitalFileId && this.remove(digitalFileId),
                    imageId && this.remove(imageId)
                ]);
            }
            else if (type === 'banner') {
                const { fileId } = new dtos_2.BannerDto(metadata);
                fileId && await this.remove(fileId);
            }
        }
        catch (e) {
            this.logger.error(e);
        }
    }
};
FileService = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(providers_1.FILE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [nestjs_config_1.ConfigService,
        mongoose_1.Model,
        image_service_1.ImageService,
        video_service_1.VideoService,
        kernel_1.QueueEventService])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map