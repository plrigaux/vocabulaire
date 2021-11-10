import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectorDisplayTestComponent } from './corrector-display-test.component';

describe('CorrectorDisplayTestComponent', () => {
  let component: CorrectorDisplayTestComponent;
  let fixture: ComponentFixture<CorrectorDisplayTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectorDisplayTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectorDisplayTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
