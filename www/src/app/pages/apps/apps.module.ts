import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared';
import { SidebarModule } from './sidebar';
import { HeaderComponent } from './header/header.component';
import {  NgbdDialoutModalComponent } from './header/dialout.modal.compnent';
import { NgbdEnsureModalComponent } from './user-manage/ensure.modal.compnent';
import { FooterComponent } from './footer/footer.component';
import { AppsComponent } from './apps.component';

import { ROUTER_CONFIG } from './apps.routes';

import { LoginService } from '../login/login.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APPRequestInterceptor, APPResponseInterceptor, TimingInterceptor } from '../../app.intercept';

import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    SharedModule,
    SidebarModule,
    ROUTER_CONFIG,
    LoadingPageModule, MaterialBarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: APPRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: APPResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
    LoginService,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    NgbdDialoutModalComponent,
    NgbdEnsureModalComponent,
    AppsComponent
  ],
  entryComponents: [
    NgbdDialoutModalComponent,
    NgbdEnsureModalComponent,
  ],
})
export class AppsModule { }
