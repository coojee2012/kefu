import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxIvrComponent } from './pbx-ivr.component';

describe('PbxIvrComponent', () => {
  let component: PbxIvrComponent;
  let fixture: ComponentFixture<PbxIvrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxIvrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxIvrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
