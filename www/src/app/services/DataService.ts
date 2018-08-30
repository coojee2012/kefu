/**
 * 用于共享数据
 */
import { Injectable, Injector } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { MyReplaySubject } from '../utils/MyRelaySubject';

import { LoggerService } from './LogService';
import { SIPService } from './SIPService';
import { environment } from '../../environments/environment';


@Injectable()
export class DataService {
    RoomSource: MyReplaySubject<Room>;
    Room$: Observable<Room>;
    private rooms: string[];
    LiveChatMsgSource: MyReplaySubject<LiveChatMessage>;
    LiveChatMsg$: Observable<LiveChatMessage>;
    constructor(private logger: LoggerService, private sipClient: SIPService) {

        this.rooms = [];
        this.RoomSource = new MyReplaySubject<Room>();
        this.Room$ = this.RoomSource.asObservable();
        this.LiveChatMsgSource = new MyReplaySubject<LiveChatMessage>();
        this.LiveChatMsg$ = this.LiveChatMsgSource.asObservable();
        // this.initRooms();
        this.initSipMsg();
    }

    // 用户登录时，初始化用户尚未关闭
    // 如果房间类型为webchat，拉取最近50条聊天内容
    initRooms(tenantId: string, userId: string) {

    }
    // 初始化接受SIP消息
    initSipMsg() {
        const message$ = this.sipClient.getChatMessage();
        const sub: Subscription = message$
            .subscribe(this.handleSIPMsg.bind(this));
    }

    handleSIPMsg(msg: any) {

        const { ua, method, body, request, localIdentity, remoteIdentity } = msg;
        const { uri, displayName } = remoteIdentity;
        const { scheme, user } = uri;
        this.logger.debug('user', user);
        const msgType = request.getHeader('X-Message-Type');
        if (msgType === 'livechat') {
            const roomId = request.getHeader('X-Session-Id');
            this.logger.debug(`new livechat roomId:${roomId}`);
            const index = this.rooms.indexOf(roomId);
            if (index < 0) {
                this.rooms.push(roomId);
                this.RoomSource.next({
                    id: roomId,
                    user: user,
                    userName: `访客-${this.rooms.length + 1}`,
                    status: 0,
                    ts: new Date().getTime(),
                    t: 'livechat'
                });
            }

            this.LiveChatMsgSource.next({
                rid: roomId,
                msg: body,
                from: user,
                ts: new Date().getTime(),
                t: 'text'
            });

        }
    }

}

export interface Room {
    id: string;
    user: string; // 访客
    userName: string; //
    msgs?: number; // 文字消息数量
    unread?: number; // 未读消息数
    status: number; // 1 会话中  2 已经结束会话（在列表显示X，可关闭）  0 已关闭（在客户端显示不出来理论上不存在于客户端）
    ts: number; // 创建时间
    t: string; // 类型  livechat  phone email wechat ios andirod
}

export interface LiveChatMessage {
    rid: string;
    msg: string;
    from?: string;
    ts: number; // 创建时间
    t: string; // 类型  text  picture voice
}
