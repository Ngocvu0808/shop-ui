import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatCheckboxChange, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {NotifyService} from '../../../../../service/notify.service';
import {SelectionModel} from '@angular/cdk/collections';
import {GroupService} from '../../../../../service/group.service';

@Component({
    selector: 'kt-user-add-to-group',
    templateUrl: './add-user-to-group.component.html',
    styleUrls: ['./add-user-to-group.component.scss']
})
export class AddUserToGroupComponent implements OnInit {

    displayedColumns: string[] = ['select', 'display_name', 'user_name', 'email'];
    // users: any = [];
    groupId: any = '';
    data: any = '';
    inputSearch: any = '';
    users: any = '';
    // Checkbox Table
    selection = new SelectionModel<any>(true, []);
    selected: Array<any> = [];
    isCheckAll: boolean = false;
    allUserId: Array<any> = [];
    groupUserIds: Array<any> = [];

    countUnSelect: number = 0;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private groupService: GroupService,
        private cdr: ChangeDetectorRef,
        private notifyService: NotifyService,
        private dialogRef: MatDialogRef<AddUserToGroupComponent>,
        @Inject(MAT_DIALOG_DATA) data,
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.groupId = this.data.group_id;
        this.groupUserIds = this.data.user_ids;
        this.getListUserGroup();
        this.cdr.detectChanges();
    }

    onMasterChange($event: MatCheckboxChange) {
        this.isCheckAll = $event.checked;
        this.allUserId = [];
        if ($event.checked) {
            this.countUnSelect = 0;
            this.users.forEach(row => {
                this.selection.select(row);
            });
            this.users.map(user => {
                this.allUserId.push(user.id);
            });
        } else {
            this.selection.clear();
            this.selected = [];
            this.countUnSelect = this.users.length;
        }
    }

    onCheckboxChange($event: MatCheckboxChange, row: any) {
        if ($event) {
            this.selection.toggle(row);
            const set = new Set(this.selected);
            if ($event.checked) {
                // add to list checked
                set.add(row.id);
                this.countUnSelect--;
                if (this.countUnSelect == 0) {
                    this.isCheckAll = true;
                }
            } else {
                //remove from list checked
                set.delete(row.id);
                this.countUnSelect++;
                if (this.isCheckAll) {
                    this.isCheckAll = false;
                }
            }
            this.selected = Array.from(set);
        }
    }

    search() {
        const search = this.inputSearch;
        const text = search.split(' ');
        const result = this.users.filter(function(item) {
            return text.every(function(el) {
                return item.name.indexOf(el) > -1;
            });
        });
        this.users = result.length > 0 ? result : this.users;
    }

    addUserToGroup() {
        if (this.selected.length == 0 && this.allUserId.length == 0) {
            this.notifyService.notify('WARN', '', 'Bạn chưa chọn user');
            return;
        }
        const req = {
            listUserId: this.allUserId.length > 0 ? this.allUserId : this.selected,
        };
        try {
            this.groupService.addUsers(this.groupId,req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', 'Thêm user thành công');
                        this.dialogRef.close({response: res, ids: req.listUserId});
                        return;
                    }
                    if (res.httpCode && res.httpCode == 409) {
                        this.notifyService.notify('WARN', '', 'User đã tồn tại trong nhóm');
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            this.notifyService.notify('ERROR', '', 'Có lỗi xảy ra');
        }
    }

    close() {
        this.dialogRef.close();
    }

    getListUserGroup() {

        this.groupService.getAllUserAndGroup('user').subscribe(res => {
            if (res && res.status) {
                this.users = res.data.filter((it: any) => !this.groupUserIds.includes(it.id));
                this.cdr.markForCheck();
            }
        });
    }
}
