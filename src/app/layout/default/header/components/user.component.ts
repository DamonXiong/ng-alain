import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { User } from '@delon/theme';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown *ngIf="isLogin" nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="gosetting()"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
      <!--<div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>-->
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
    </div>
  </nz-dropdown>
  <div *ngIf="!isLogin" class="d-flex align-items-center">
    <div class="item" (click)="login()"><i class="anticon mr-sm"></i>登录</div>
    <div class="item" (click)="register()"><i class="anticon mr-sm"></i>注册</div>
  </div>
  `,
})
export class HeaderUserComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  isLogin = false;

  ngOnInit(): void {
    this.tokenService.change().subscribe((res: any) => {
      if (res && res.hasOwnProperty('name')) {
        this.isLogin = true;
        this.settings.setUser(res);
      }
    });
    // mock
    // const token = {
    //   token: 'nothing',
    //   name: 'Admin',
    //   avatar: './assets/tmp/img/zorro.svg',
    //   email: 'cipchk@qq.com',
    // };
    this.tokenService.set(this.tokenService.get());
  }

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }

  login() {
    this.router.navigateByUrl(this.tokenService.login_url);
  }

  register() {
    this.router.navigateByUrl('/passport/register');
  }
  gosetting() {
    this.router.navigateByUrl('/extras/settings');
  }
}
