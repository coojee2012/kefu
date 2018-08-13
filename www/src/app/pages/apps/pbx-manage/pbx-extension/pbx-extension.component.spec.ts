import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxExtensionComponent } from './pbx-extension.component';

describe('PbxExtensionComponent', () => {
  let component: PbxExtensionComponent;
  let fixture: ComponentFixture<PbxExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
