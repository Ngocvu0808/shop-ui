import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessTokensListComponent } from './access-tokens-list.component';

describe('AccessTokensListComponent', () => {
  let component: AccessTokensListComponent;
  let fixture: ComponentFixture<AccessTokensListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessTokensListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessTokensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
