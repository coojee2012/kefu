import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared';
import { ChatRoomComponent } from './chat-room.component';
import { ROUTER_CONFIG } from './chat-room.routes';
import { ChatMessageComponent } from './chat-message/chat-message.component';
@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ROUTER_CONFIG
  ],
  declarations: [
    ChatRoomComponent,
    ChatMessageComponent
  ]
})
export class ChatRoomModule { }
