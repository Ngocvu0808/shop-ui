import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGetApiKeyComponent } from './app-get-api-key.component';

describe('AppGetApiKeyComponent', () => {
  let component: AppGetApiKeyComponent;
  let fixture: ComponentFixture<AppGetApiKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGetApiKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGetApiKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
