import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Contacts, ContactFieldType, IContactFindOptions } from '@ionic-native/contacts';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { SystemService } from '../../services/system';
import { UserService } from '../../services/user';
import { MyHttp } from '../../providers/my-http';

import { FriendRequestPage } from '../friend-request/friend-request';

@Component({
	selector: 'cy-friend-by-contact-page',
	templateUrl: 'friend-by-contact.html',
})
export class FriendByContactPage implements OnInit {
	userList: any[] = [];

	constructor(
		private platform: Platform,
		private contacts: Contacts,
		private navCtrl: NavController,
		private userService: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) {

	}

	ngOnInit() {
		let nonsupport = this.platform.is('mobileweb');
		if (nonsupport) return this.systemService.showToast('访问手机录暂不支持浏览器，请下载APP体验');

		this.findContacts()
			.subscribe(
			contacts => {
				function getDisplayName(mobile) {
					var displayName;
					contacts.forEach(contact => {
						if (contact.phoneNumber === mobile) {
							displayName = contact.displayName;
							return false;
						}

					});
					return displayName;

				}

				let mobiles = contacts.map(contact => contact.phoneNumber);

				return this.userService.getUserListByMobiles(mobiles).subscribe(
					res => {

						let users = res.data;

						users.forEach((user, i) => {
							user.displayName = this.getDisplayName(user.mobile, contacts);
						})
						this.userList = users;
					});
			},
			err => this.myHttp.handleError(err, '获取通讯录好友失败')
			);

	}

	findContacts(): Observable<any> {
		let fields:ContactFieldType[] = ['displayName'];
		let options:IContactFindOptions = { hasPhoneNumber: true };

		let p = this.contacts.find(fields, options)
			.then(contacts => {
				var newContacts = [];
				contacts.forEach(contact => {
					//一个联系人，手机号码可能有多个
					contact.phoneNumbers.forEach(phoneNumber => {
						newContacts.push({
							displayName: contact.displayName,
							phoneNumber: phoneNumber.value
						});
					});

				});
				return newContacts;
			});

		return Observable.fromPromise(p);

	}

	gotoFriendRequestPage(userId) {
		this.navCtrl.push(FriendRequestPage, { userId });
	}

	private getDisplayName(mobile, contacts) {
		var displayName;
		contacts.forEach(contact => {
			if (contact.phoneNumber === mobile) {
				displayName = contact.displayName;
				return false;
			}

		});
		return displayName;
	}

}



