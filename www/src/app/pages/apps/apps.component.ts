import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoggerService } from '../../core/logger';
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {

  constructor(private router: Router, private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log('测试LoggerService');
    setTimeout(() => {
      this.router.navigate(['/app/dashbord']);
    }, 500);
  }

}
