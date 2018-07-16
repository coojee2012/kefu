import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdDialoutModalComponent } from './dialout.modal.compnent';
@Component({
  selector: 'app-apps-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

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
}
