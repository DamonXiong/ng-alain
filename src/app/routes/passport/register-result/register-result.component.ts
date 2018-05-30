import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'passport-register-result',
  templateUrl: './register-result.component.html',
  styleUrls: ['./register-result.component.less'],
})
export class UserRegisterResultComponent {
  public mailAddress: any;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public msg: NzMessageService,
  ) {}

  OnInit() {
    this.route.queryParams.subscribe(params => {
      this.mailAddress = params['mailaddr'];
    });
  }

  getMailAddress(): string {
    let tmp = this.mailAddress.split('@')[1];
    tmp = tmp.toLowerCase();
    if (tmp === '163.com') {
      return 'http://mail.163.com';
    } else if (tmp === 'vip.163.com') {
      return 'http://vip.163.com';
    } else if (tmp === '126.com') {
      return 'http://mail.126.com';
    } else if (
      tmp === 'qq.com' ||
      tmp === 'vip.qq.com' ||
      tmp === 'foxmail.com'
    ) {
      return 'http://mail.qq.com';
    } else if (tmp === 'gmail.com') {
      return 'http://mail.google.com';
    } else if (tmp === 'sohu.com') {
      return 'http://mail.sohu.com';
    } else if (tmp === 'tom.com') {
      return 'http://mail.tom.com';
    } else if (tmp === 'vip.sina.com') {
      return 'http://vip.sina.com';
    } else if (tmp === 'sina.com.cn' || tmp === 'sina.com') {
      return 'http://mail.sina.com.cn';
    } else if (tmp === 'tom.com') {
      return 'http://mail.tom.com';
    } else if (tmp === 'yahoo.com.cn' || tmp === 'yahoo.cn') {
      return 'http://mail.cn.yahoo.com';
    } else if (tmp === 'tom.com') {
      return 'http://mail.tom.com';
    } else if (tmp === 'yeah.net') {
      return 'http://www.yeah.net';
    } else if (tmp === '21cn.com') {
      return 'http://mail.21cn.com';
    } else if (tmp === 'hotmail.com') {
      return 'http://www.hotmail.com';
    } else if (tmp === 'sogou.com') {
      return 'http://mail.sogou.com';
    } else if (tmp === '188.com') {
      return 'http://www.188.com';
    } else if (tmp === '139.com') {
      return 'http://mail.10086.cn';
    } else if (tmp === '189.cn') {
      return 'http://webmail15.189.cn/webmail';
    } else if (tmp === 'wo.com.cn') {
      return 'http://mail.wo.com.cn/smsmail';
    } else if (tmp === '139.com') {
      return 'http://mail.10086.cn';
    } else {
      return '';
    }
  }

  goToMail() {
    const url = this.getMailAddress();
    window.open(url);
  }
}
