import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultibatchComponent } from './multibatch.component';

describe('MultibatchComponent', () => {
  let component: MultibatchComponent;
  let fixture: ComponentFixture<MultibatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultibatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultibatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
