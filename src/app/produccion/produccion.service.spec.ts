import { TestBed, inject } from '@angular/core/testing';

import { ProduccionService } from './produccion.service';

describe('ProduccionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProduccionService]
    });
  });

  it('should be created', inject([ProduccionService], (service: ProduccionService) => {
    expect(service).toBeTruthy();
  }));
});
