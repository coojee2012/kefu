import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFaqComponent } from './chat-faq.component';

describe('ChatFaqComponent', () => {
  let component: ChatFaqComponent;
  let fixture: ComponentFixture<ChatFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
