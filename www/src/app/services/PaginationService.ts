import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { AuthorizationService } from '../core/authorization';
@Injectable()
export class PaginationService {
    private page: number;
    private pageSize: number;
    private total: number;
    private query: any;
    private order: any;
    private url: string;
    private user: any;
    constructor(private http: HttpClient, private authorizationService: AuthorizationService) {
        this.page = 1;
        this.pageSize = 10;
        this.user = this.authorizationService.getCurrentUser().user;
    }


    setPageSize(size: number) {
        size > 0 ? this.pageSize = size : this.pageSize = 10;
    }

    setUrl(url: string) {
        this.url = url;
    }

    getData(page, query, order): Observable<any> {
        this.page = page;
        query = Object.assign({}, query, { domain: this.user.domain });
        return this.http.post(this.url, { page, query, order })
            .pipe(
                map(this.extractData.bind(this)),
                catchError(this.handleError)
            );
    }
    private extractData(res: any) {
        if (res.meta && res.meta.code === 200) {
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