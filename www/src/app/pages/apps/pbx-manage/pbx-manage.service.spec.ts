import { TestBed, inject } from '@angular/core/testing';

import { PbxManageService } from './pbx-manage.service';

describe('PbxManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PbxManageService]
    });
  });

  it('should be created', inject([PbxManageService], (service: PbxManageService) => {
    expect(service).toBeTruthy();
  }));
});
