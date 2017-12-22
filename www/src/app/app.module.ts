import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
/*
 * Platform and Environment providers/directives/pipes
 */
import {ROUTING} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';

import {CoreModule} from './core';
import {SharedModule} from './shared';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {APPRequestInterceptor, APPResponseInterceptor, TimingInterceptor} from './app.intercept';

import { LoggerService } from './services/LogService';
import { DeepStreamService } from './services/DeepStreamService';
// Application wide providers
const APP_PROVIDERS = [
    {provide: HTTP_INTERCEPTORS, useClass: APPRequestInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: APPResponseInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true},
    {provide: LoggerService, useClass: LoggerService},
    {provide: DeepStreamService, useClass: DeepStreamService}
  ];

@NgModule({
    imports: [
        // BrowserModule.withServerTransition({appId: 'ang4-seo-pre'}),
        BrowserModule,
        HttpClientModule,
        NgbModule.forRoot(),
        CoreModule,
        SharedModule,
        ROUTING
      ],
    declarations: [
        AppComponent
    ],
    providers: [
        ...APP_PROVIDERS
      ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
