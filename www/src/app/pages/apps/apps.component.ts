import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoggerService } from '../../services/LogService';
import { DeepStreamService } from '../../services/DeepStreamService';
import { SIPService } from '../../services/SIPService';
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {

  constructor(private router: Router, private logger: LoggerService, private dsClient: DeepStreamService, private sipClient: SIPService) { }

  ngOnInit() {
    this.logger.log('测试LoggerService');
    setTimeout(() => {
      this.router.navigate(['/app/dashbord']);
    }, 500);
   // this.dsClient.login(null, this.loginHandler.bind(this));
    this.sipClient.init();
  }
  loginHandler(success, data) {
    this.logger.debug('logged in', success, data);
  }

}
