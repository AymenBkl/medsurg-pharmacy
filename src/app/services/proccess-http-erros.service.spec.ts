import { TestBed } from '@angular/core/testing';

import { ProccessHttpErrosService } from './proccess-http-erros.service';

describe('ProccessHttpErrosService', () => {
  let service: ProccessHttpErrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProccessHttpErrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
