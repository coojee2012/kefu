import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from '@angular/core';


import { Observable, Subscription, fromEvent, of  } from 'rxjs';

import { map, filter, switchMap, catchError, tap, sampleTime, mergeMap , takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-verify-sliderbar',
  templateUrl: './verify-sliderbar.component.html',
  styleUrls: ['./verify-sliderbar.component.css']
})
export class VerifySliderbarComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output('checked') checked = new EventEmitter<boolean>();
  private elementLeft: any;
  private dragBg: any;
  @ViewChild('DragText') dragText: any;
  private dispose: any;

  constructor(private element: ElementRef, private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    console.log(this.dragText.innerHTML);
  }

  init() {
    this.elementLeft = this.getTranslate(this.element.nativeElement);
    this.dragBg = this.element.nativeElement.querySelector('.drag_bg');
    this.dragText = this.element.nativeElement.querySelector('.drag_text');
    const $handler = this.element.nativeElement.querySelector('.handler');
    const mouseDown$ = fromEvent($handler, 'mousedown');
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');
    this.dispose = mouseDown$.pipe(
      map((event) => {
        return ({
          pos: this.getTranslate($handler),
          event,
        });
      }),
      switchMap((initialState) => {
        const initialPos = initialState.pos;
        const clientX = (initialState.event as any).clientX;
        console.log(this.dragText);
        return mouseMove$.pipe(map((moveEvent: any) => {
          return {
            x: moveEvent.clientX - clientX + initialPos.x
          };
        }),
        takeUntil(mouseUp$.pipe(tap((moveEvent: any) => {
          console.log('moveEvent', moveEvent.x - this.elementLeft.x, 266);
          const that = this;
          if (moveEvent.x - this.elementLeft.x < 300) {
            this.renderer2.addClass(this.dragBg, 'animation');
            this.renderer2.addClass($handler, 'animation');
            this.setStyle($handler, 0);
            setTimeout(function () {
              that.renderer2.removeClass(that.dragBg, 'animation');
              that.renderer2.removeClass($handler, 'animation');
            }, 300);
          }
        })))
      );
      })
    ).
      subscribe((pos) => {
        this.setTranslate($handler, pos);
      });
  }

  ngOnDestroy() {
  }

  private getTranslate(obj: any) {
    return {x: obj.getBoundingClientRect().left};
  }

  private setTranslate(obj: any, pos: any) {
    let left = 0;
    if (pos.x - this.elementLeft.x <= 0) {
      left = 0;
    } else if (pos.x - this.elementLeft.x >= 266) {
      left = 266;
      this.renderer2.addClass(obj, 'handler_ok_bg');
      this.renderer2.addClass(this.element.nativeElement, 'slide_ok');
      this.dragText.innerHTML = '验证成功';
      this.checked.emit(true);
      this.dispose.complete();
    } else {
      left = pos.x - this.elementLeft.x;
    }
    this.setStyle(obj, left);
  }

  private setStyle(obj: any, num: number) {
    this.renderer2.setStyle(this.dragBg, 'width', `${num}px`);
    this.renderer2.setStyle(obj, 'left', `${num}px`);
  }
}
