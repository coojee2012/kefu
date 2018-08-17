import { Component, OnInit, Input } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '../../../../services/LogService';
@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent implements OnInit {

  @Input() alertMsg;
  @Input() alertTitle;
  constructor(public activeModal: NgbActiveModal, private logger: LoggerService) {
  }

  ngOnInit() {
  }

}
