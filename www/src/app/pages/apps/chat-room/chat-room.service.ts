import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthorizationService } from '../../../core/authorization';
import { LoggerService } from '../../../services/LogService';
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { map, filter, switchMap, catchError, debounceTime } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class ChatRoomService {

    tipSource = new Subject<any>();
    tip$: Observable<any>;
    constructor(
        private authorizationService: AuthorizationService,
        private http: HttpClient,
        private logger: LoggerService
    ) {
        this.tip$ = this.tipSource.asObservable();
    }


    getUser() {
        const optUser = this.authorizationService.getCurrentUser().user;
        return optUser;
    }

    // 添加一个客户
    addCustomer(data: any): Observable<any> {
        const optUser = this.getUser();
        data = Object.assign({}, data, { domain: optUser.domain });
        return this.http.post(`/customer/${optUser.domain}/create`, data)
            .pipe(
                catchError(this.handleError)
            );
    }
    searchCustomer(searchKey: string): Observable<any> {
        const optUser = this.getUser();
        return this.http.post(`/customer/${optUser.domain}/search`, { key: searchKey })
            .pipe(
                catchError(this.handleError)
            );
    }
    bindCustomer(rid: string, customerId: string): Observable<any> {
        const optUser = this.getUser();
        return this.http.post(`/room/${optUser.domain}/bindcustorm`, { rid: rid, customerId: customerId })
            .pipe(
                catchError(this.handleError)
            );
    }

    modifyCustomer(customId: string, data: any): Observable<any> {
        const optUser = this.getUser();
        data = Object.assign({}, data, { domain: optUser.domain });
        return this.http.post(`/customer/${optUser.domain}/update/${customId}`, data)
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
