import {MatDialog} from '@angular/material';
import {NotifyService} from '../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {RoleDetailComponent} from '../../views/pages/users/role/role-detail/role-detail.component';
import {RoleService} from '../../service/role.service';

export function viewRoleDetail(id: any,
                               dialog: MatDialog,
                               roleService: RoleService,
                               notifyService: NotifyService,
                               translate: TranslateService) {
    try {
        roleService.getById(id).subscribe(res => {
            if (res && res.status) {
                const data = res.data;
                const dialogRef = dialog.open(RoleDetailComponent, {
                    data: {element: data},
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe(response => {
                    if (!response) {
                        return;
                    }
                });
            }
        });
    } catch (e) {
        console.log(e);
        notifyService.notify('ERROR', '', translate.instant('USER.USER_MANAGE.ERROR_MSG'));
    }
}
