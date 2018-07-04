import { Component, OnInit, ElementRef, Renderer2 , AfterViewChecked
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoggerService } from '../../../services/LogService';

import { SIPService } from '../../../services/SIPService';
import { ChatMessage } from '../ChatMessage';
@Component({
  selector: 'app-apps-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
  private messages: ChatMessage[];
  private chatMessageSub: Subscription;
  private inputMsg: string;
  constructor(private el: ElementRef, private renderer: Renderer2,
    private router: Router, private logger: LoggerService, private sipClient: SIPService) {
    this.messages = [];
    this.inputMsg = '';
  }

  ngOnInit() {
    this.chatMessageSub = this.sipClient.getChatMessage().subscribe(this.handleChatMsg.bind(this));
  }
  ngAfterViewChecked() {
    // this.logger.debug('ngAfterViewChecked');
    const divEl = this.el.nativeElement.querySelector('.direct-chat-messages');
    const el = new ElementRef(divEl);
    el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
    console.log(el.nativeElement.scrollTop, el.nativeElement.scrollHeight);
    // el.nativeElement.scrollIntoView();
  }
  handleChatMsg(msg) {
    const { ua, method, body, request, localIdentity, remoteIdentity } = msg;
    const { uri, displayName } = remoteIdentity;
    this.logger.info(`Chat Room 接收消息:${body}`);
    const { scheme, user } = uri;
    const message = new ChatMessage('', body);
    message.from = user;
    this.messages.push(message);
  }
  onKey(event: any) { // without type info
    this.inputMsg += event.target.value + ' | ';
  }
  async sendMsg() {
    try {
      await this.sipClient.sendMsg(this.inputMsg);
      const message = new ChatMessage('', this.inputMsg);
      message.from = 'me';
      this.messages.push(message);
      this.inputMsg = '';

    } catch (ex) {
      this.logger.error('Send Msg Error:', ex);
    }
  }

}
