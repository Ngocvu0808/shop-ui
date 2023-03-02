import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of, Subject } from 'rxjs';

import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NgZorroAntdModule } from '../../../../../ng-zorro-antd.module';
import { NzOptionComponent } from 'ng-zorro-antd';

import { UserAddComponent } from './user-add.component';
import { ChangeDetectorRef } from '@angular/core';
import { ApplicationService } from '../../../../../service/application.service';
import { RoleService } from '../../../../../service/role.service';
import { GroupService } from '../../../../../service/group.service';
import { NotifyService } from '../../../../../service/notify.service';
import TranslatePipeStub from '../../../../../test/translate-pipe.stub';
import TranslateServiceStub from '../../../../../test/translate-service.stub';


interface ApplicationServiceSpy {
    addUser: jasmine.Spy;
}

interface RoleServiceSpy {
    getAllRoleByObjectCode: jasmine.Spy;
}

interface GroupServiceSpy {
    getAllUserAndGroup: jasmine.Spy;
}

interface NotifyServiceSpy {
    notify: jasmine.Spy;
}

describe('UserAddComponent', () => {
    let component: UserAddComponent;
    let fixture: ComponentFixture<UserAddComponent>;
    let appServiceSpy: ApplicationServiceSpy;
    let roleServiceSpy: RoleServiceSpy;
    let groupServiceSpy: GroupServiceSpy;
    let notifyServiceSpy: NotifyServiceSpy;
    let appService: ApplicationService;
    let roleService: RoleService;
    let groupService: GroupService;
    let notifyService: NotifyService;
    let translateService: TranslateService;

    const serviceResponseStub = {
        status: true,
        message: 'success',
        httpCode: 302,
        data: [
            {
                id: 6,
                name: '123 456',
                username: 'random',
                email: 'hehe@gmail.com',
                type: 'USER',
            },
        ],
        errorCode: 'ok',
    };

    const dataStub = { appId: '1', listUserId: [] };

    beforeEach(async(() => {
        appServiceSpy = jasmine.createSpyObj('appService', ['addUser']);
        roleServiceSpy = jasmine.createSpyObj('roleService', ['getAllRoleByObjectCode']);
        groupServiceSpy = jasmine.createSpyObj('groupService', ['getAllUserAndGroup']);
        notifyServiceSpy = jasmine.createSpyObj('notifyService', ['notify']);

        TestBed.configureTestingModule({
            declarations: [UserAddComponent, TranslatePipeStub],
            imports: [
                MatDialogModule,
                ReactiveFormsModule,
                NgZorroAntdModule,
                MatCheckboxModule,
                TranslateModule.forRoot(),
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: ApplicationService, useValue: appServiceSpy },
                { provide: RoleService, useValue: roleServiceSpy },
                { provide: NotifyService, useValue: notifyServiceSpy },
                { provide: GroupService, useValue: groupServiceSpy },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                ChangeDetectorRef,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserAddComponent);
        component = fixture.componentInstance;

        translateService = TestBed.get(TranslateService);
        appService = TestBed.get(ApplicationService);
        roleService = TestBed.get(RoleService);
        groupService = TestBed.get(GroupService);
        notifyService = TestBed.get(NotifyService);

        component.data = dataStub;
        roleServiceSpy.getAllRoleByObjectCode.and.returnValue(of(serviceResponseStub));
        groupServiceSpy.getAllUserAndGroup.and.returnValue(of(serviceResponseStub));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('class test', () => {
        describe('#onSearch()', () => {
            let input: string
            const options = new NzOptionComponent()
            options.nzValue = { name: 'name có dấu', username: 'username có dấu', email: 'email có dấu' }
            describe('when input is irrelevant of name, username and email', () => {
                it('returns false', () => {
                    input = 'irrelevent string'
                    expect(component.onSearch(input, options)).toBe(false)
                });
            });

            describe('when user is searched by name', () => {
                it('returns false when name doesnt match', () => {
                    input = 'wrong name'
                   expect(component.onSearch(input, options)).toBe(false)
                });

                it('returns true when name matches', () => {
                    input = 'amecó'
                    expect(component.onSearch(input, options)).toBe(true)
                });
            });

            describe('when user is searched by username', () => {
                it('returns false when username doesnt match', () => {
                    input = 'wrong username'
                    expect(component.onSearch(input, options)).toBe(false)
                });

                it('returns true when username matches', () => {
                    input = 'sernamecó'
                    expect(component.onSearch(input, options)).toBe(true)
                });
            });

            describe('when user is searched by email', () => {
                it('returns false when email doesnt match', () => {
                    input = 'wrong email'
                    expect(component.onSearch(input, options)).toBe(false)
                });

                it('returns true when email matches', () => {
                    input = 'ailcó'
                    expect(component.onSearch(input, options)).toBe(true)
                });
            });
        });
    });

    describe('DOM test', () => {});
});
