import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiRequestsListComponent } from './api-requests-list.component';

describe('ApiRequestsListComponent', () => {
  let component: ApiRequestsListComponent;
  let fixture: ComponentFixture<ApiRequestsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiRequestsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
