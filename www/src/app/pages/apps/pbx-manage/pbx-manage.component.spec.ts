import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxManageComponent } from './pbx-manage.component';

describe('PbxManageComponent', () => {
  let component: PbxManageComponent;
  let fixture: ComponentFixture<PbxManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
