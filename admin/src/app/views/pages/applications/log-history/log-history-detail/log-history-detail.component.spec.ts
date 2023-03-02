import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogHistoryDetailComponent } from './log-history-detail.component';

describe('LogHistoryDetailComponent', () => {
  let component: LogHistoryDetailComponent;
  let fixture: ComponentFixture<LogHistoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogHistoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
