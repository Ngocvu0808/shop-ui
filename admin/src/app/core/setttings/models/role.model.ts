import {BaseModel} from '../../_base/crud';

export class RoleModel extends BaseModel {
    id: number;
    role_name: string;
    role_id: string;
    date_create: string;

    clear() {
        this.id = 0;
        this.role_name = '';
        this.role_id = '';
        this.date_create = '';
    }
}
