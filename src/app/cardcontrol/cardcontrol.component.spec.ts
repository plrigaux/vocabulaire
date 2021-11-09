import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardcontrolComponent } from './cardcontrol.component';

describe('CardcontrolComponent', () => {
  let component: CardcontrolComponent;
  let fixture: ComponentFixture<CardcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardcontrolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
