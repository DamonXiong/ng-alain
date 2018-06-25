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
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  columns: SimpleTableColumn[] = [
    { title: '', index: 'no', type: 'checkbox' },
    { title: '参数项', index: 'key' },
    { title: '参数值', index: 'value', width: '50%' },
    { title: '备注', index: 'remark' },
    {
      title: '更新时间',
      index: 'updatedAt',
      type: 'date',
      sorter: (a: any, b: any) => a.updatedAt - b.updatedAt,
    },
    {
      title: '操作',
      buttons: [
        {
          text: '配置',
          click: (item: any) => this.update(item, this.modalContent),
        },
      ],
    },
  ];
  selectedRows: SimpleTableData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;
  item = { key: '', value: '', remark: '' };

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
    const thisObj = this;
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
            'Content-Type': 'application/json',
          },
          responseType: 'text',
        },
      )
      .subscribe(res => {
        console.log(res);
        thisObj.loading = false;
        const ret = JSON.parse(res);
        if (ret['IsOK'] === true) {
          thisObj.data = JSON.parse(ret['ExtData']);
        } else {
          thisObj.msg.error(ret['Description']);
        }
      });
  }

  update(item: any, tpl: TemplateRef<{}>) {
    console.log(tpl);
    this.item = item;
    const thisObj = this;
    this.modalSrv.create({
      nzTitle: '配置规则',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http
          .post(
            'BoardSystem/BLL/Login/LoginWebService.asmx/SetSysParams',
            {
              key: this.item.key,
              value: this.item.value,
              remark: this.item.remark,
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
          .subscribe(ret => {
            thisObj.loading = false;
            if (ret['IsOK'] === true) {
              this.getData();
            } else {
              thisObj.msg.error(ret['Description']);
            }
          });
      },
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

  add(tpl: TemplateRef<{}>) {
    console.log(tpl);
    const thisObj = this;
    this.item = { key: '', value: '', remark: '' };
    this.modalSrv.create({
      nzTitle: '新建规则',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http
          .post(
            'BoardSystem/BLL/Login/LoginWebService.asmx/SetSysParams',
            {
              key: this.item.key,
              value: this.item.value,
              remark: this.item.remark,
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
            const ret = JSON.parse(res);
            thisObj.loading = false;
            if (ret['IsOK'] === true) {
              this.getData();
            } else {
              thisObj.msg.error(ret['Description']);
            }
          });
      },
    });
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
