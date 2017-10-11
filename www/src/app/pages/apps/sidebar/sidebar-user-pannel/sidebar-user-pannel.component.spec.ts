import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarUserPannelComponent } from './sidebar-user-pannel.component';

describe('SidebarUserPannelComponent', () => {
  let component: SidebarUserPannelComponent;
  let fixture: ComponentFixture<SidebarUserPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarUserPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarUserPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
