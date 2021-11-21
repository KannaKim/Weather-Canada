import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WeatherDataService } from './weather-data.service';
import { Historical5day } from './WeatherDataForm/historical-5day';

describe('WeatherDataService', () => {
  let service
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherDataService]
    });
    service = TestBed.inject(WeatherDataService);
  });
  it('should execute', () => {
    expect(service.sayHi()).toContain("hi")
  })
  it('should work', () => {
    service.getHistorical5dWeatherData(49.84,-100.93,Date.now()/1000).subscribe((data:Historical5day)=>
      expect(data).not.toContain(null)
    )
  });
});
