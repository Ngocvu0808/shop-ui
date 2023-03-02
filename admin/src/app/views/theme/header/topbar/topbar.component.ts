// Angular
import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUrl } from 'system-navigator/lib/models';
import { TopbarService } from './topbar.service';

@Component({
    selector: 'kt-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {

    @HostBinding('class') classes = 'kt-header__topbar kt-grid__item';
    inputAppUrls: Observable<AppUrl[]>;

    constructor(private topbarService: TopbarService) {
        this.inputAppUrls = this.getUrls();
    }

    getUrls(): Observable<AppUrl[]> {
        return this.topbarService.getUrls('SYSTEM_NAVIGATORS', '');
    }
}
