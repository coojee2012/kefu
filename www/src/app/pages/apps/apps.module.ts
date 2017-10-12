import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared';
import { SidebarModule } from './sidebar';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppsComponent } from './apps.component';

import { ROUTER_CONFIG } from './apps.routes';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    SidebarModule,
    ROUTER_CONFIG
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppsComponent
  ],
})
export class AppsModule { }
