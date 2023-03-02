import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiRequestDetailComponent } from './api-request-detail.component';

describe('ApiRequestDetailComponent', () => {
  let component: ApiRequestDetailComponent;
  let fixture: ComponentFixture<ApiRequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiRequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
