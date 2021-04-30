import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWhsComponent } from './change-whs.component';

describe('ChangeWhsComponent', () => {
  let component: ChangeWhsComponent;
  let fixture: ComponentFixture<ChangeWhsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeWhsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeWhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
