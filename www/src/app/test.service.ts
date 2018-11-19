import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Gundam } from '../logicModel/gundam';

@Injectable()

export class TestService {
  private api = 'http://localhost:4000';
  private gundamList = '/gundamlist';
  private gundamDeail = '/detail';
  constructor(private http: Http) { }
// 获得全部数据
  getGundams(): Promise<Gundam[]> {
    return this.http.get(this.api + this.gundamList)
        .toPromise()
        .then(response => response.json() as Gundam[])
        .catch(this.handleError);
  }
// 根据Id查询高达
  getGundamById(id: number): Promise<Gundam> {
    return this.http.get(this.api + this.gundamDeail + '?id=' + id)
        .toPromise().then( jsonStr => jsonStr.json() as Gundam)
        .catch(this.handleError);
  }
// 捕获异常并输出
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
