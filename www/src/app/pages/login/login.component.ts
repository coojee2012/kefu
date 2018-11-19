import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private error: any;
  loginForm: FormGroup;
  login = {
    username: '',
    password: '',
    verifycode: true,
    rememberme: true
  };
  formErrors = {
    'username': '',
    'password': ''
  };
  validationMessages = {
    'password': {
      'required': '密码不能为空',
      'minlength': '密码长度不能小于6位',
      'maxlength': '密码长度不能大于18位'
    },
    'username': {
      'required': '账户不能为空'
    }
  };
  submitErrorMsg: string;
  checkStatus: boolean;
  private _success = new Subject<string>();

  constructor(private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService) {
    this.submitErrorMsg = '';
  }

  ngOnInit(): void {
    this.createForm();
    if (this.loginService.isLogin()) {
      this.router.navigate(['/']);
    }

    this._success.subscribe((message) => {
      this.submitErrorMsg = message;
    });
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => {
      this.submitErrorMsg = '';
    });
    // this.onValueChanged();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      username: [
        this.login.username,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32)
        ]
      ],
      password: [
        this.login.password,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18)
        ]
      ],
      verifycode: [
        this.login.verifycode,
        [
          Validators.required,
          Validators.requiredTrue
        ]
      ],
      rememberme: [
        this.login.rememberme,
        []
      ]
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) {
      return;
    }
    // console.log('onValueChanged', this.loginForm, data);
  }

  loginSubmit(): any {
    const sub = this.loginService.login(this.loginForm.value)
      .subscribe(
        (user) => {
          if (user.meta.code === 200) {
            sub.unsubscribe();
            this.router.navigate(['/']);
          } else {
            // this.isSubmitError = true;
            sub.unsubscribe();
            this._success.next(user.meta.message);
          }
        },
        (error) => {
          sub.unsubscribe();
          this.error = error;
          this._success.next(error);
        }
      );
  }


  verify(data: any) {
    this.login.verifycode = data;
    this.loginForm.patchValue({ verifycode: data });
    console.log('verify', data);
  }
}
