
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


import { AuthorizationService } from '../../core/authorization';
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class RegisterService {
  constructor(private http: HttpClient, private authorizationService: AuthorizationService) { }
  register(data: any): Observable<any> {
    return this.http.post('/register', data)
      .pipe(
        map(this.extractData.bind(this)),
        catchError(this.handleError)
      );
  }
  private extractData(res: any) {
    if (res.meta && res.meta.code === 200) {
      this.authorizationService.setCurrentUser(res.data);
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
