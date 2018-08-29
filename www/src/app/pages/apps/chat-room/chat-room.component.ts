import {
  Component, OnInit, ElementRef, Renderer2, AfterViewChecked, OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../services/LogService';

import { SIPService } from '../../../services/SIPService';
import { ChatMessage } from '../ChatMessage';
import { ChatRoomService } from './chat-room.service';
@Component({
  selector: 'app-apps-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  private messages: ChatMessage[];
  private chatMessageSub: Subscription;
  private inputMsg: string;
  private roomId: string;
  private roomIds: string[];
  private MSGs: any;
  private room$: Subscription;
  constructor(private el: ElementRef, private renderer: Renderer2, private route: ActivatedRoute,
    private chatRoomService: ChatRoomService,
    private router: Router, private logger: LoggerService, private sipClient: SIPService) {
    this.messages = [];
    this.inputMsg = '';
    this.roomIds = [];
    this.MSGs = {};
  }

  ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('id');
    this.roomId = roomId;
    this.messages = this.MSGs[`${roomId}`];
    this.room$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        of(params.get('id'))
      )
    )
      .subscribe(id => {
        this.logger.info(`路由变化，重新加载数据`);
        this.roomId = id;
        const index = this.roomIds.indexOf(id);
        if (index < 0) {
          this.roomIds.push(id);
          this.MSGs[`${id}`] = [];
        }
        this.messages = this.MSGs[`${id}`];
      });

    this.chatMessageSub = this.sipClient.getChatMessage().subscribe(this.handleChatMsg.bind(this));
  }

  ngOnDestroy() {
    // ...
    this.logger.debug('组件销毁chat-room');
    this.room$.unsubscribe();
    this.chatMessageSub.unsubscribe();
  }
  ngAfterViewChecked() {
    // this.logger.debug('ngAfterViewChecked');
    const divEl = this.el.nativeElement.querySelector('.direct-chat-messages');
    const el = new ElementRef(divEl);
    el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
    // console.log(el.nativeElement.scrollTop, el.nativeElement.scrollHeight);
    // el.nativeElement.scrollIntoView();
  }
  handleChatMsg(msg) {
    const { ua, method, body, request, localIdentity, remoteIdentity } = msg;
    const { uri, displayName } = remoteIdentity;
    const { scheme, user } = uri;
    console.log('msg:', msg);

    const roomId = user; // user是唯一的
    const index = this.roomIds.indexOf(roomId);
    if (index < 0) {
      this.roomIds.push(roomId);
      this.MSGs[`${roomId}`] = [];
    }
    const message = new ChatMessage('', body);
    message.from = user;
    this.MSGs[`${roomId}`].push(message);
    if (this.roomId === user) {
      this.logger.info(`Chat Room 接收消息:${body}`);
      this.messages = this.MSGs[`${roomId}`];
    }

  }
  onKey(event: any) { // without type info
    this.inputMsg += event.target.value + ' | ';
  }

  async onEnter() {
    try {
      await this.sendMsg();
    } catch (ex) {
      this.logger.error('onEnter Error:', ex);
    }
  }

  async sendMsg() {
    try {
      const remsg = await this.sipClient.sendMsg(this.roomId, this.inputMsg);
      const message = new ChatMessage('', remsg);
      message.from = 'me';
      this.messages.push(message);
      this.inputMsg = '';

    } catch (ex) {
      this.logger.error('Send Msg Error:', ex);
    }
  }

}
