import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { NgbdDialoutModalComponent } from './dialout.modal.compnent';
import { AlertModalComponent } from '../shared/alert-modal/alert-modal.component';
import { LoggerService } from '../../../services/LogService';
import { LoginService } from '../../login/login.service';
import { SIPService } from '../../../services/SIPService';
import { HeaderService } from './header.service';
@Component({
  selector: 'app-apps-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  checkInType: string;
  isCheckIn: boolean;
  callStateSub: Subscription;
  ccBtns: CallControlBtns;
  constructor(private modalService: NgbModal, private loginService: LoginService, private router: Router,
    private headerService: HeaderService,
    private logger: LoggerService,
    private sipClient: SIPService
  ) {
    this.ccBtns = {
      DialBtn: true,
      HoldBtn: false,
      RingBtn: false,
      UnHoldBtn: false,
      TransferBtn: false,
      HangupBtn: false,
      ConsultBtn: false,
      MultiPartyBtn: false,
    };
  }

  ngOnInit() {
    this.isCheckIn = false;
    this.checkInType = '';
  }
  openDialout() {
    const modalRef = this.modalService.open(NgbdDialoutModalComponent, {
      size: 'sm',
      centered: true,
      windowClass: 'modal-info in'
    });
    modalRef.componentInstance.name = '回车键';
  }

  onCallStateChange(data) {
    // this.logger.debug('oncallstatechane:', data);
    const { t, d } = data;
    switch (t) {
      case 'ringing':
        this.ccBtns = {
          DialBtn: false,
          HoldBtn: false,
          RingBtn: true,
          UnHoldBtn: false,
          TransferBtn: false,
          HangupBtn: true,
          ConsultBtn: false,
          MultiPartyBtn: false,
        };
        break;
      case 'new':
        this.ccBtns = {
          DialBtn: false,
          HoldBtn: false,
          RingBtn: false,
          UnHoldBtn: false,
          TransferBtn: false,
          HangupBtn: false,
          ConsultBtn: false,
          MultiPartyBtn: false,
        };
        break;
      case 'connecting':
        break;
      case 'connected':
        this.ccBtns = {
          DialBtn: false,
          HoldBtn: false,
          RingBtn: false,
          UnHoldBtn: false,
          TransferBtn: false,
          HangupBtn: true,
          ConsultBtn: false,
          MultiPartyBtn: false,
        };
        break;
      case 'ended':
        this.ccBtns = {
          DialBtn: true,
          HoldBtn: false,
          RingBtn: false,
          UnHoldBtn: false,
          TransferBtn: false,
          HangupBtn: false,
          ConsultBtn: false,
          MultiPartyBtn: false,
        };
        break;
      default:
        this.ccBtns = {
          DialBtn: true,
          HoldBtn: false,
          RingBtn: false,
          UnHoldBtn: false,
          TransferBtn: false,
          HangupBtn: false,
          ConsultBtn: false,
          MultiPartyBtn: false,
        };
        break;
    }
  }

  async  hangup() {
    try {
      this.logger.debug('Hangup a call!');
      await this.sipClient.hangup();
    } catch (ex) {
      this.logger.error('Hangup a call error:', ex);
    }

  }

  async  answer() {
    try {
      this.logger.debug('Answer a call!');
      await this.sipClient.answer();
    } catch (ex) {
      this.logger.error('Answer a call error:', ex);
    }

  }

  loginOut() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
  checkInClass() {
    return this.checkInType === 'sip' ? 'fa fa-fax fa-lg ' :
      this.checkInType === 'mobile' ? 'fa fa-mobile fa-lg ' : 'fa fa-headphones fa-lg ';
  }
  // 签入服务
  async checkInServ(ckType: string) {
    try {
      const user = this.headerService.getUser();
      this.logger.debug('checkInServ', user);
      if (!user || !user.extension || !user.extPwd) {
        const alertMsg = !user ? '用户不存在！' : '用户尚未分配分机';
        const modalRef = this.modalService.open(AlertModalComponent, {
          size: 'sm',
          centered: true,
          windowClass: 'modal-warning in'
        });
        modalRef.componentInstance.alertTitle = '友情提示：';
        modalRef.componentInstance.alertMsg = alertMsg;
      } else {
        await this.sipClient.init({
          domain: user.domain,
          exten: user.extension, password: user.extPwd,
          media: {
            local: {
              video: document.getElementById('localVideo')
            },
            remote: {
              // video: document.getElementById('remoteVideo'),
              video: null,
              // This is necessary to do an audio/video call as opposed to just a video call
              audio: document.getElementById('remoteVideo')
            }
          },
          ua: {}
        });
        await new Promise((resolve, reject) => {
          const subscription = this.headerService.checkIn()
            .subscribe(
              results => {
                if (results.meta && results.meta.code === 200) {
                  subscription.unsubscribe();
                  resolve();
                } else {
                  subscription.unsubscribe();
                  reject('写入签入数据异常');
                }
              },
              error => {
                subscription.unsubscribe();
                reject(error);
              });
        });
        this.checkInType = ckType;
        this.isCheckIn = true;
        this.callStateSub = this.sipClient.event$
          .pipe()
          .subscribe(this.onCallStateChange.bind(this));
      }
    } catch (error) {
      const modalRef = this.modalService.open(AlertModalComponent, {
        size: 'sm',
        centered: true,
        windowClass: 'modal-warning in'
      });
      this.logger.error('=====', error);
      modalRef.componentInstance.alertTitle = '友情提示：';
      modalRef.componentInstance.alertMsg = '签入失败！';
    }


  }


  async checkOutServ() {
    try {
      await new Promise((resolve, reject) => {
        const subscription = this.headerService.checkOut()
          .subscribe(
            results => {
              if (results.meta && results.meta.code === 200) {
                subscription.unsubscribe();
                resolve();
              } else {
                subscription.unsubscribe();
                reject('写入签出数据异常');
              }
            },
            error => {
              subscription.unsubscribe();
              reject(error);
            });
      });
      await this.sipClient.stop();
      this.isCheckIn = false;
    } catch (error) {
      this.isCheckIn = false;
      const modalRef = this.modalService.open(AlertModalComponent, {
        size: 'sm',
        centered: true,
        windowClass: 'modal-warning in'
      });
      modalRef.componentInstance.alertTitle = '友情提示：';
      modalRef.componentInstance.alertMsg = '签出失败！';
    }
  }
}


interface CallControlBtns {
  DialBtn: boolean;
  RingBtn: boolean;
  HoldBtn: boolean;
  UnHoldBtn: boolean;
  TransferBtn: boolean;
  HangupBtn: boolean;
  ConsultBtn: boolean;
  MultiPartyBtn: boolean;
}
