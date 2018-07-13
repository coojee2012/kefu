import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'angular-admin-lte';
import { LoggerService } from '../../services/LogService';
import { DeepStreamService } from '../../services/DeepStreamService';
import { SIPService } from '../../services/SIPService';
import { ChatRoom } from './ChatRoom';

import { Subscriber, Subscription } from 'rxjs';
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {
  private chatRooms: ChatRoom[];
  private chatRoomIds: string[];
  private chatMessageSub: Subscription;
  public customLayout: boolean;
  constructor(private router: Router, private logger: LoggerService,
     private dsClient: DeepStreamService, private sipClient: SIPService, private layoutService: LayoutService) {
    this.chatRoomIds = [];
    this.chatRooms = [];
  }
  ngOnInit() {
    this.logger.log('测试LoggerService');
    this.layoutService.isCustomLayout.subscribe((value: boolean) => {
      this.customLayout = value;
    });
    setTimeout(() => {
      this.router.navigate(['/app/dashbord']);
    }, 500);
    // this.dsClient.login(null, this.loginHandler.bind(this));
    this.sipClient.init();
    this.chatMessageSub = this.sipClient.getChatMessage().subscribe(this.handleChatMsg.bind(this));
    // this.sipClient.client.on('message', this.handleChatMsg.bind(this));
  }

  handleChatMsg(msg) {
    const { ua, method, body, request, localIdentity, remoteIdentity } = msg;
    const { uri, displayName } = remoteIdentity;
    this.logger.info(`${method} ROOM From ${uri.toString()} - ${displayName} 接收消息:${body}`);
    const { scheme , user } = uri;
    const index = this.chatRoomIds.indexOf(user);
   // this.logger.debug('aaaaaa', uri.toString(), uri.scheme , uri.user);

    if (index > -1) {
      this.logger.debug(`已经存在该房间,当前房间数:${this.chatRoomIds.length}`);
      this.chatRooms[index].addMsg('', body);
    } else {
      this.chatRoomIds.push(user);
      const room = new ChatRoom(user);
      room.addMsg('', body);
      this.chatRooms.push(room);
    }
  }
  loginHandler(success, data) {
    this.logger.debug('logged in', success, data);
  }

}
