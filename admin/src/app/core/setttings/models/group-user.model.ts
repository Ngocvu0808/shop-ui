import {BaseModel} from '../../_base/crud';

export class GroupUserModel extends BaseModel {
    id: number;
    username: string;
    display_name: string;
    email: string;
    user_role: number;
    user_group: string;
    status: number;

    clear() {
        this.id = 0;
        this.username = '';
        this.display_name = '';
        this.email = '';
        this.user_role = 0;
        this.user_group = '';
        this.status = 0;
    }
}
