/// <reference types="mongoose" />
import { Request as Req } from 'express';
import { DataResponse, QueueEventService } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PerformerCreatePayload, PerformerSearchPayload } from 'src/modules/performer/payloads';
import { PerformerCommissionService, PerformerSearchService, PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { StudioDto, IStudio } from '../dtos';
import { StudioUpdatePayload, StudioSearchPayload, MemberSetActivePayload, UpdateCommissionPayload, StudioCreateByAdminPayload } from '../payloads';
import { StudioService } from '../services';
export declare class StudioController {
    private readonly studioService;
    private readonly performerService;
    private readonly performerSearchService;
    private readonly performerCommissionService;
    private readonly queueEventService;
    private readonly authService;
    private readonly fileService;
    constructor(studioService: StudioService, performerService: PerformerService, performerSearchService: PerformerSearchService, performerCommissionService: PerformerCommissionService, queueEventService: QueueEventService, authService: AuthService, fileService: FileService);
    me(request: Req): Promise<DataResponse<Partial<IStudio>>>;
    detail(id: string, request: Req): Promise<DataResponse<Partial<IStudio>>>;
    update(payload: StudioUpdatePayload, currentStudio: StudioDto): Promise<DataResponse<Partial<IStudio>>>;
    search(query: StudioSearchPayload): Promise<DataResponse<{
        data: import("mongoose").LeanDocument<import("../models").StudioModel>[];
        total: number;
    }>>;
    members(query: PerformerSearchPayload, user: UserDto): Promise<DataResponse<import("src/kernel").PageableData<import("src/modules/performer/dtos").IPerformerResponse>>>;
    register(payload: StudioCreateByAdminPayload): Promise<DataResponse<StudioDto>>;
    updateDocumentVerification(file: FileDto, studio: StudioDto, request: Req): Promise<DataResponse<{
        file: FileDto;
        url: string;
    }>>;
    uploadDocumentVerification(file: FileDto, request: Req): Promise<DataResponse<{
        file: FileDto;
        url: string;
    }>>;
    adminUpdateDocumentVerification(file: FileDto, id: string, request: Req): Promise<DataResponse<{
        file: FileDto;
        url: string;
    }>>;
    adminUpdate(payload: StudioUpdatePayload, id: string): Promise<DataResponse<Partial<IStudio>>>;
    addMember(payload: PerformerCreatePayload, currentStudio: StudioDto): Promise<DataResponse<Partial<PerformerDto>>>;
    removeMember(id: string, currentStudio: StudioDto): Promise<DataResponse<Partial<PerformerDto>>>;
    updateMemberStatus(id: string, payload: MemberSetActivePayload, currentStudio: StudioDto): Promise<DataResponse<Partial<PerformerDto>>>;
    updateMemberCommission(id: string, payload: UpdateCommissionPayload, currentStudio: StudioDto): Promise<DataResponse<import("../../performer/models").PerformerCommissionModel>>;
    stats(studio: StudioDto): Promise<DataResponse<{
        totalOnlineToday: any;
        totalHoursOnline: any;
        totalPerformer?: number;
        totalTokenEarned?: number;
        totalTokenSpent?: number;
    }>>;
}
