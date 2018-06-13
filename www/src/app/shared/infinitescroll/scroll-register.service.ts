import { ContainerRef, IPositionStats, IScrollStats } from './interface';

import { Injectable, ElementRef } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';







export interface IScrollRegisterConfig {
  container: ContainerRef;
  throttleDuration: number;
  filterBefore: () => boolean;
  mergeMap: Function;
  scrollHandler: (value: any) => void;
}



@Injectable()
export class ScrollRegisterService {

  attachEvent (options: IScrollRegisterConfig): Subscription {
    const scroller$: Subscription = Observable.fromEvent(options.container, 'scroll')
      .sampleTime(options.throttleDuration)
      .filter(options.filterBefore)
      .mergeMap((ev: any) => Observable.of(options.mergeMap(ev)))
      .subscribe(options.scrollHandler);
    return scroller$;
  }

}
