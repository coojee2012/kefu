import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../core/authorization';
import { LoggerService } from '../../../../services/LogService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserManageService } from '../user-manage.service';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  private optUser: any;
  addUserForm: FormGroup;
  newuser: any;
  constructor(private logger: LoggerService,
    private router: Router,
    private fb: FormBuilder,
    private userManageService: UserManageService,
    private authorizationService: AuthorizationService) {
    this.newuser = {
      nickname: '',
      username: '',
      password: '',
      repassword: '',
      extension: '1000',
      phone: '',
      memo: '',
      role: 'agent',
    };
  }

  ngOnInit() {
    this.optUser = this.authorizationService.getCurrentUser().user;
    this.createForm();
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
   */
  createForm(): void {

    this.addUserForm = this.fb.group({
      nickname: [
        this.newuser.nickname,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(12)
        ]
      ],
      username: [
        this.newuser.username,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_-]{4,16}$/),
          Validators.minLength(4),
          Validators.maxLength(16)
        ]
      ],
      phone: [
        this.newuser.phone,
        [
          Validators.required,
          Validators.pattern(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16[0-9])|(17[0-9])|(18[0,5-9])|(19[0-9]))\d{8}$/),
        ]
      ],
      extension: [
        this.newuser.extension,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ]
      ],
      password: [
        this.newuser.password,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18)
        ]
      ],
      repassword: [
        this.newuser.repassword,
        [
          Validators.required,
        ]
      ],
      memo: [
        this.newuser.memo,
        [
          Validators.maxLength(256),
        ]
      ],
      role: [
        this.newuser.role,
        [
          Validators.required
        ]
      ]
    });



    this.addUserForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    // this.registerForm.get('username').valueChanges
    //   .subscribe(value => this.checkMobile(value));
  }

  addUserSubmit(): any {
    this.logger.debug('add data:', this.addUserForm.value);
    this.userManageService.addUser(this.addUserForm.value)
      .subscribe(
        results => {
          if (results.meta && results.meta.code === 200) {
            this.router.navigate(['/app/userma']);
          } else {
            // this.isSubmitError = true;
            // this._success.next(results.meta.message);
          }
        },
        error => console.log(error));
  }

  passwordMatchValidator() {
    const passwordFC = this.addUserForm.get('password');
    const repasswordFC = this.addUserForm.get('repassword');
    if (passwordFC.dirty && repasswordFC.dirty && (passwordFC.value !== repasswordFC.value)) {
      repasswordFC.setErrors({ 'repwdmismatch': true });
    }

  }
  checkMobile(enableMobile: string): void {
    const mobileControl = this.addUserForm.get('phone');

    enableMobile === '1' ?
      mobileControl.setValidators([Validators.required,
      Validators.pattern('1(3|4|5|6|7|8|9)\\d{9}')]) :
      mobileControl.clearValidators();

    mobileControl.updateValueAndValidity();
  }

  onValueChanged(data) {
    if (!this.addUserForm) { return; }
    this.passwordMatchValidator();
  }

}
