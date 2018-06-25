import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'passport-register-result-fail',
  templateUrl: './register-result-fail.component.html',
})
export class UserRegisterResultFailComponent implements OnInit {
  public mailAddress: any;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public msg: NzMessageService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mailAddress = params['mailaddr'];
    });
  }
}
