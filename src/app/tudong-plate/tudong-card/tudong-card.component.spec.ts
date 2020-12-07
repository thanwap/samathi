import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TudongCardComponent } from './tudong-card.component';

describe('TudongCardComponent', () => {
  let component: TudongCardComponent;
  let fixture: ComponentFixture<TudongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TudongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TudongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
