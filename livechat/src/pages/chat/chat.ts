import { Component, OnInit, NgZone } from '@angular/core';
import { App, PopoverController } from 'ionic-angular';
import { ChatContentPage } from '../chat-content/chat-content';
import { ChatPopoverPage } from '../chat-popover/chat-popover';
import { FriendAddPage } from '../friend-add/friend-add';
import { FriendListPage } from '../friend-list/friend-list';
import { MsgService } from '../../services/msg';
import { BackEnd } from '../../providers/backend';

import { Subscription } from 'rxjs';
import { clone, getDiff } from '../../utils/utils';


@Component({
	selector: 'cy-chat-page',
	templateUrl: 'chat.html',
})
export class ChatPage implements OnInit {
	private timer;
	chatList: any[] = [];

	private connectState: number = 0;
	private subscriptions = new Subscription();

	constructor(
		private zone: NgZone,
		private appCtrl: App,
		private popoverCtrl: PopoverController,
		private msgService: MsgService,
		private backEnd: BackEnd,
	) {

	}

	ngOnInit() {

		//连接状态
		this.subscriptions.add(

			this.backEnd.state$.subscribe((state) => {
				this.connectState = state;
			})

		);

		this.subscriptions.add(
			this.msgService.chatList$.subscribe(
				chatList => {
					this.chatList = chatList;
					this.updateDiff();
				}
			)
		);

		this.timer = setInterval(() => {
			this.updateDiff();
		}, 60000);

	}

	updateDiff() {
        this.chatList.forEach(function(item){
			item['timediff'] = getDiff(item.lastSendTime);
			return item;
		});
    }

	ngAfterViewInit(a, b, c) {
		// viewChild is set after the view has been initialized

	}

	ngAfterViewChecked(a, b, c) {
		// viewChild is set after the view has been initialized

	}

	ngOnDestory() {
		this.subscriptions.unsubscribe();
		clearInterval(this.timer);
	}

	presentPopover(event) {
		let popover = this.popoverCtrl.create(ChatPopoverPage, {}, {
			cssClass: 'chat-popover'
		});

		popover.present({
			ev: event
		});
	}

	ngOnDestroy() {
		clearInterval(this.timer);
	}

	deleteChat(relationId) {
		this.msgService.deleteChat(relationId);
	}

	gotoChatContentPage(relationId, chatName): void {
		this.appCtrl.getRootNav().push(ChatContentPage,{ relationId, chatName });
	}

	gotoFriendAddPage(): void {
		this.appCtrl.getRootNav().push(FriendAddPage);
	}

	// gotoFriendListPage():void{
	//    this.appCtrl.getRootNav().push(FriendListPage);
	// }


}



