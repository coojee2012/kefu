
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { map, filter, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class RegisterService {
  private registerUrl = 'http://localhost:3000/api/v1/register';  // URL to web API
  constructor (private http: Http) {}
  register(data: any): Observable<any> {
    return this.http.post(this.registerUrl, data)
                    .pipe(
                      map(this.extractData),
                      catchError(this.handleError)
                    );
  }
  private extractData(res: Response) {
    return res.json() || {};
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
