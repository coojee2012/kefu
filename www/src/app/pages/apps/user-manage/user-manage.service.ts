import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


import { AuthorizationService } from '../../../core/authorization';
import { LoggerService } from '../../../services/LogService';
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserManageService {
  private optUser: any;
  constructor(private http: HttpClient,
    private authorizationService: AuthorizationService,
    private logger: LoggerService
  ) {
    this.optUser = this.authorizationService.getCurrentUser().user;
  }
  addUser(data: any): Observable<any> {
    data = Object.assign({}, data, { domain: this.optUser.domain });
    return this.http.post(`/user/${this.optUser.domain}/add`, data)
      .pipe(
        map(this.extractData.bind(this)),
        catchError(this.handleError)
      );
  }

  delUser(id) {

  }

  resetPwd(id) {

  }

  private extractData(res: any) {
    if (res.meta && res.meta.code === 200) {
      // this.authorizationService.setCurrentUser(res.data);
    }
    return res || { meta: {}, data: {} };
  }
  private handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof HttpResponse) {
      const body = error.body || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
