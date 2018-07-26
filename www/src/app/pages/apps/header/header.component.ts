import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbdDialoutModalComponent } from './dialout.modal.compnent';
import { LoginService } from '../../login/login.service';
import { SIPService } from '../../../services/SIPService';
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
    return this.checkInType === 'sip' ? 'fa fa-fax fa-lg '  :
      this.checkInType === 'mobile' ? 'fa fa-mobile fa-lg ' : 'fa fa-headphones fa-lg ';
  }
  // 签入服务
  checkInServ(ckType: string) {
    this.sipClient.init();
    this.checkInType = ckType;
    this.isCheckIn = true;
  }
}
