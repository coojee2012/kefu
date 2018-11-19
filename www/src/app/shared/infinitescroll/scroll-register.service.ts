import { ContainerRef, IPositionStats, IScrollStats } from './interface';

import { Injectable, ElementRef } from '@angular/core';
import { Observable, Subscription, fromEvent, of } from 'rxjs';

import { map, filter, switchMap, catchError, tap, sampleTime, mergeMap } from 'rxjs/operators';





export interface IScrollRegisterConfig {
  container: ContainerRef;
  throttleDuration: number;
  filterBefore: () => boolean;
  mergeMap: Function;
  scrollHandler: (value: any) => void;
}



@Injectable()
export class ScrollRegisterService {

  attachEvent(options: IScrollRegisterConfig): Subscription {
    const scroller$: Subscription = fromEvent(options.container, 'scroll')
      .pipe(
        sampleTime(options.throttleDuration),
        filter(options.filterBefore),
        mergeMap((ev: any) => of(options.mergeMap(ev)))
      )
      .subscribe(options.scrollHandler);
    return scroller$;
  }

}
