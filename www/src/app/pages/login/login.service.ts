import { Observable, Subject, ReplaySubject, from, of, range, throwError } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthorizationService } from '../../core/authorization';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LoginService {

  constructor(protected http: HttpClient,
    private authorizationService: AuthorizationService) {
  }

  isLogin(): boolean {
    return this.authorizationService.isLogin();
  }

  /**
   * 登录
   * @param loginInfo
   */
  login(loginInfo: { username: string; password: string }): Observable<any> {
    const authorizationService = this.authorizationService;
    console.log(loginInfo, authorizationService);
    return this.http.post('/login', loginInfo)
      .pipe(
        map((user: any) => {
          console.log(user);
          if (user.meta.code === 200) {
            authorizationService.setCurrentUser(user.data);
          }
          return user;
        })
      );
  }

  /**
   * 退出登录
   */
  logout(): Observable<any> {
    return this.http.post('/logout', {})
      .pipe(
        map((res: any) => {
          console.log('logiouttt :', res);
          if (res.meta.code === 200) {

          } else {
          }
          this.authorizationService.logout();
          return res;
        }),
        catchError((error) => {
          this.authorizationService.logout();
          return throwError(error);
        })
      );
  }
}
