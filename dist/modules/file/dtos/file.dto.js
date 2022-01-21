"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDto = void 0;
const kernel_1 = require("../../../kernel");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
class FileDto {
    constructor(init) {
        if (init) {
            this._id = init._id;
            this.type = init.type;
            this.name = init.name;
            this.description = init.description;
            this.mimeType = init.mimeType;
            this.server = init.server;
            this.path = init.path;
            this.width = init.width;
            this.height = init.height;
            this.duration = init.duration;
            this.size = init.size;
            this.encoding = init.encoding;
            this.path = init.path;
            this.absolutePath = init.absolutePath;
            this.thumbnails = init.thumbnails;
            this.refItems = init.refItems;
            this.status = init.status;
            this.createdBy = init.createdBy;
            this.updatedBy = init.updatedBy;
            this.createdAt = init.createdAt;
            this.updatedAt = init.updatedAt;
        }
    }
    static fromModel(file) {
        return new FileDto(file);
    }
    getPublicPath() {
        if (this.absolutePath) {
            return this.absolutePath.replace(kernel_1.getConfig('file').publicDir, '');
        }
        return this.path || '';
    }
    getUrl() {
        if (!this.path)
            return '';
        if (string_helper_1.isUrl(this.path))
            return this.path;
        return new URL(this.path, kernel_1.getConfig('app').baseUrl).href;
    }
    getThumbnails() {
        if (!this.thumbnails || !this.thumbnails.length) {
            return [];
        }
        return this.thumbnails.map((t) => {
            if (string_helper_1.isUrl(t.path))
                return t.path;
            return new URL(t.path, kernel_1.getConfig('app').baseUrl).href;
        });
    }
    static getPublicUrl(filePath) {
        if (!filePath)
            return '';
        if (string_helper_1.isUrl(filePath))
            return filePath;
        return new URL(filePath, kernel_1.getConfig('app').baseUrl).href;
    }
    isVideo() {
        return (this.mimeType || '').toLowerCase().includes('video');
    }
    isImage() {
        return (this.mimeType || '').toLowerCase().includes('image');
    }
}
exports.FileDto = FileDto;
//# sourceMappingURL=file.dto.js.map