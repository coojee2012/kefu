import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared';
import { SidebarModule } from './sidebar';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppsComponent } from './apps.component';

import { ROUTER_CONFIG } from './apps.routes';
import {CoreModule} from '../../core';

import { adminLteConf } from '../../admin-lte.conf';
import { LayoutModule } from 'angular-admin-lte';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    SidebarModule,
    ROUTER_CONFIG,
    CoreModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, MaterialBarModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppsComponent
  ],
})
export class AppsModule { }
