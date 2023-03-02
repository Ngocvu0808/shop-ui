import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFieldEditComponent } from './info-field-edit.component';

describe('InfoFieldEditComponent', () => {
  let component: InfoFieldEditComponent;
  let fixture: ComponentFixture<InfoFieldEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoFieldEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoFieldEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
