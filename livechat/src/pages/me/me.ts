import { Component, ViewChild, OnInit } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { DownloadPage } from '../download/download';
import { SettingPage } from '../setting/setting';
import { MeDetailPage } from '../me-detail/me-detail';
import { QRcodePage } from '../qrcode/qrcode';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import { BackEnd } from '../../providers/backend';
import { MyHttp } from '../../providers/my-http';

@Component({
	selector: 'cy-me-page',
	templateUrl: 'me.html'
})
export class MePage implements OnInit {

	private own = {};

	private own_Subscription;

	constructor(
		private platform: Platform,
		private appCtrl: App,
		private barcodeScanner: BarcodeScanner,
		private userService: UserService,
		private backend: BackEnd,
		private systemService: SystemService,
		private myHttp: MyHttp

	) {

	}

	ngOnInit() {
		this.own_Subscription = this.userService.own$.subscribe(own => this.own = own);
	}

	ngOnDestroy() {
		this.own_Subscription.unsubscribe();
	}

	scanBarCode() {
		let nonsupport = this.platform.is('mobileweb');

		if (nonsupport) return this.systemService.showToast('扫一扫暂不支持浏览器，请下载APP体验');

		let options = {
			showFlipCameraButton: true,
			showTorchButton: true,
			orientation: 'portrait'
		}
		this.barcodeScanner.scan(options)
			.then((barcodeData) => {
				console.log('barcodeData', barcodeData);
				// Success! Barcode data is here
			}, (err) => this.myHttp.handleError(err, '出错啦'));
	}


	gotoMeDetailPage() {
		this.appCtrl.getRootNav().push(MeDetailPage);
	}

	gotoDownloadPage() {
		this.appCtrl.getRootNav().push(DownloadPage);
	}

	gotoSettingPage() {
		this.appCtrl.getRootNav().push(SettingPage);
	}

	gotoQRcodePage(){
		this.appCtrl.getRootNav().push(QRcodePage);
	}

}
