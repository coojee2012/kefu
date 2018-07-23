import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared';
import { SidebarModule } from './sidebar';
import { HeaderComponent } from './header/header.component';
import {  NgbdDialoutModalComponent } from './header/dialout.modal.compnent';
import { FooterComponent } from './footer/footer.component';
import { AppsComponent } from './apps.component';

import { ROUTER_CONFIG } from './apps.routes';

import { LoginService } from '../login/login.service';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    SidebarModule,
    ROUTER_CONFIG,
    LoadingPageModule, MaterialBarModule,
  ],
  providers: [
    LoginService
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    NgbdDialoutModalComponent,
    AppsComponent
  ],
  entryComponents: [
    NgbdDialoutModalComponent,
  ],
})
export class AppsModule { }
