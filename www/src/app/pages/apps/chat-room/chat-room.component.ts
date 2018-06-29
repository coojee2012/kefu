import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../../../services/LogService';

import { SIPService } from '../../../services/SIPService';
interface Message {

}

@Component({
  selector: 'app-apps-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  constructor(private router: Router, private logger: LoggerService,  private sipClient: SIPService) { }

  ngOnInit() {
  }

}
