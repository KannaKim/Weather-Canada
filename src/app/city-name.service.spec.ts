import { TestBed } from '@angular/core/testing';

import { CityNameService } from './city-name.service';

describe('CityNameService', () => {
  let service: CityNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
