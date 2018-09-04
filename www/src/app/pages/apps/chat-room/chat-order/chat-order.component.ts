import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../core/authorization';
import { LoggerService } from '../../../../services/LogService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatRoomService } from '../chat-room.service';
@Component({
  selector: 'app-chat-order',
  templateUrl: './chat-order.component.html',
  styleUrls: ['./chat-order.component.css']
})
export class ChatOrderComponent implements OnInit {

  private memu: string;
  addCustomForm: FormGroup;
  private custormFromFolded: boolean;
  constructor(
    private service: ChatRoomService,
    private logger: LoggerService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.memu = 'list';
    this.custormFromFolded = false;
  }

  ngOnInit() {
    this.createCustormForm();
  }

  action(memu: string) {
    this.memu = memu;
  }

  /**
   * //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
   * var pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
   * //用户名正则，4到16位（字母，数字，下划线，减号）
   * var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
   * //手机号正则
   * var mPattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
   * //ipv4地址正则
   * var ipP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
   * // 邮箱
   * ^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$
   */
  createCustormForm(): void {

    this.addCustomForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(12)
        ]
      ],
      email: [
        '',
        [
          Validators.pattern(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/),
          Validators.minLength(4),
          Validators.maxLength(32)
        ]
      ],
      mobile: [
        '',
        [
          Validators.pattern(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16[0-9])|(17[0-9])|(18[0,5-9])|(19[0-9]))\d{8}$/),
        ]
      ],
      level: [
        '0',
        [
          Validators.required,
        ]
      ],
      telphone: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(11)
        ]
      ],
      companyName: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(64)
        ]
      ],
      memo: [
        '',
        [
          Validators.maxLength(256),
        ]
      ],
      address: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(64)
        ]
      ]
    });



    // this.addUserForm.valueChanges
    //   .subscribe(data => this.onValueChanged(data));

    // this.registerForm.get('username').valueChanges
    //   .subscribe(value => this.checkMobile(value));
  }

  addCustomSubmit() { }
  foldCustomForm() {
    this.custormFromFolded = !this.custormFromFolded;
  }

}
