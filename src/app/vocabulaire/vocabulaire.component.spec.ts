import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabulaireComponent } from './vocabulaire.component';

describe('VocabulaireComponent', () => {
  let component: VocabulaireComponent;
  let fixture: ComponentFixture<VocabulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VocabulaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
