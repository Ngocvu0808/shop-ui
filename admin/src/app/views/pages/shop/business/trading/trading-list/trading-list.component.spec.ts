import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingListComponent } from './trading-list.component';

describe('TradingListComponent', () => {
  let component: TradingListComponent;
  let fixture: ComponentFixture<TradingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
