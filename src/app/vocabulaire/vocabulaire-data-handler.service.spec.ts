import { TestBed } from '@angular/core/testing';

import { VocabulaireDataHandlerService } from './vocabulaire-data-handler.service';

describe('VocabulaireDataHandlerService', () => {
  let service: VocabulaireDataHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabulaireDataHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
