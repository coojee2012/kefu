import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthorizationService } from '../../../core/authorization';
import { LoggerService } from '../../../services/LogService';
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class ChatRoomService {
    private optUser: any;
    constructor(
        private authorizationService: AuthorizationService,
        private http: HttpClient,
        private logger: LoggerService
    ) {
        this.optUser = this.authorizationService.getCurrentUser().user;
    }

    getUser() {
        return this.optUser;
    }

    // 添加一个客户
    addCustomer(data: any): Observable<any> {
        data = Object.assign({}, data, { domain: this.optUser.domain });
        return this.http.post(`/customer/${this.optUser.domain}/create`, data)
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
        return observableThrowError(errMsg);
    }

}
