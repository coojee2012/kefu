import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxMemuComponent } from './pbx-memu.component';

describe('PbxMemuComponent', () => {
  let component: PbxMemuComponent;
  let fixture: ComponentFixture<PbxMemuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxMemuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxMemuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
