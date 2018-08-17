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
    private optUser: any;
    constructor(
        private authorizationService: AuthorizationService,
        private logger: LoggerService
    ) {
        this.optUser = this.authorizationService.getCurrentUser().user;
    }

    getUser() {
        return this.optUser;
    }

}
