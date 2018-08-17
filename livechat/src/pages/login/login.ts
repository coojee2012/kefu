import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, group } from '@angular/core';      //动画
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { Storage } from '@ionic/storage';

import { IndexPage } from '../index/index';
import { VerifyMobilePage } from '../verifymobile/verifymobile';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { getErrorMsgByFormGroup } from '../../validators/index';

import { MyHttp } from '../../providers/my-http';

@Component({
	selector: 'cy-login-page',
	templateUrl: 'login.html',
})
export class LoginPage {
	private form: FormGroup;
	private logining = false;

	private formLabelMap = {
		username : '帐号',
		password:'密码'
	}

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private toastCtrl: ToastController,
		private builder: FormBuilder,
		private storage: Storage,
		private userservice: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) {


	}

	ngOnInit() {


		this.form = this.builder.group({
			username: ['',
				[
					Validators.required,
				],
			],
			password: ['',
				[
					Validators.required,
				]
			]
		});

		//注册页传来的username
		var username = this.navParams.data['username'];
		if( username){
			this.form.controls['username'].setValue(username);
		}else{
			//获取上次登录的用户名
			this.storage.get('latestUsername').then(value => {
				if (value) {
					this.form.controls['username'].setValue(value);
				}
			});
		}
	}

	//登录
	login(): void {

		if(this.form.invalid){
			var msg = getErrorMsgByFormGroup(this.form, this.formLabelMap);
			this.systemService.showToast(msg);
			return;
		}

		this.logining = true;
		var obser = this.userservice.login(this.form.value);

		obser
			.mergeMap((res) => {
				//本地保存token
				let token = res.data.token;
				let ownId = this.form.value.username;
				
				return this.saveToken(token, ownId);
			})
			.do(
				() => {
					this.logining = false;
				},
				() => {
					this.logining = false;
				}
			)
			.subscribe(
			() => {
				//保存登录名，下次登录返显处来
				this.storage.set('latestUsername',this.form.value.username);
				
				this.navCtrl.setRoot(IndexPage);
			},
			err => this.myHttp.handleError(err, '登录失败'),
			);
	}



	gotoVerifyMobilePage(): void {
		this.navCtrl.push(VerifyMobilePage);
	}

	_$testLogin(n) {
		this.form.setValue({
			username: 'test' + n,
			password: 123456
		});

		this.login();
	}

	private saveToken(token: any, ownId: any) {
		let p1 = this.storage.set('token', token);
		let p2 = this.storage.set('ownId', ownId);
		let pAll = Promise.all([p1, p2]);
		return Observable.fromPromise(pAll);
	}
}


