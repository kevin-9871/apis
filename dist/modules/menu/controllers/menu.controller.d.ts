import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { MenuService, MenuSearchService } from '../services';
import { MenuCreatePayload, MenuUpdatePayload, MenuSearchRequestPayload } from '../payloads';
import { MenuDto, IMenuResponse } from '../dtos';
export declare class AdminMenuController {
    private readonly menuService;
    private readonly menuSearchService;
    constructor(menuService: MenuService, menuSearchService: MenuSearchService);
    create(payload: MenuCreatePayload): Promise<DataResponse<MenuDto>>;
    update(id: string, currentUser: UserDto, payload: MenuUpdatePayload): Promise<DataResponse<MenuDto>>;
    delete(id: string): Promise<DataResponse<boolean>>;
    search(req: MenuSearchRequestPayload): Promise<DataResponse<PageableData<IMenuResponse>>>;
    userSearch(req: MenuSearchRequestPayload): Promise<DataResponse<PageableData<IMenuResponse>>>;
    details(id: string): Promise<DataResponse<MenuDto>>;
}
