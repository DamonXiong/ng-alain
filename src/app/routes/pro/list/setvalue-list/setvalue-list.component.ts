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
        },{
          text: '删除',
          click: (item: any) => this.remove(item),
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
  ) { }

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
    this.item = item;
    this.modalSrv.create({
      nzTitle: '配置规则',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http
          .post(
            'BoardSystem/BLL/Login/LoginWebService.asmx/UpdateSysParams',
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
            this.loading = false;
            const ret = JSON.parse(res);
            if (ret['IsOK'] === true) {
              this.getData();
            } else {
              this.msg.error(ret['Description']);
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

  remove(item: any) {
    this.loading = true;
    this.http
      .post(
        'BoardSystem/BLL/Login/LoginWebService.asmx/DelSysParams',
        {
          key: item.key,
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
        this.loading = false;
        if (ret['IsOK'] === true) {
          this.getData();
          this.st.clearCheck();
        } else {
          this.msg.error(ret['Description']);
        }
      });
  }

  add(tpl: TemplateRef<{}>) {
    this.item = { key: '', value: '', remark: '' };
    this.modalSrv.create({
      nzTitle: '新建规则',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http
          .post(
            'BoardSystem/BLL/Login/LoginWebService.asmx/AddSysParams',
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
            this.loading = false;
            if (ret['IsOK'] === true) {
              this.getData();
            } else {
              this.msg.error(ret['Description']);
            }
          });
      },
    });
  }
}
