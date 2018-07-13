import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
/*
 * Platform and Environment providers/directives/pipes
 */
import { AppRoutingModule } from './app.routing.module';
// App is our top level component
import {AppComponent} from './app.component';

import {CoreModule} from './core';
import {SharedModule} from './shared';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {APPRequestInterceptor, APPResponseInterceptor, TimingInterceptor} from './app.intercept';


import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';

import { LoggerService } from './services/LogService';
import { DeepStreamService } from './services/DeepStreamService';
import { SIPService } from './services/SIPService';
// Application wide providers
const APP_PROVIDERS = [
    {provide: HTTP_INTERCEPTORS, useClass: APPRequestInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: APPResponseInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true},
    {provide: LoggerService, useClass: LoggerService},
    {provide: DeepStreamService, useClass: DeepStreamService},
    {provide: SIPService, useClass: SIPService}
  ];

@NgModule({
    imports: [
        // BrowserModule.withServerTransition({appId: 'ang4-seo-pre'}),
        BrowserModule,
        HttpClientModule,
        NgbModule.forRoot(),
        CoreModule,
        SharedModule,
        AppRoutingModule,
        LoadingPageModule, MaterialBarModule
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
