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
  private roomIds: string[]; // 用户更新room的信息
  constructor(private logger: LoggerService, private router: Router,
    private dataService: DataService,
    private loginService: LoginService) {
    this.isActive = [false, false, false];
  }

  ngOnInit() {
    this.roomIds = [];
    this.rooms = [];
    this.dataService.initRooms()
      .then(res => { })
      .catch(err => {
        this.logger.error('ng init error:', err);
      });


    this.roomSub = this.dataService.Room$.subscribe(this.onRoomSub.bind(this));
  }

  ngOnDestroy() {
    this.roomSub.unsubscribe();
  }

  onRoomSub(room: Room) {
    const index = this.roomIds.indexOf(room.id);
    if (index > -1) {
      // const oldRoom = this.rooms[index];
      // const keys = Object.keys(room);
      // keys.forEach(key => {
      //   this.rooms[index][key] = room[key];
      // });
      this.rooms[index] = Object.assign({}, this.rooms[index], room);
    } else {
      this.roomIds.push(room.id);
      this.rooms.push(room);
    }
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
