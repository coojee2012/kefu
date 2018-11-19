import { TestBed, inject } from '@angular/core/testing';

import { UserManageService } from './user-manage.service';

describe('UserManageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserManageService]
    });
  });

  it('should be created', inject([UserManageService], (service: UserManageService) => {
    expect(service).toBeTruthy();
  }));
});
