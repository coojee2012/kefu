import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxQueueComponent } from './pbx-queue.component';

describe('PbxQueueComponent', () => {
  let component: PbxQueueComponent;
  let fixture: ComponentFixture<PbxQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
