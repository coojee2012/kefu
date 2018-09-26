import {
  Component, OnInit, ElementRef, Renderer2, AfterViewChecked, OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { LoggerService } from '../../../services/LogService';

import { SIPService } from '../../../services/SIPService';
import { DataService, LiveChatMessage, Room } from '../../../services/DataService';
import { ChatMessage } from '../ChatMessage';
import { ChatRoomService } from './chat-room.service';
@Component({
  selector: 'app-apps-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  private tipMsg: string;
  private tipStyle: string;
  private messages: LiveChatMessage[];
  private chatMessageSub: Subscription;
  private inputMsg: string;
  private roomId: string;
  private customerId: string;
  private roomIds: string[];
  private MSGs: any;
  private roomId$: Subscription;
  private room: Room;
  private roomSub: Subscription;
  private memu: string;
  private newMsgIn: boolean; // 用于控制聊天窗口滚动到底部
  constructor(private el: ElementRef, private renderer: Renderer2, private route: ActivatedRoute,
    private chatRoomService: ChatRoomService, private dataService: DataService,
    private router: Router, private logger: LoggerService, private sipClient: SIPService) {
    this.messages = [];
    this.inputMsg = '';
    this.roomIds = [];
    this.MSGs = {};
    this.memu = 'order';
    this.newMsgIn = false;
  }

  ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('id');
    this.roomId = roomId;
    this.chatMessageSub = this.dataService.LiveChatMsg$
      .pipe()
      .subscribe(this.handleChatMsg.bind(this));

    this.roomSub = this.dataService.LiveChatMsg$
      .pipe()
      .subscribe(this.handleRoomChange.bind(this));

    this.roomId$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        of(params.get('id'))
      )
    )
      .subscribe(id => {
        this.logger.info(`路由变化，重新加载数据`);
        this.roomId = id;
        this.messages = [];
        this.chatMessageSub.unsubscribe();
        this.roomSub.unsubscribe();

        this.roomSub = this.dataService.Room$
          .pipe()
          .subscribe(this.handleRoomChange.bind(this));

        this.chatMessageSub = this.dataService.LiveChatMsg$
          .pipe()
          .subscribe(this.handleChatMsg.bind(this));
      });

    // 操作消息提醒
    this.chatRoomService.tip$.subscribe((tip) => {
      this.logger.debug('tip', tip);
      this.tipMsg = tip.message;
      this.tipStyle = tip.style;
    });
    this.chatRoomService.tip$.pipe(
      debounceTime(5000)
    ).subscribe(() => {
      this.logger.debug('tip debouce');
      this.tipMsg = '';
      this.tipStyle = '';
    });

  }

  ngOnDestroy() {
    // ...
    this.logger.debug('组件销毁chat-room');
    this.roomId$.unsubscribe();
    this.chatMessageSub.unsubscribe();
    this.roomSub.unsubscribe();
  }
  ngAfterViewChecked() {
    if (this.newMsgIn) {
      const divEl = this.el.nativeElement.querySelector('.direct-chat-messages');
      const el = new ElementRef(divEl);
      el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
      this.newMsgIn = false;
      // console.log(el.nativeElement.scrollTop, el.nativeElement.scrollHeight);
      // el.nativeElement.scrollIntoView();
    }

  }
  handleChatMsg(msg: LiveChatMessage) {
    this.logger.debug('handle chat msg ', msg.rid, this.roomId);
    if (msg.rid === this.roomId) {
      this.messages.push(msg);
      this.newMsgIn = true;
    }

  }

  handleRoomChange(room: Room) {
    this.logger.debug('handle room  change ', room.id, this.roomId, room);
    if (room.id === this.roomId) {
      this.room = room;
      this.customerId = room.customer;
    }
  }
  onKey(event: any) { // without type info
    this.inputMsg += event.target.value + ' | ';
  }

  action(memu: string) {
    this.memu = memu;
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
      const remsg = await this.sipClient.sendMsg(this.roomId, this.room.user, this.inputMsg);
      const message = {
        rid: this.roomId,
        from: 'me',
        msg: remsg,
        ts: new Date().getTime(),
        t: 'text'
      };
      this.messages.push(message);
      this.newMsgIn = true;
      this.inputMsg = '';

    } catch (ex) {
      this.logger.error('Send Msg Error:', ex);
    }
  }

}
