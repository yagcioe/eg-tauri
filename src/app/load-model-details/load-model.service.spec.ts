import { TestBed } from '@angular/core/testing';

import { LoadModelService } from './load-model.service';

describe('LoadModelService', () => {
  let service: LoadModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
