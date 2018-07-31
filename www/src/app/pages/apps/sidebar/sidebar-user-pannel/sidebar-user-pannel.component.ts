import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../core/authorization';
import { SIPService } from '../../../../services/SIPService';
@Component({
  selector: 'app-sidebar-user-pannel',
  templateUrl: './sidebar-user-pannel.component.html',
  styleUrls: ['./sidebar-user-pannel.component.css']
})
export class SidebarUserPannelComponent implements OnInit {
  user: any;
  state: string;
  stateTimes: string;
  timer: any;
  constructor(private authorizationService: AuthorizationService, private sipService: SIPService) {
    this.stateTimes = '00:00:00';
  }

  ngOnInit() {
    this.user = this.authorizationService.getCurrentUser().user;
    this.sipService.getChatMessage().pipe().subscribe(this.handleMsg.bind(this));
    this.setUserState(this.user.state);
    this.setStateTimer();
  }
  handleMsg(msg) {

  }

  setStateTimer() {
    let time = 0;
    const setTime = () => {
      time += 1;
      this.stateTimes = this.arrive_timer_format(time);
    };
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(setTime.bind(this), 1000);
  }

  arrive_timer_format(s) {
    let t: string;
    if (s > -1) {
      let hour = Math.floor(s / 3600);
      const min = Math.floor(s / 60) % 60;
      const sec = s % 60;
      const day = Math.floor(hour / 24);
      if (day > 0) {
        hour = hour - 24 * day;
        t = day + 'day ' + (hour < 10 ? '0' + hour : hour) + ':';
      } else {
        t = (hour < 10 ? '0' + hour : hour) + ':';
      }
      if (min < 10) { t += '0'; }
      t += min + ':';
      if (sec < 10) { t += '0'; }
      t += sec;
    }
    return t;
  }
  setUserState(state) {
    switch (state) {
      case 'waiting':
        {
          this.state = '空闲';
          break;
        }
      default: {
        this.state = '未签入';
      }
    }

  }

}
