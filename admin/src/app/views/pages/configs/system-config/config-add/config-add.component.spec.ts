import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAddComponent } from './config-add.component';

describe('ConfigEditComponent', () => {
  let component: ConfigAddComponent;
  let fixture: ComponentFixture<ConfigAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
