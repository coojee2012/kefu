import { Component, Input } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '../../../services/LogService';

@Component({
    selector: 'app-ngbd-modal-content',
    templateUrl: './ensure.modal.compent.html'
})
export class NgbdEnsureModalComponent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal, private logger: LoggerService) {
    }
}
