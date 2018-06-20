import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { tap, map } from 'rxjs/operators';
import {
  SimpleTableComponent,
  SimpleTableColumn,
  SimpleTableData,
} from '@delon/abc';

@Component({
  selector: 'app-setvalue-list',
  templateUrl: './setvalue-list.component.html',
})
export class ProSetValueListComponent implements OnInit {
  q: any = {
    pi: 1,
    ps: 3,
    sorter: '',
  };
  data: any[] = [];
  loading = false;
  @ViewChild('st') st: SimpleTableComponent;
  columns: SimpleTableColumn[] = [
    { title: '', index: 'no', type: 'checkbox' },
    { title: '参数项', index: 'key', render: 'custom-no' },
    { title: '参数值', index: 'value', render: 'custom-value' },
    { title: '备注', index: 'remark', render: 'custom-description' },
    {
      title: '更新时间',
      index: 'updatedAt',
      type: 'date',
      sorter: (a: any, b: any) => a.updatedAt - b.updatedAt,
    },
  ];
  selectedRows: SimpleTableData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.http
      .post(
        'BoardSystem/BLL/Login/LoginWebService.asmx/GetSysParams',
        {
          strSysParamsKey: '',
        },
        {},
        {
          headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;',
            'Content-Type': 'application/xml',
          },
          responseType: 'text',
        },
      )
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        const ret = JSON.parse(res);
        if (ret['IsOK'] === true) {
          this.data = ret['ExtData'];
        } else {
          this.msg.error(ret['Description']);
        }
      });
  }

  checkboxChange(list: SimpleTableData[]) {
    this.selectedRows = list;
    this.totalCallNo = this.selectedRows.reduce(
      (total, cv) => total + cv.callNo,
      0,
    );
  }

  remove() {
    this.http
      .delete('/param', { nos: this.selectedRows.map(i => i.no).join(',') })
      .subscribe(() => {
        this.getData();
        this.st.clearCheck();
      });
  }

  approval() {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  add() {
    // console.log(tpl);
    // this.modalSrv.create({
    //   nzTitle: '新建规则',
    //   nzContent: tpl,
    //   nzOnOk: () => {
    //     this.loading = true;
    //     this.http
    //       .post('/param', { description: this.description })
    //       .subscribe(() => {
    //         this.getData();
    //       });
    //   },
    // });
  }
  commit() {
    console.log(this.data);
  }

  reset(ls: any[]) {
    for (const item of ls) item.value = false;
    this.getData();
  }

  checkNo(value: any) {
    console.log(value);
    this.data.includes(value);
  }
}
