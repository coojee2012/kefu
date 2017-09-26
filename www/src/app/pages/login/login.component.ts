import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from './login.service';

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
    verifycode: false,
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
      'required': '手机号不能为空'
    }
  };

  constructor(private router: Router,
              private fb: FormBuilder,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.createForm();
    /*if(this.loginService.isLogin()){
      this.router.navigate(['/']);
    }*/
    // this.onValueChanged();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      username: [
        this.login.username,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
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
          Validators.required
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
    console.log('onValueChanged', this.loginForm, data);
  }

  loginSubmit(loginForm: any): any {
    console.log(loginForm);
    this.loginService.login(loginForm.value)
      .subscribe(
        user => user.meta.code === 200 && this.router.navigate(['/']),
        error => this.error = error
      );
  }


  verify(data) {
    this.login.verifycode = data;
    console.log('verify', data);
  }
}
