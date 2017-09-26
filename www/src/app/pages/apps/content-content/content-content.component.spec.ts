import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentContentComponent } from './content-content.component';

describe('ContentContentComponent', () => {
  let component: ContentContentComponent;
  let fixture: ComponentFixture<ContentContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
