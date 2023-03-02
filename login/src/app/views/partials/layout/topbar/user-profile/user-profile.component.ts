// Angular
import {Component, Input, OnInit} from '@angular/core';
// RxJS
import {Observable} from 'rxjs';

@Component({
    selector: 'kt-user-profile',
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
    // Public properties
    user$: Observable<any>;

    @Input() avatar = true;
    @Input() greeting = true;
    @Input() badge: boolean;
    @Input() icon: boolean;

    /**
     * Component constructor
     *
     */
    constructor() {
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
    }

    /**
     * Log out
     */
    logout() {
    }
}
