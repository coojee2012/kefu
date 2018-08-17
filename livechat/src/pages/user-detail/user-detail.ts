import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { FriendRequestPage } from '../friend-request/friend-request';
import { ChatContentPage } from '../chat-content/chat-content';

import { MyHttp } from '../../providers/my-http';
import { BackEnd } from '../../providers/backend';

@Component({
	selector: 'cy-user-detail-page',
	templateUrl: 'user-detail.html'
})
export class UserDetailPage implements OnInit {
	private ownId: any;
	private userId;

	private user: any;
	private isFriend: boolean = false;
	private relationId: string;

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private userService: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp,
		private backEnd:BackEnd
	) {

		this.userId = navParams.data.userId;
		this.ownId = backEnd.getOwnId();
	}

	ngOnInit() {

		this.userService.getUser(this.userId).subscribe(
			res => {
				this.user = res.data.user;
				this.isFriend = res.data.isFriend;
				this.relationId = res.data.relationId;
			},
			err => this.myHttp.handleError(err, '加载失败')
		);
	}



	gotoFriendRequestPage() {
		this.navCtrl.push(FriendRequestPage, { userId: this.userId });
	}

	gotoChatContentPage() {
		if (!this.relationId) return alert('你们还不是朋友！');

		//如果是从聊天内容页进来的话，就直接pop
		if (this.navCtrl.getPrevious().component === ChatContentPage) {
			this.navCtrl.pop();
		} else {
			this.navCtrl.push(ChatContentPage, { relationId: this.relationId, chatName: this.user.nickname });
		}


	}
}
