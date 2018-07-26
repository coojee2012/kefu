import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from '../../../services/LogService';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';
@Component({
  selector: 'app-apps-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private isActive: boolean[];
  @Input() rooms: string[];
  constructor(private logger: LoggerService, private router: Router, private loginService: LoginService) {
    this.isActive = [false, false, false];
  }

  ngOnInit() {
    // this.dsClient.eventSub('room/username', data => {
    //   this.logger.debug('======', data);
    // });
  }

  loginOut() {
    this.loginService.logout();
    this.router.navigate(['/login']);
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
