import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFieldsListComponent } from './info-fields-list.component';

describe('InfoFieldsListComponent', () => {
  let component: InfoFieldsListComponent;
  let fixture: ComponentFixture<InfoFieldsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoFieldsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoFieldsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
