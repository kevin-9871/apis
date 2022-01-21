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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadInterceptor = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const nestjs_config_1 = require("nestjs-config");
const fs_1 = require("fs");
const mkdirp = require("mkdirp");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
const multer_utils_1 = require("../lib/multer/multer.utils");
function FileUploadInterceptor(type = 'file', fieldName = 'file', options = {}) {
    let MixinInterceptor = class MixinInterceptor {
        constructor(config, fileService) {
            this.config = config;
            this.fileService = fileService;
            this.uploadDir = options.destination || this.config.get('file').publicDir;
            this.createFolderIfNotExists(this.uploadDir);
        }
        async createFolderIfNotExists(dir) {
            !fs_1.existsSync(dir) && mkdirp.sync(dir);
        }
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            const { uploadDir } = this;
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    if (options.fileName) {
                        return cb(null, options.fileName);
                    }
                    const ext = (kernel_1.StringHelper.getExt(file.originalname) || '').toLocaleLowerCase();
                    const orgName = kernel_1.StringHelper.getFileName(file.originalname, true);
                    const randomText = kernel_1.StringHelper.randomString(5);
                    const name = kernel_1.StringHelper.createAlias(`${randomText}-${orgName}`).toLocaleLowerCase() + ext;
                    return cb(null, name);
                }
            });
            const upload = multer({
                storage
            }).single(fieldName);
            await new Promise((resolve, reject) => upload(ctx.getRequest(), ctx.getResponse(), (err) => {
                if (err) {
                    const error = multer_utils_1.transformException(err);
                    return reject(error);
                }
                return resolve(null);
            }));
            const ctxRequest = ctx.getRequest();
            const fileContent = ctxRequest.file;
            if (!options.uploader && ctxRequest.user) {
                options.uploader = ctxRequest.user;
            }
            const file = await this.fileService.createFromMulter(type, fileContent, options);
            ctxRequest.file = file;
            return next.handle();
        }
    };
    MixinInterceptor = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [nestjs_config_1.ConfigService,
            services_1.FileService])
    ], MixinInterceptor);
    const interceptor = common_1.mixin(MixinInterceptor);
    return interceptor;
}
exports.FileUploadInterceptor = FileUploadInterceptor;
//# sourceMappingURL=fle-upload.interceptor.js.map