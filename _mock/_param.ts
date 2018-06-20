import { HttpRequest } from '@angular/common/http';
import { MockRequest } from '@delon/mock';

const list = [];

for (let i = 0; i < 20; i += 1) {
  list.push({
    key: i,
    no: `TradeCode ${i}`,
    value: `TradeValue ${i}`,
    description: '这是一段描述',
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
  });
}

function getParam(params: any) {
  let ret = [...list];
  if (params.sorter) {
    const s = params.sorter.split('_');
    ret = ret.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }
  if (params.statusList && params.statusList.length > 0) {
    ret = ret.filter(data => params.statusList.indexOf(data.status) > -1);
  }
  if (params.no) {
    ret = ret.filter(data => data.no.indexOf(params.no) > -1);
  }
  return ret;
}

function removeParam(nos: string): boolean {
  nos.split(',').forEach(no => {
    const idx = list.findIndex(w => w.no === no);
    if (idx !== -1) list.splice(idx, 1);
  });
  return true;
}

function saveParam(description: string) {
  const i = Math.ceil(Math.random() * 10000);
  list.unshift({
    key: i,
    no: `TradeCode ${i}`,
    value: `TradeValue ${i}`,
    description,
    updatedAt: new Date(),
    createdAt: new Date(),
  });
}

export const PARAMS = {
  '/param': (req: MockRequest) => getParam(req.queryString),
  'DELETE /param': (req: MockRequest) => removeParam(req.queryString.nos),
  'POST /param': (req: MockRequest) => saveParam(req.body.description),
};
