import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthorizationService } from '../../../core/authorization';
import { LoggerService } from '../../../services/LogService';
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    constructor(
        private http: HttpClient,
        private authorizationService: AuthorizationService,
        private logger: LoggerService
    ) {
    }

    getUser() {
        // 切记将用户放在service的consgtrouctor否则会有BUG  会读取之前用户的记录信息 如果有两个用户在同一个浏览器切换登录
        const optUser = this.authorizationService.getCurrentUser().user;
        return optUser;
    }

    checkIn(): Observable<any> {
        const optUser = this.authorizationService.getCurrentUser().user;
        return this.http.post(`/pbx/extension/${optUser.domain}/checkin`, { extension: optUser.extension })
            .pipe(
                catchError(this.handleError)
            );
    }

    checkOut(): Observable<any> {
        const optUser = this.authorizationService.getCurrentUser().user;
        return this.http.post(`/pbx/extension/${optUser.domain}/checkout`, { extension: optUser.extension })
            .pipe(
                catchError(this.handleError)
            );
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
