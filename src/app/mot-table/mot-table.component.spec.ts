import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotTableComponent } from './mot-table.component';

describe('MotTableComponent', () => {
  let component: MotTableComponent;
  let fixture: ComponentFixture<MotTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
