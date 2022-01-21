"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const file_controller_1 = require("./controllers/file.controller");
const providers_1 = require("./providers");
const services_1 = require("./services");
const image_service_1 = require("./services/image.service");
let FileModule = class FileModule {
};
FileModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            kernel_1.QueueModule.forRoot()
        ],
        providers: [...providers_1.fileProviders, services_1.FileService, image_service_1.ImageService, services_1.VideoService],
        controllers: [file_controller_1.FileController],
        exports: [...providers_1.fileProviders, services_1.FileService, image_service_1.ImageService, services_1.VideoService]
    })
], FileModule);
exports.FileModule = FileModule;
//# sourceMappingURL=file.module.js.map