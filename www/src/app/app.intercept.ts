
/**
 * Created by LinYong on 2017/8/1.
 * update 6
 * do -> tap
 * catch -> catchError
 * switch -> switchAll
 * finally -> finalize
 */
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationService } from './core/authorization/authorization.service';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';

import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap, catchError, tap } from 'rxjs/operators';
/**
 * 是否是对象
 * @param value
 */
function isObject(value: any): boolean {
  return value !== null && typeof value === 'object';
}

/**
 * 是否是undefined
 * @param value
 */
function isUndefined(value: any) {
  return typeof value === 'undefined';
}

/**
 * 是否是空
 * @param value
 */
function isEmpty(value: any) {
  return isUndefined(value) || value === null || value === '';
}


@Injectable()
export class APPRequestInterceptor implements HttpInterceptor {
  constructor(private authorizationService: AuthorizationService) {

  }
  /**
   * 请求拦截器 (Request Interceptor)
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let JWT = '';
    if (!!this.authorizationService.getCurrentUser()) {
      JWT = `Bearer ${this.authorizationService.getCurrentUser().token}`;
    }
    req = req.clone({
      setHeaders: {
        Authorization: JWT
      },
      url: environment.api.host + req.url
    });
    console.log(req.params, this.authorizationService.getCurrentUser(), environment);
    return next.handle(req);
  }
}

@Injectable()
export class APPResponseInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }
  /**
   * 响应拦截器 (Response Interceptor)
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        map(event => {
          console.log('Response map', event);
          return event;
        }),
        // catchError((err,cau) => {
        //   return event;
        // })
    );
  }


  // catchError(err => {
  //   console.log('Response catch', err);
  //   if (err instanceof HttpErrorResponse) {
  //     switch (err.status) {
  //       case 401:
  //         return observableThrowError(err);
  //       case 403:
  //         break;
  //       case 404:
  //         break;
  //       case 500:
  //         break;
  //     }
  //   }
  // })
}
/**
 * 我们也可以使用拦截器来实现缓存。比如，假设我们已经写了一个 HTTP 缓存，它具有如下的简单接口：
 */
abstract class HttpCache {
  /**
   * Returns a cached response, if any, or null if not present.
   */
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;

  /**
   * Adds or updates the response in the cache.
   */
  abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: HttpCache) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Before doing anything, it's important to only cache GET requests.
    // Skip this interceptor if the request method isn't GET.
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // First, check the cache to see if this request exists.
    const cachedResponse = this.cache.get(req);
    if (cachedResponse) {
      // A cached response exists. Serve it instead of forwarding
      // the request to the next handler.
      return of(cachedResponse);
    }

    // No cached response exists. Go to the network, and cache
    // the response when it arrives.
    return next.handle(req)
    .pipe(
      tap(event => {
        // Remember, there may be other events besides just the response.
        if (event instanceof HttpResponse) {
          // Update the cache.
          this.cache.put(req, event);
        }
      })
    );
  }
}

/**
 * 记日志
 * 由于拦截器可以同时处理请求和响应，因此可以用来记日志或请求计时等。考虑下面这个拦截器，它使用console.log来显示每个请求花了多久：
 */
@Injectable()
export class TimingInterceptor implements HttpInterceptor {
  constructor(private auth: AuthorizationService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    return next
      .handle(req)
      .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
          }
        })
      )
      ;
  }
}
