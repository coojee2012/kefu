import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared';
import { ChatRoomComponent } from './chat-room.component';
import { ROUTER_CONFIG } from './chat-room.routes';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { OrderListComponent } from './order-list/order-list.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqDetailComponent } from './faq-detail/faq-detail.component';
import { ChatOrderComponent } from './chat-order/chat-order.component';
import { ChatFaqComponent } from './chat-faq/chat-faq.component';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
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
    ChatMessageComponent,
    OrderListComponent,
    CreateOrderComponent,
    FaqListComponent,
    FaqDetailComponent,
    ChatOrderComponent,
    ChatFaqComponent,
    ChatDetailComponent
  ]
})
export class ChatRoomModule { }
