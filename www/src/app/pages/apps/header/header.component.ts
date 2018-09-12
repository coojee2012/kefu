import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbdDialoutModalComponent } from './dialout.modal.compnent';
import { AlertModalComponent } from '../shared/alert-modal/alert-modal.component';
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
  constructor(private modalService: NgbModal, private loginService: LoginService, private router: Router,
    private headerService: HeaderService,
    private sipClient: SIPService
  ) {
    this.isCheckIn = false;
    this.checkInType = '';
  }

  ngOnInit() {
  }
  openDialout() {
    const modalRef = this.modalService.open(NgbdDialoutModalComponent, {
      size: 'sm',
      centered: true,
      windowClass: 'modal-info in'
    });
    modalRef.componentInstance.name = '回车键';
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
  checkInServ(ckType: string) {
    const user = this.headerService.getUser();
    console.log('checkInServ', user);
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
      this.sipClient.init({ domain: user.domain, exten: user.extension, password: user.extPwd })
        .then(res => {
          this.checkInType = ckType;
          this.isCheckIn = true;
        })
        .catch(err => {
          const modalRef = this.modalService.open(AlertModalComponent, {
            size: 'sm',
            centered: true,
            windowClass: 'modal-warning in'
          });
          modalRef.componentInstance.alertTitle = '友情提示：';
          modalRef.componentInstance.alertMsg = '签入失败！';
        });
    }

  }
}
