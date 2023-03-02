import {BaseModel} from '../../_base/crud';

export class ConfigModel extends BaseModel {
    id: string;
    value: string;
    note: string;
    date_create: string;
    user_create: string;

    clear() {
        this.id = '';
        this.value = '';
        this.note = '';
        this.date_create = '';
        this.user_create = '';
    }
}
