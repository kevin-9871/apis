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
exports.StudioService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const mongoose_1 = require("mongoose");
const exceptions_1 = require("../../user/exceptions");
const exceptions_2 = require("../../performer/exceptions");
const kernel_1 = require("../../../kernel");
const services_2 = require("../../file/services");
const file_1 = require("../../file");
const dtos_1 = require("../dtos");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let StudioService = class StudioService {
    constructor(performerService, studioModel, fileService, queueEventService) {
        this.performerService = performerService;
        this.studioModel = studioModel;
        this.fileService = fileService;
        this.queueEventService = queueEventService;
    }
    async findById(id) {
        const studio = await this.studioModel.findById(id);
        return new dtos_1.StudioDto(studio);
    }
    async find(condition = {}) {
        return this.studioModel.find(condition);
    }
    async findByIds(ids) {
        const studios = await this.studioModel
            .find({
            _id: {
                $in: ids
            }
        })
            .lean()
            .exec();
        return studios.map((studio) => new dtos_1.StudioDto(studio));
    }
    async findByEmail(email) {
        return this.studioModel.findOne({ email: email.toLowerCase() });
    }
    async register(payload) {
        const data = Object.assign(Object.assign({}, payload), { roles: payload.roles || ['studio'], updatedAt: new Date(), createdAt: new Date() });
        const userNameCheck = await this.studioModel.countDocuments({
            username: payload.username.trim()
        });
        if (userNameCheck) {
            throw new exceptions_1.UsernameExistedException();
        }
        const emailCheck = await this.studioModel.countDocuments({
            email: payload.email.toLowerCase().trim()
        });
        if (emailCheck) {
            throw new exceptions_2.EmailExistedException();
        }
        if (payload.documentVerificationId) {
            const file = await this.fileService.findById(payload.documentVerificationId);
            if (!file) {
                throw new kernel_1.EntityNotFoundException('Verification Document is not found!');
            }
        }
        const studio = await this.studioModel.create(data);
        if (payload.documentVerificationId) {
            await this.fileService.addRef(payload.documentVerificationId, {
                itemId: studio._id,
                itemType: 'studio-document'
            });
        }
        const event = {
            channel: constants_1.STUDIO_CHANNEL,
            eventName: constants_1.STUDIO_EVENT_NAME.CREATED,
            data: studio
        };
        await this.queueEventService.publish(event);
        return new dtos_1.StudioDto(studio);
    }
    async update(id, payload) {
        const data = Object.assign({}, payload);
        if (payload.documentVerificationId) {
            const file = await this.fileService.findById(payload.documentVerificationId);
            if (!file) {
                throw new kernel_1.EntityNotFoundException('Verification Document is not found!');
            }
        }
        return this.studioModel.updateOne({ _id: id }, data, { new: true });
    }
    async updateStats(id, payload) {
        return this.studioModel.updateOne({ _id: id }, { $inc: payload });
    }
    async uploadDocument(studio, fileId) {
        await this.studioModel.updateOne({ _id: studio._id }, { $set: { documentVerificationId: fileId } });
        await Promise.all([
            this.fileService.addRef(fileId, {
                itemId: studio._id,
                itemType: 'studio-document'
            }),
            studio.documentVerificationId &&
                this.fileService.remove(studio.documentVerificationId)
        ]);
        return true;
    }
    async search(req) {
        const query = {};
        if (req.q) {
            if (!query.$and) {
                query.$and = [];
            }
            query.$and.push({
                $or: [
                    {
                        name: { $regex: req.q }
                    },
                    {
                        username: { $regex: req.q }
                    },
                    {
                        email: { $regex: req.q }
                    }
                ]
            });
        }
        if (req.status) {
            if (req.status === constants_1.STUDIO_STATUES.PENDING) {
                if (!query.$and) {
                    query.$and = [];
                }
                query.$and.push({
                    $or: [{ status: req.status }, { emailVerified: false }]
                });
            }
            else {
                query.status = req.status;
            }
        }
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.studioModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.studioModel.countDocuments(query)
        ]);
        return { data, total };
    }
    async stats(id) {
        const results = await this.findById(id);
        if (!results) {
            throw new kernel_1.EntityNotFoundException();
        }
        const studio = new dtos_1.StudioDto(results);
        const { stats, _id } = studio;
        const [totalOnlineToday, totalHoursOnline] = await Promise.all([
            this.performerService.totalOnlineTodayStat(_id),
            this.performerService.totalHoursOnlineStat(_id)
        ]);
        return Object.assign(Object.assign({}, stats), { totalOnlineToday, totalHoursOnline });
    }
    async detail(id, jwtToken) {
        const result = await this.findById(id);
        const studio = new dtos_1.StudioDto(result).toResponse(true);
        if (studio.documentVerificationId) {
            const documentVerification = await this.fileService.findById(studio.documentVerificationId);
            if (documentVerification) {
                const documentVerificationFileURL = jwtToken
                    ? `${file_1.FileDto.getPublicUrl(documentVerification.path)}?documentId=${documentVerification._id}&token=${jwtToken}`
                    : file_1.FileDto.getPublicUrl(documentVerification.path);
                studio.documentVerificationFile = documentVerificationFileURL;
                studio.documentVerification = {
                    _id: documentVerification._id,
                    name: documentVerification.name,
                    url: documentVerificationFileURL,
                    mimeType: documentVerification.mimeType
                };
            }
        }
        return studio;
    }
    async updateBalance(id, amount) {
        return this.studioModel.updateOne({ _id: id }, {
            $inc: {
                balance: amount,
                'stats.totalTokenEarned': amount > 0 ? amount : 0,
                'stats.totalTokenSpent': amount <= 0 ? amount : 0
            }
        });
    }
    async updateVerificationStatus(userId) {
        return this.studioModel.updateOne({
            _id: userId
        }, { status: constants_1.STUDIO_STATUES.ACTIVE, emailVerified: true }, { new: true });
    }
};
StudioService = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(providers_1.STUDIO_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.FileService))),
    __metadata("design:paramtypes", [services_1.PerformerService,
        mongoose_1.Model,
        services_2.FileService,
        kernel_1.QueueEventService])
], StudioService);
exports.StudioService = StudioService;
//# sourceMappingURL=studio.service.js.map