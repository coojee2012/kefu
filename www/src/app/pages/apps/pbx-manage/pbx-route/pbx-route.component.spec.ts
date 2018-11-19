import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxRouteComponent } from './pbx-route.component';

describe('PbxRouteComponent', () => {
  let component: PbxRouteComponent;
  let fixture: ComponentFixture<PbxRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
