import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { NotifyService } from '../../../../../service/notify.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../../../service/application.service';

@Component({
    selector: 'mar-access-tokens-list',
    templateUrl: './access-tokens-list.component.html',
    styleUrls: ['./access-tokens-list.component.scss']
})
export class AccessTokensListComponent implements OnInit, OnChanges {

    displayedColumns: string[] = ['index', 'accessToken', 'refreshToken', 'createDate', 'IP', 'timeOut', 'status', 'actions'];
    dataSource = [];
    searchValue: string = '';
    allLabel: any;

    filterStatus: Array<any> = [];
    statusValue: any;
    // sort
    sortActive = '';
    sortDirection = '';
    appId: any = 0;

    @Input() isActiveTab: number;
    loading: boolean = false;

    constructor(public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private translate: TranslateService,
        private appService: ApplicationService,
        public cdr: ChangeDetectorRef,
        private notifyService: NotifyService,
        private route: ActivatedRoute) {
        this.statusValue = '';
        this.allLabel = 'Tất cả';
        this.appId = this.route.snapshot.paramMap.get('id');
        this.cdr.markForCheck();
    }

    ngOnChanges() {
        if (this.isActiveTab == 3) {
            this.getStatusFilter();
            this.fetchData();
        }
    }

    ngOnInit() {
    }

    fetchData() {
        this.getAll();
    }

    getStatusFilter() {
        this.appService.getStatusList().subscribe(res => {
            if (res && res.status) {
                this.filterStatus = res.data;
                this.cdr.markForCheck();
            }
        });
    }

    getAll() {
        this.loading = true
        let sortValue = '';
        if (this.sortActive != '' && this.sortDirection != '') {
            sortValue = this.sortActive + '_' + this.sortDirection;
        }
        const req = {
            status: this.statusValue
        };
        this.appService.getListAccessTokenOfApp(this.appId, req).subscribe(res => {
            if (res) {
                if (res.status) {
                    this.dataSource = res.data;
                    this.loading = false;
                    this.cdr.markForCheck();
                }
            }
        });
    }

    disconnect(id: any) {
        try {
            this.appService.rejectAccessToken(id).subscribe(res => {
                if (res) {
                    if (res.status) {
                        this.notifyService.notify('SUCCESS', '', this.translate.instant('COMMON.CHANGE_STATUS_SUCCESS'));
                        this.getAll();
                        return;
                    }
                    if (res.httpCode != 403) {
                        this.notifyService.notify('WARN', '', res.message);
                    }
                }
            });
        } catch (e) {
            console.log(e);
            this.notifyService.notify('ERROR', '', this.translate.instant('COMMON.MESSAGE_ERROR'));
        }
    }

    getItemCssClassByStatus(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'status-active';
            case 'EXPIRED':
                return 'status-expired';
            case 'REJECTED':
                return 'status-deactive';
        }
        return '';
    }

    onSortChange(event: Sort) {
        this.sortActive = event.active;
        this.sortDirection = event.direction;
        // this.fetchData();
    }

}
