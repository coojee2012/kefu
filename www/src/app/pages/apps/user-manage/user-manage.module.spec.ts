import { UserManageModule } from './user-manage.module';

describe('UserManageModule', () => {
  let userManageModule: UserManageModule;

  beforeEach(() => {
    userManageModule = new UserManageModule();
  });

  it('should create an instance', () => {
    expect(userManageModule).toBeTruthy();
  });
});
