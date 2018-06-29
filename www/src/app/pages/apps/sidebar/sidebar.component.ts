import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../../../services/LogService';
import { DeepStreamService } from '../../../services/DeepStreamService';
@Component({
  selector: 'app-apps-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private isActive: boolean[];
  constructor(private logger: LoggerService, private dsClient: DeepStreamService) {
    this.isActive = [false, false, false];
  }

  ngOnInit() {
    // this.dsClient.eventSub('room/username', data => {
    //   this.logger.debug('======', data);
    // });
  }
  onTreeClick(index: number) {
    for (let i = 0; i < this.isActive.length; i++) {
      if (this.isActive[i] && i !== index) {
        this.isActive[i] = false;
      }
    }
    this.isActive[index] = !this.isActive[index];
  }
}
