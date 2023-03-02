import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, Sort} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {NotifyService} from '../../../../../service/notify.service';
import {TranslateService} from '@ngx-translate/core';
import {PermissionService} from '../../../../../core/_common/permission.service';
import {PageEvent} from '@angular/material/paginator';
import {each, find} from 'lodash';
import {HelperService} from '../../../../../core/_common/helper/helper.service';
import {ServiceService} from '../../../../../service/service.service';
import {ApplicationService} from '../../../../../service/application.service';

@Component({
    selector: 'mar-service-add',
    templateUrl: './service-add.component.html',
    styleUrls: ['./service-add.component.scss']
})
export class ServiceAddComponent implements OnInit {

    displayedColumns: string[] = ['index', 'serviceName', 'system', 'description', 'tag', 'actions'];
    dataSource: Array<any> = [];
    page = 0;
    limit = 10;
    totalElement = 0;
    totalPage = 0;
    pageSizeOption: number[] = [5, 10, 25, 50, 100];
    searchValue: any = '';
    allLabel: any = '';
    // sort
    sortActive = '';
    sortDirection = '';
    canAccess: boolean = true;

    data: any;
    appID: any;
    listService: any;
    listServiceOld: any;

    systemValue: Array<any> = [];
    systemFilterList: Array<any> = [];
    systemFilterValue: Array<any> = [];

    constructor(
        private dialogRef: MatDialogRef<ServiceAddComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private fb: FormBuilder,
        private serviceService: ServiceService,
        private appService: ApplicationService,
        private notifyService: NotifyService,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef,
        private permissionService: PermissionService,
        private helperService: HelperService
    ) {
        this.data = data;
    }

    ngOnInit() {
        this.allLabel = 'Tất cả';
        this.getSystems();
        this.appID = this.data.appID;
        this.fetchData();
    }

    fetchData() {
        this.page = 0;
        this.getAll(1, this.limit);
    }

    getSystems() {
        this.serviceService.getSystems().subscribe(res => {
            if (res && res.status) {
                this.systemFilterList = res.data;
                this.systemFilterValue = this.systemFilterList.map(it => it.id);
                this.systemValue = this.systemFilterValue;
                this.cdr.markForCheck();
            }
        });
    }

    displaySystemFilter() {
        const systems: Array<any> = [];
        each(this.systemValue, id => {
            const system = find(this.systemFilterList, it => it.id === id);
            if (system) {
                systems.push(this.toTitleCase(system.name));
            }
        });
        return systems;
    }

    getAll(page: number, limit: number) {
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const req = {
            page: page,
            limit: limit,
            status: '',
            source: '',
            search: this.searchValue,
            sort: sortValue,
            systemIds: this.systemValue.length == this.systemFilterList.length ? '' : this.systemValue.join(','),
        };
        this.appService.getAllServiceNotSetting(this.appID, req).subscribe(res => {
            if (res) {
                if (res.status) {
                    var data = res.data.list;
                    this.totalPage = res.data.totalPage;
                    this.totalElement = res.data.num;
                    data.forEach((it) => {
                        it['installed'] = false;
                    });
                    this.dataSource = data;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    addItem(item) {
        const req = {service_id: item.id};
        try {
            this.appService.addService(this.appID, req).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ADD'));
                        item.installed = true;
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                    this.cdr.markForCheck();
                }
            });
        } catch (e) {
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_SUCCESS_ERROR'));
        }
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'APPROVED':
                return 'status-active';
            case 'REJECTED':
                return 'status-deactive';
            case 'REQUESTING':
                return 'status-pending';
        }
        return '';
    }

    onPageChange(event: PageEvent) {
        this.page = event.pageIndex;
        this.limit = event.pageSize;
        this.getAll(this.page + 1, this.limit);
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        this.fetchData();
    }

    close() {
        this.dialogRef.close();
    }

    toTitleCase(input) {
        return this.helperService.convertTitleCase(input);
    }

}
