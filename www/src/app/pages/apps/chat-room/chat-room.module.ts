import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { ChatRoomComponent } from './chat-room.component';
import { ROUTER_CONFIG } from './chat-room.routes';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTER_CONFIG
  ],
  declarations: [
    ChatRoomComponent
  ]
})
export class ChatRoomModule { }
