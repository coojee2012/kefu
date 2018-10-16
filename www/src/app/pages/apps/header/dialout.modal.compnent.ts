import { Component, Input } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from '../../../services/LogService';

import { SIPService } from '../../../services/SIPService';
@Component({
    selector: 'app-ngbd-modal-content',
    templateUrl: './dialout.modal.compent.html'
})
export class NgbdDialoutModalComponent {
    @Input() name;
    private inputNumber: string;
    constructor(public activeModal: NgbActiveModal, private logger: LoggerService, private sipClient: SIPService) {
        this.inputNumber = '';
    }

    async  dialout(number) {
        try {
            this.logger.debug('dialout:', number);
            await this.sipClient.makeACall(number);
            this.activeModal.close();
        } catch (ex) {
            this.activeModal.close();
        }

    }
    async onEnter(inputNumber) {
        try {
            // await this.sendMsg();
            await this.dialout(inputNumber);
            this.activeModal.close();
        } catch (ex) {
            this.logger.error('onEnter Error:', ex);
        }
    }
    onKey(inputNumber) { // without type info
        this.logger.debug('user input:', inputNumber);
        // this.inputNumber += event.target.value + ' | ';
    }
}
