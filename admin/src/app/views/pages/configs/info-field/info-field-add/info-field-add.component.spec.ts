import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFieldAddComponent } from './info-field-add.component';

describe('InfoFieldAddComponent', () => {
  let component: InfoFieldAddComponent;
  let fixture: ComponentFixture<InfoFieldAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoFieldAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoFieldAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
