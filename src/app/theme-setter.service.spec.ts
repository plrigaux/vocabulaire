import { TestBed } from '@angular/core/testing';

import { ThemeSetterService } from './theme-setter.service';

describe('ThemeSetterService', () => {
  let service: ThemeSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
