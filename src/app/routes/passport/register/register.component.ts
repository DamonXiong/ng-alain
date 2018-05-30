import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  providers: [_HttpClient],
})
export class UserRegisterComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };

  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private http: _HttpClient,
  ) {
    this.form = fb.group({
      mail: [null, [Validators.email]],
      account: [null, [Validators.required, Validators.minLength(5)]],
      accountName: [null, [Validators.required, Validators.minLength(5)]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          UserRegisterComponent.checkPassword.bind(this),
        ],
      ],
      confirm: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          UserRegisterComponent.passwordEquar,
        ],
      ],
      mobilePrefix: ['+86'],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      // captcha: [null, [Validators.required]],
    });
  }

  static checkPassword(control: FormControl) {
    if (!control) return null;
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) self.status = 'ok';
    else if (control.value && control.value.length > 5) self.status = 'pass';
    else self.status = 'pool';

    if (self.visible)
      self.progress =
        control.value.length * 10 > 100 ? 100 : control.value.length * 10;
  }

  static passwordEquar(control: FormControl) {
    if (!control || !control.parent) return null;
    if (control.value !== control.parent.get('password').value) {
      return { equar: true };
    }
    return null;
  }

  // region: fields

  get mail() {
    return this.form.controls.mail;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirm() {
    return this.form.controls.confirm;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  // get captcha() {
  //   return this.form.controls.captcha;
  // }
  get account() {
    return this.form.controls.account;
  }
  get accountName() {
    return this.form.controls.accountName;
  }

  // endregion

  // region: get captcha

  count = 0;
  interval$: any;

  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // endregion

  submit() {
    this.error = '';
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;

    const param: HttpParams = new HttpParams();
    // param.append('account', '1');
    // param.append('password', '1');
    // param.append('type', '1');
    this.loading = true;
    this.http
      .post(
        'BoardSystem/BLL/Login/LoginWebService.asmx/CreateEngineer',
        {
          account: this.account.value,
          accountName: this.accountName.value,
          password: this.password.value,
          phoneNo: this.mobile.value,
          mailAddress: this.mail.value,
          weChatAccount: 'dfdsajfdakfaljfda',
        },
        {},
        {
          headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;',
            'Content-Type': 'application/json',
          },
          responseType: 'text',
        },
      )
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        const ret = JSON.parse(res);
        if (ret['IsOK'] === true) {
          this.router.navigate(['/passport/register-result'], {
            queryParams: { mailaddr: this.mail.value },
          });
        } else {
          this.error = ret['Description'];
        }
      });
    // mock http
    // this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    //   this.router.navigate(['/passport/register-result']);
    // }, 1000);
  }

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
