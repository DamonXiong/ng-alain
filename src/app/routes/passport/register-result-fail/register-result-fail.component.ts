import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'passport-register-result-fail',
  templateUrl: './register-result-fail.component.html',
})
export class UserRegisterResultFailComponent {
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
}
