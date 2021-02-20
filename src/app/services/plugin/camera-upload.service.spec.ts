import { TestBed } from '@angular/core/testing';

import { CameraUploadService } from './camera-upload.service';

describe('CameraUploadService', () => {
  let service: CameraUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
