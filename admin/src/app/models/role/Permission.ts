import {SysPermission} from './SysPermission';

export class Permission {
	objectCode: string;
	objectName: string;
	service: string;
	sysPermissions: Array<SysPermission>;
}
