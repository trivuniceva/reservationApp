import { TestBed } from '@angular/core/testing';

import { SpecialPriceService } from './special-price.service';

describe('SpecialPriceService', () => {
  let service: SpecialPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
