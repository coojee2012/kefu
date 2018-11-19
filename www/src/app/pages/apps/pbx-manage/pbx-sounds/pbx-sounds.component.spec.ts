import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxSoundsComponent } from './pbx-sounds.component';

describe('PbxSoundsComponent', () => {
  let component: PbxSoundsComponent;
  let fixture: ComponentFixture<PbxSoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxSoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxSoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
