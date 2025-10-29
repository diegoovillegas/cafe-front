import { TestBed } from '@angular/core/testing';

import { AapiService } from './aapi.service';

describe('AapiService', () => {
  let service: AapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
