import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/*
 * Platform and Environment providers/directives/pipes
 */
import { AppRoutingModule } from './app.routing.module';
// App is our top level component
import { AppComponent } from './app.component';

import { CoreModule } from './core';
import { SharedModule } from './shared';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APPRequestInterceptor, APPResponseInterceptor, TimingInterceptor } from './app.intercept';




import { LoggerService } from './services/LogService';
import { DeepStreamService } from './services/DeepStreamService';
import { SIPService } from './services/SIPService';
import { DataService } from './services/DataService';
import { AuthGuard } from './auth-guard';
// Application wide providers
const APP_PROVIDERS = [
    { provide: HTTP_INTERCEPTORS, useClass: APPRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: APPResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
    { provide: LoggerService, useClass: LoggerService },
    { provide: DeepStreamService, useClass: DeepStreamService },
    { provide: SIPService, useClass: SIPService },
    { provide: AuthGuard, useClass: AuthGuard },
    { provide: DataService, useClass: DataService },
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
