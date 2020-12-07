import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TudongItemComponent } from './tudong-item.component';

describe('TudongItemComponent', () => {
  let component: TudongItemComponent;
  let fixture: ComponentFixture<TudongItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TudongItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TudongItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
