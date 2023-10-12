import { TestBed } from '@angular/core/testing';

import { CommnetsService } from './commnets.service';

describe('CommnetsService', () => {
  let service: CommnetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommnetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
