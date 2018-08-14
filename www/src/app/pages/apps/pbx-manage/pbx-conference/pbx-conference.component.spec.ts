import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxConferenceComponent } from './pbx-conference.component';

describe('PbxConferenceComponent', () => {
  let component: PbxConferenceComponent;
  let fixture: ComponentFixture<PbxConferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxConferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
