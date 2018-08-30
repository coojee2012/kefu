import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LoggerService } from '../../../services/LogService';
import { DataService, Room, LiveChatMessage } from '../../../services/DataService';

import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';
import { Subscriber, Subscription } from 'rxjs';
@Component({
  selector: 'app-apps-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private isActive: boolean[];
  private roomSub: Subscription;
  private rooms: Room[];
  constructor(private logger: LoggerService, private router: Router,
    private dataService: DataService,
    private loginService: LoginService) {
    this.rooms = [];
    this.isActive = [false, false, false];
  }

  ngOnInit() {
    this.roomSub = this.dataService.Room$.subscribe(this.onRoomSub.bind(this));
  }

  ngOnDestroy() {
    this.roomSub.unsubscribe();
  }

  onRoomSub(room: Room) {
    this.rooms.push(room);
  }

  loginOut() {
    this.loginService.logout()
      .subscribe(
        (user) => {
          if (user.meta.code === 200) {
            this.router.navigate(['/login']);
          } else {
            this.logger.error('logout logic error:', user.meta.message);
          }
        },
        (error) => {
          this.router.navigate(['/login']);
          this.logger.error('logout server error:', error);
        }
      );
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
