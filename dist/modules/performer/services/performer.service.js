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
exports.PerformerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const file_1 = require("../../file");
const constants_1 = require("../../../kernel/constants");
const services_2 = require("../../user/services");
const lodash_1 = require("lodash");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const payloads_1 = require("../../studio/payloads");
const model_not_found_exception_1 = require("../../studio/exceptions/model-not-found.exception");
const moment = require("moment");
const constants_2 = require("../constants");
const constants_3 = require("../../socket/constants");
const constant_1 = require("../../stream/constant");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const constants_4 = require("../constants");
const index_1 = require("./index");
const dtos_2 = require("../dtos");
const exceptions_1 = require("../exceptions");
const providers_1 = require("../providers");
const category_service_1 = require("./category.service");
let PerformerService = class PerformerService {
    constructor(performerModel, userService, queueEventService, categoryService, socketUserService, blockSettingModel, performerCommissionModel, fileService, performerCommissionService) {
        this.performerModel = performerModel;
        this.userService = userService;
        this.queueEventService = queueEventService;
        this.categoryService = categoryService;
        this.socketUserService = socketUserService;
        this.blockSettingModel = blockSettingModel;
        this.performerCommissionModel = performerCommissionModel;
        this.fileService = fileService;
        this.performerCommissionService = performerCommissionService;
    }
    findOne(filter) {
        return this.performerModel.findOne(filter);
    }
    async findById(id) {
        const model = await this.performerModel.findById(id);
        if (!model)
            return null;
        const dto = new dtos_2.PerformerDto(model);
        if (model.avatarId) {
            const avatar = await this.fileService.findById(model.avatarId);
            dto.avatarPath = avatar ? file_1.FileDto.getPublicUrl(avatar.path) : null;
        }
        return new dtos_2.PerformerDto(dto);
    }
    async checkBlockedByIp(blockSettings, countryCode) {
        if (blockSettings &&
            blockSettings.countries &&
            blockSettings.countries.length) {
            return blockSettings.countries.indexOf(countryCode) > -1;
        }
        return false;
    }
    async checkBlockedByPerformer(blockSettings, userId) {
        if (blockSettings &&
            blockSettings.userIds &&
            blockSettings.userIds.length) {
            return blockSettings.userIds.indexOf(userId) > -1;
        }
        return false;
    }
    async findByUsername(username, countryCode, currentUser) {
        const findUsername = username.replace(/[^a-zA-Z0-9]/g, '');
        const model = await this.performerModel.findOne({ username: findUsername });
        if (!model)
            return null;
        const dto = new dtos_2.PerformerDto(model);
        let isBlocked = false;
        const blockSettings = await this.blockSettingModel.findOne({
            performerId: model._id
        });
        if (countryCode && blockSettings) {
            isBlocked = await this.checkBlockedByIp(blockSettings, countryCode);
        }
        let isBlockedByPerformer = false;
        if (currentUser && blockSettings) {
            isBlockedByPerformer = await this.checkBlockedByPerformer(blockSettings, currentUser._id);
        }
        dto.isBlocked = !!(isBlocked || isBlockedByPerformer);
        if (model.avatarId) {
            const avatar = await this.fileService.findById(model.avatarId);
            dto.avatarPath = avatar ? avatar.path : null;
        }
        return dto;
    }
    async findByEmail(email) {
        const model = await this.performerModel.findOne({
            email: email.toLowerCase()
        });
        if (!model)
            return null;
        return new dtos_2.PerformerDto(model);
    }
    async find(condition = {}) {
        const models = await this.performerModel.find(condition).exec();
        return models;
    }
    async findByIds(ids) {
        const performers = await this.performerModel
            .find({
            _id: {
                $in: ids
            }
        })
            .lean()
            .exec();
        return performers.map(p => new dtos_2.PerformerDto(p));
    }
    async register(payload) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        const userNameCheck = await this.performerModel.countDocuments({
            username: payload.username.trim()
        });
        if (userNameCheck) {
            throw new exceptions_1.UsernameExistedException();
        }
        const emailCheck = await this.performerModel.countDocuments({
            email: payload.email.toLowerCase().trim()
        });
        if (emailCheck) {
            throw new exceptions_1.EmailExistedException();
        }
        if (payload.avatarId) {
            const avatar = await this.fileService.findById(payload.avatarId);
            if (!avatar) {
                throw new kernel_1.EntityNotFoundException('Avatar not found!');
            }
            data.avatarPath = avatar.path;
        }
        const performer = await this.performerModel.create(data);
        await Promise.all([
            payload.idVerificationId &&
                this.fileService.addRef(payload.idVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-id-verification'
                }),
            payload.documentVerificationId &&
                this.fileService.addRef(payload.documentVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-document-verification'
                }),
            payload.avatarId &&
                this.fileService.addRef(payload.avatarId, {
                    itemId: performer._id,
                    itemType: 'performer-avatar'
                })
        ]);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.PERFORMER_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: {
                id: performer._id
            }
        }));
        return new dtos_2.PerformerDto(performer);
    }
    async getDetails(id, jwtToken) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const { avatarId, documentVerificationId, idVerificationId, releaseFormId, categoryIds } = performer;
        const [avatar, documentVerification, idVerification, releaseForm, commission, categories] = await Promise.all([
            avatarId && this.fileService.findById(avatarId),
            documentVerificationId &&
                this.fileService.findById(documentVerificationId),
            idVerificationId && this.fileService.findById(idVerificationId),
            releaseFormId && this.fileService.findById(releaseFormId),
            this.performerCommissionModel.findOne({
                performerId: id
            }),
            categoryIds
                ? this.categoryService.find({ _id: { $in: categoryIds } })
                : []
        ]);
        const dto = new dtos_2.PerformerDto(performer);
        dto.categories = categories ? categories.map(c => c.name) : [];
        dto.avatar = avatar ? file_1.FileDto.getPublicUrl(avatar.path) : null;
        dto.idVerification = idVerification
            ? {
                _id: idVerification._id,
                name: idVerification.name,
                url: jwtToken
                    ? `${file_1.FileDto.getPublicUrl(idVerification.path)}?documentId=${idVerification._id}&token=${jwtToken}`
                    : file_1.FileDto.getPublicUrl(idVerification.path),
                mimeType: idVerification.mimeType
            }
            : null;
        dto.documentVerification = documentVerification
            ? {
                _id: documentVerification._id,
                name: documentVerification.name,
                url: jwtToken
                    ? `${file_1.FileDto.getPublicUrl(documentVerification.path)}?documentId=${documentVerification._id}&token=${jwtToken}`
                    : file_1.FileDto.getPublicUrl(documentVerification.path),
                mimeType: documentVerification.mimeType
            }
            : null;
        dto.releaseForm = releaseForm
            ? {
                _id: releaseForm._id,
                name: releaseForm.name,
                url: jwtToken
                    ? `${file_1.FileDto.getPublicUrl(releaseForm.path)}?documentId=${releaseForm._id}&token=${jwtToken}`
                    : file_1.FileDto.getPublicUrl(releaseForm.path),
                mimeType: releaseForm.mimeType
            }
            : null;
        dto.commissionSetting = commission;
        return dto;
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        const userNameCheck = await this.performerModel.countDocuments({
            username: payload.username.trim()
        });
        if (userNameCheck) {
            throw new exceptions_1.UsernameExistedException();
        }
        const emailCheck = await this.performerModel.countDocuments({
            email: payload.email.toLowerCase().trim()
        });
        if (emailCheck) {
            throw new exceptions_1.EmailExistedException();
        }
        if (payload.avatarId) {
            const avatar = await this.fileService.findById(payload.avatarId);
            if (!avatar) {
                throw new kernel_1.EntityNotFoundException('Avatar not found!');
            }
            data.avatarPath = avatar.path;
        }
        if (user) {
            data.createdBy = user._id;
        }
        const performer = await this.performerModel.create(data);
        await Promise.all([
            payload.idVerificationId &&
                this.fileService.addRef(payload.idVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-id-verification'
                }),
            payload.documentVerificationId &&
                this.fileService.addRef(payload.documentVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-document-verification'
                }),
            payload.releaseFormId &&
                this.fileService.addRef(payload.releaseFormId, {
                    itemId: performer._id,
                    itemType: 'performer-release-form'
                }),
            payload.avatarId &&
                this.fileService.addRef(payload.avatarId, {
                    itemId: performer._id,
                    itemType: 'performer-avatar'
                })
        ]);
        if (payload.commissionSetting) {
            await this.performerCommissionService.update(payload.commissionSetting, performer._id);
        }
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.PERFORMER_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: {
                id: performer._id
            }
        }));
        return new dtos_2.PerformerDto(performer);
    }
    async adminUpdate(id, payload) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        const { studioId } = performer;
        if (!performer.name) {
            data.name = [performer.firstName || '', performer.lastName || '']
                .join(' ')
                .trim();
        }
        if (data.email &&
            data.email.toLowerCase() !== performer.email.toLowerCase()) {
            const emailCheck = await this.performerModel.countDocuments({
                email: data.email.toLowerCase(),
                _id: {
                    $ne: performer._id
                }
            });
            if (emailCheck) {
                throw new exceptions_1.EmailExistedException();
            }
        }
        if (data.username && data.username !== performer.username) {
            const usernameCheck = await this.performerModel.countDocuments({
                username: performer.username,
                _id: { $ne: performer._id }
            });
            if (usernameCheck) {
                throw new exceptions_1.UsernameExistedException();
            }
        }
        if ((payload.avatarId && !performer.avatarId) ||
            (performer.avatarId &&
                payload.avatarId &&
                payload.avatarId !== performer.avatarId.toString())) {
            const avatar = await this.fileService.findById(payload.avatarId);
            if (!avatar) {
                throw new kernel_1.EntityNotFoundException('Avatar not found!');
            }
            data.avatarPath = avatar.path;
        }
        await this.performerModel.updateOne({ _id: id }, data);
        await Promise.all([
            payload.avatarId &&
                this.fileService.addRef(payload.avatarId, {
                    itemId: performer._id,
                    itemType: 'performer-avatar'
                }),
            payload.documentVerificationId &&
                this.fileService.addRef(payload.documentVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-document-verification'
                }),
            payload.releaseFormId &&
                this.fileService.addRef(payload.releaseFormId, {
                    itemId: performer._id,
                    itemType: 'performer-release-form'
                }),
            payload.idVerificationId &&
                this.fileService.addRef(payload.idVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-id-verification'
                })
        ]);
        if (payload.documentVerificationId &&
            `${payload.documentVerificationId}` !==
                `${performer.documentVerificationId}`) {
            performer.documentVerificationId &&
                (await this.fileService.remove(performer.documentVerificationId));
        }
        if (payload.idVerificationId &&
            `${payload.idVerificationId}` !== `${performer.idVerificationId}`) {
            performer.idVerificationId &&
                (await this.fileService.remove(performer.idVerificationId));
        }
        if (payload.releaseFormId &&
            `${payload.releaseFormId}` !== `${performer.releaseFormId}`) {
            performer.releaseFormId &&
                (await this.fileService.remove(performer.releaseFormId));
        }
        lodash_1.merge(performer, data);
        const event = {
            channel: constants_2.PERFORMER_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: {
                performer,
                oldStudioId: studioId
            }
        };
        await this.queueEventService.publish(event);
        return performer;
    }
    async studioUpdate(id, payload, studioId) {
        const performer = await this.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (performer.studioId.toString() !== studioId.toString()) {
            throw new model_not_found_exception_1.ModelNotFoundException();
        }
        return this.performerModel.updateOne({ _id: id }, { $set: { status: payload.status } }, { new: true });
    }
    async update(id, payload) {
        const performer = await this.performerModel.findOne({ _id: id });
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (performer && `${performer._id}` !== `${id}`) {
            delete data.email;
            delete data.username;
        }
        const { avatarId, documentVerificationId, idVerificationId, releaseFormId } = performer;
        data.name = [performer.firstName || '', performer.lastName || '']
            .join(' ')
            .trim();
        await this.performerModel.updateOne({ _id: id }, data);
        await Promise.all([
            payload.avatarId &&
                this.fileService.addRef(payload.avatarId, {
                    itemId: performer._id,
                    itemType: 'performer-avatar'
                }),
            payload.documentVerificationId &&
                this.fileService.addRef(payload.documentVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-document-verification'
                }),
            payload.releaseFormId &&
                this.fileService.addRef(payload.releaseFormId, {
                    itemId: performer._id,
                    itemType: 'performer-release-form'
                }),
            payload.idVerificationId &&
                this.fileService.addRef(payload.idVerificationId, {
                    itemId: performer._id,
                    itemType: 'performer-id-verification'
                })
        ]);
        await Promise.all([
            payload.avatarId &&
                this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: services_1.MEDIA_FILE_CHANNEL,
                    eventName: services_1.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
                    data: {
                        type: services_1.DELETE_FILE_TYPE.FILEID,
                        currentFile: avatarId,
                        newFile: payload.avatarId
                    }
                })),
            payload.documentVerificationId &&
                this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: services_1.MEDIA_FILE_CHANNEL,
                    eventName: services_1.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
                    data: {
                        type: services_1.DELETE_FILE_TYPE.FILEID,
                        currentFile: documentVerificationId,
                        newFile: payload.documentVerificationId
                    }
                })),
            payload.releaseFormId &&
                this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: services_1.MEDIA_FILE_CHANNEL,
                    eventName: services_1.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
                    data: {
                        type: services_1.DELETE_FILE_TYPE.FILEID,
                        currentFile: releaseFormId,
                        newFile: payload.releaseFormId
                    }
                })),
            payload.idVerificationId &&
                this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: services_1.MEDIA_FILE_CHANNEL,
                    eventName: services_1.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
                    data: {
                        type: services_1.DELETE_FILE_TYPE.FILEID,
                        currentFile: idVerificationId,
                        newFile: payload.idVerificationId
                    }
                }))
        ]);
        return true;
    }
    async viewProfile(id) {
        return this.performerModel.updateOne({ _id: id }, {
            $inc: { 'stats.views': 1 }
        }, { new: true });
    }
    async updateBlockSetting(performerId, payload) {
        let item = await this.blockSettingModel.findOne({
            performerId
        });
        if (item) {
            item.countries = lodash_1.uniq(payload.countries);
            item.userIds = lodash_1.uniq(payload.userIds);
            const data = item.toObject();
            const emitUserIds = data.userIds.length
                ? data.userIds
                    .map(u => u.toString())
                    .filter(u => !payload.userIds.includes(u))
                : [];
            payload.userIds &&
                (await this.queueEventService.publish({
                    channel: constants_4.BLOCK_USERS_CHANNEL,
                    eventName: constants_4.BLOCK_ACTION.CREATED,
                    data: {
                        userIds: emitUserIds,
                        performerId: item.performerId
                    }
                }));
            await item.save();
            return item;
        }
        item = new this.blockSettingModel();
        item.performerId = performerId;
        item.userIds = lodash_1.uniq(payload.userIds);
        item.countries = lodash_1.uniq(payload.countries);
        payload.userIds &&
            (await this.queueEventService.publish({
                channel: constants_4.BLOCK_USERS_CHANNEL,
                eventName: constants_4.BLOCK_ACTION.CREATED,
                data: {
                    userIds: item.userIds,
                    performerId: item.performerId
                }
            }));
        await item.save();
        return item;
    }
    async getBlockSetting(performerId) {
        const item = await this.blockSettingModel.findOne({
            performerId
        });
        if (!item) {
            const newData = await this.blockSettingModel.create({
                performerId,
                userIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                countries: []
            });
            return newData;
        }
        const users = item.userIds.length
            ? await this.userService.findByIds(item.userIds)
            : [];
        const data = new dtos_2.BlockSettingDto(item);
        data.usersInfo = users
            ? users.map(u => u._id && u.toResponse(false))
            : null;
        return data;
    }
    async checkBlock(performerId, countryCode, user) {
        let isBlocked = false;
        const blockSettings = await this.blockSettingModel.findOne({
            performerId
        });
        if (countryCode && blockSettings) {
            isBlocked = await this.checkBlockedByIp(blockSettings, countryCode);
        }
        let isBlockedByPerformer = false;
        if (user && blockSettings) {
            isBlockedByPerformer = await this.checkBlockedByPerformer(blockSettings, user._id);
        }
        const blocked = !!(isBlockedByPerformer || isBlocked);
        return { blocked };
    }
    async updateSteamingStatus(id, status) {
        return this.performerModel.updateOne({ _id: id }, { $set: { streamingTitle: status } });
    }
    async updateLastStreamingTime(id, streamTime) {
        const newEvent = {
            channel: constants_2.PERFORMER_STEAMING_STATUS_CHANNEL,
            eventName: constant_1.OFFLINE,
            data: { id }
        };
        await this.queueEventService.publish(newEvent);
        return this.performerModel.updateOne({ _id: id }, {
            $set: {
                lastStreamingTime: new Date(),
                live: false,
                streamingStatus: constant_1.OFFLINE
            },
            $inc: { 'stats.totalStreamTime': streamTime }
        });
    }
    async offline(id) {
        const performer = await this.findById(id);
        if (!performer) {
            return;
        }
        await this.performerModel.updateOne({ _id: id }, {
            $set: {
                isOnline: false,
                streamingStatus: constant_1.OFFLINE,
                onlineAt: null,
                offlineAt: new Date()
            }
        });
        await this.socketUserService.emitToConnectedUsers('modelUpdateStatus', {
            id,
            performer: new dtos_2.PerformerDto(Object.assign(Object.assign({}, performer), { streamingStatus: constant_1.OFFLINE })).toSearchResponse(),
            status: constants_3.USER_SOCKET_EVENT.DISCONNECTED
        });
    }
    async updateVerificationStatus(userId) {
        return this.performerModel.updateOne({
            _id: userId
        }, { status: constants_1.STATUS.ACTIVE, emailVerified: true }, { new: true });
    }
    async updateBalance(id, amount) {
        return this.performerModel.updateOne({ _id: id }, {
            $inc: {
                balance: amount,
                'stats.totalTokenEarned': amount > 0 ? amount : 0,
                'stats.totalTokenSpent': amount <= 0 ? amount : 0
            }
        });
    }
    async updateStats(id, payload) {
        return this.performerModel.updateOne({ _id: id }, { $inc: payload });
    }
    async goLive(id) {
        return this.performerModel.updateOne({ _id: id }, { $set: { live: true } });
    }
    async setStreamingStatus(id, streamingStatus) {
        const performer = await this.performerModel.findOne({ _id: id });
        if (!performer) {
            return;
        }
        if (streamingStatus === performer.streamingStatus) {
            return;
        }
        const newEvent = {
            channel: constants_2.PERFORMER_STEAMING_STATUS_CHANNEL,
            eventName: streamingStatus,
            data: { id, oldStreamingStatus: performer.streamingStatus }
        };
        await this.queueEventService.publish(newEvent);
        await this.performerModel.updateOne({ _id: string_helper_1.toObjectId(id) }, { $set: { streamingStatus } });
    }
    async updateAvatar(performerId, file) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer) {
            await this.fileService.remove(file._id);
            throw new kernel_1.EntityNotFoundException();
        }
        const { avatarId } = performer;
        await this.performerModel.updateOne({ _id: performerId }, {
            avatarId: file._id,
            avatarPath: file.path
        });
        if (avatarId !== file._id) {
            await this.fileService.remove(avatarId);
        }
        return file;
    }
    async updateDefaultPrice(id, payload) {
        return this.performerModel.updateOne({ _id: id }, {
            $set: {
                privateCallPrice: payload.privateCallPrice,
                groupCallPrice: payload.groupCallPrice
            }
        });
    }
    async updateBroadcastSetting(id, payload) {
        return this.performerModel.updateOne({ _id: id }, payload);
    }
    async selfSuspendAccount(performerId, performer) {
        if (performerId.toString() !== performer._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        await this.performerModel.updateOne({ _id: performerId }, { status: constants_4.PERFORMER_STATUSES.INACTIVE });
        return { success: true };
    }
    async stats() {
        const [totalVideos, totalPhotos, totalGalleries, totalProducts, totalStreamTime, totalTokenEarned] = await Promise.all([
            this.performerModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalVideos'
                        }
                    }
                }
            ]),
            this.performerModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalPhotos'
                        }
                    }
                }
            ]),
            this.performerModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalGalleries'
                        }
                    }
                }
            ]),
            this.performerModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalProducts'
                        }
                    }
                }
            ]),
            this.performerModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalStreamTime'
                        }
                    }
                }
            ]),
            this.performerModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalTokenEarned'
                        }
                    }
                }
            ])
        ]);
        return {
            totalVideos: (totalVideos.length && totalVideos[0].total) || 0,
            totalPhotos: (totalPhotos.length && totalPhotos[0].total) || 0,
            totalGalleries: (totalGalleries.length && totalGalleries[0].total) || 0,
            totalProducts: (totalProducts.length && totalProducts[0].total) || 0,
            totalStreamTime: (totalStreamTime.length && totalStreamTime[0].total) || 0,
            totalTokenEarned: (totalTokenEarned.length && totalTokenEarned[0].total) || 0
        };
    }
    async totalOnlineTodayStat(studioId) {
        const totalOnlineToday = await this.performerModel.aggregate([
            {
                $match: {
                    studioId,
                    lastStreamingTime: {
                        $gt: moment()
                            .set({ hour: 0, minute: 0 })
                            .toDate()
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 }
                }
            }
        ]);
        return (totalOnlineToday.length && totalOnlineToday[0].total) || 0;
    }
    async totalHoursOnlineStat(studioId) {
        const totalHoursOnline = await this.performerModel.aggregate([
            { $match: { studioId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$stats.totalStreamTime' }
                }
            }
        ]);
        return (totalHoursOnline.length && totalHoursOnline[0].total) || 0;
    }
    async checkAuthDocument(req, user) {
        const { query } = req;
        if (!query.documentId) {
            return false;
        }
        const file = await this.fileService.findById(query.documentId);
        if (!file || !file.refItems || !file.refItems.length) {
            return false;
        }
        if (user.roles && user.roles.includes('admin')) {
            return true;
        }
        const { itemId } = file.refItems[0];
        if (user._id.toString() !== itemId.toString()) {
            return false;
        }
        if (file.type &&
            [
                'performer-document',
                'company-registration-certificate',
                'performer-release-form'
            ].indexOf(file.type) !== -1) {
            return true;
        }
        return false;
    }
};
PerformerService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_MODEL_PROVIDER)),
    __param(5, common_1.Inject(providers_1.PERFORMER_BLOCK_SETTING_MODEL_PROVIDER)),
    __param(6, common_1.Inject(providers_1.PERFORMER_COMMISSION_MODEL_PROVIDER)),
    __param(7, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __param(8, common_1.Inject(common_1.forwardRef(() => index_1.PerformerCommissionService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_2.UserService,
        kernel_1.QueueEventService,
        category_service_1.CategoryService,
        socket_user_service_1.SocketUserService,
        mongoose_1.Model,
        mongoose_1.Model,
        services_1.FileService,
        index_1.PerformerCommissionService])
], PerformerService);
exports.PerformerService = PerformerService;
//# sourceMappingURL=performer.service.js.map