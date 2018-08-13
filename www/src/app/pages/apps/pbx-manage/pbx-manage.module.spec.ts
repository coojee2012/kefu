import { PbxManageModule } from './pbx-manage.module';

describe('PbxManageModule', () => {
  let pbxManageModule: PbxManageModule;

  beforeEach(() => {
    pbxManageModule = new PbxManageModule();
  });

  it('should create an instance', () => {
    expect(pbxManageModule).toBeTruthy();
  });
});
