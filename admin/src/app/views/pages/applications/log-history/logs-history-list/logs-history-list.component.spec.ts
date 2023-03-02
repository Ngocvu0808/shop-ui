import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsHistoryListComponent } from './logs-history-list.component';

describe('LogsHistoryListComponent', () => {
  let component: LogsHistoryListComponent;
  let fixture: ComponentFixture<LogsHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
