"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileResponseDto = void 0;
class FileResponseDto {
    static fromFile(file) {
        if (!file)
            return null;
        return {
            _id: file._id,
            url: file.getUrl(),
            thumbnailUrl: null
        };
    }
}
exports.FileResponseDto = FileResponseDto;
//# sourceMappingURL=file-response.dto.js.map