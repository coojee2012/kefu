import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-order',
  templateUrl: './chat-order.component.html',
  styleUrls: ['./chat-order.component.css']
})
export class ChatOrderComponent implements OnInit {

  private memu: string;
  constructor() {
    this.memu = 'list';
  }

  ngOnInit() {
  }

  action(memu: string) {
    this.memu = memu;
  }

}
