import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'app-extras-settings',
  templateUrl: './settings.component.html',
  providers: [_HttpClient],
})
export class ExtrasSettingsComponent implements OnInit {
  active = 1;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    fb: FormBuilder,
    public msg: NzMessageService,
    private http: _HttpClient,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.profileForm = fb.group({
      account: [
        null,
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      name: [
        null,
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      wechat: [],
      registerTime: [],
    });

    this.passwordForm = fb.group({
      old_password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          ExtrasSettingsComponent.checkPassword.bind(this),
        ],
      ],
      new_password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          ExtrasSettingsComponent.checkPassword.bind(this),
        ],
      ],
      confirm_new_password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          ExtrasSettingsComponent.passwordEquar.bind(this),
        ],
      ],
    });
  }

  get name() {
    return this.profileForm.get('name');
  }

  get account() {
    return this.profileForm.get('account');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get mobile() {
    return this.profileForm.get('mobile');
  }

  get wechat() {
    return this.profileForm.get('wechat');
  }

  get registerTime() {
    return this.profileForm.get('registerTime');
  }

  get old_password() {
    return this.passwordForm.get('old_password');
  }

  get new_password() {
    return this.passwordForm.get('new_password');
  }

  get confirm_new_password() {
    return this.passwordForm.get('confirm_new_password');
  }

  profileSave(event, value) {
    this.http
      .post(
        'BoardSystem/BLL/Login/LoginWebService.asmx/EditeAccountInfo',
        {
          account: this.account.value,
          password: this.tokenService.get().password,
          accountName: this.name.value,
          phoneNo: this.mobile.value,
          weChatAccount: this.wechat.value,
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
        // console.log(res);
        const ret = JSON.parse(res);
        if (ret['IsOK'] === true) {
          this.msg.success(ret['Description']);
        } else {
          this.msg.error(ret['Description']);
        }
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
    if (control.value !== control.parent.get('new_password').value) {
      return { equar: true };
    }
    return null;
  }

  pwdSave() {
    if (!this.old_password.value) {
      return this.msg.error('invalid old password');
    }
    if (!this.new_password.value) {
      return this.msg.error('invalid new password');
    }
    if (!this.confirm_new_password.value) {
      return this.msg.error('invalid confirm new password');
    }

    this.http
      .post(
        'BoardSystem/BLL/Login/LoginWebService.asmx/ChangePassword',
        {
          account: this.tokenService.get().name,
          oldPassword: this.old_password.value,
          newPassword: this.new_password.value,
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
        // console.log(res);
        const ret = JSON.parse(res);
        if (ret['IsOK'] === true) {
          this.msg.success(ret['Description']);
          this.tokenService.clear();
          this.router.navigate(['/passport/login']);
        } else {
          this.msg.error(ret['Description']);
        }
      });
  }

  ngOnInit() {
    this.http
      .post(
        'BoardSystem/BLL/Login/LoginWebService.asmx/GetEngineerInfoByAccount',
        {
          account: this.tokenService.get().name,
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
        const ret = JSON.parse(res);
        if (ret['IsOK'] === true) {
          const extdata = JSON.parse(ret['ExtData'])[0];
          this.profileForm.patchValue({
            account: extdata.Account,
            name: extdata.AccountName,
            email: extdata.MailAddress,
            mobile: extdata.PhoneNo,
            wechat: extdata.WeChatAccount,
            registerTime: extdata.CreateDateTime,
          });

          this.account.disable();
          this.wechat.disable();
          this.registerTime.disable();
        } else {
          this.msg.error(ret['Description']);
        }
      });
  }
}
