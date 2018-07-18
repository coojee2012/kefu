import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  checkStatus: boolean;
  domainFC: AbstractControl;
  register: any = {
    nickname: '',
    username: '',
    domain: '',
    password: '',
    repassword: '',
    terms: false,
  };
  constructor(
    private registerService: RegisterService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.checkStatus = false;
  }

  ngOnInit() {
    this.createForm();
  }
  createForm(): void {

    this.registerForm = this.fb.group({
      nickname: [
        this.register.nickname,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(11)
        ]
      ],
      username: [
        this.register.username,
        [
          Validators.required,
          Validators.pattern('^1(3|4|5|6|7|8|9)\\d{9}'),
          Validators.minLength(11),
          Validators.maxLength(11)
        ]
      ],
      domain: [
        this.register.domain,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(12)
        ]
      ],
      password: [
        this.register.password,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18)
        ]
      ],
      repassword: [
        this.register.repassword,
        [
          Validators.required,
        ]
      ],
      terms: [
        this.register.terms,
        [
          Validators.required,
          Validators.requiredTrue
        ]
      ]
    });


    this.domainFC = this.registerForm.get('domain');

    this.registerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    // this.registerForm.get('username').valueChanges
    //   .subscribe(value => this.checkMobile(value));
  }
  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    this.passwordMatchValidator();
    // console.log('onValueChanged:', this.registerForm.valid, data);
  }

  passwordMatchValidator() {
    const passwordFC = this.registerForm.get('password');
    const repasswordFC = this.registerForm.get('repassword');
    if (passwordFC.dirty && repasswordFC.dirty && (passwordFC.value !== repasswordFC.value)) {
      repasswordFC.setErrors({ 'repwdmismatch': true });
    }

  }
  checkMobile(enableMobile: string): void {
    const mobileControl = this.registerForm.get('username');

    enableMobile === '1' ?
      mobileControl.setValidators([Validators.required,
      Validators.pattern('1(3|4|5|6|7|8|9)\\d{9}')]) :
      mobileControl.clearValidators();

    mobileControl.updateValueAndValidity();
  }
  registerSubmit() {
    this.registerService.register(this.registerForm.value)
      .subscribe(
        results => {
          if (results.code === 0) {
            this.router.navigate(['/']);
          }
        },
        error => console.log(error));
  }
}
