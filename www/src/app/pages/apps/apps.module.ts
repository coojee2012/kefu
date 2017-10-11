import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared';
import { SidebarModule } from './sidebar';
import { AppsComponent } from './apps.component';

import { ROUTER_CONFIG } from './apps.routes';

import { NavbarComponent } from './navbar/navbar.component';
import { SearchComponent } from './search/search.component';
import { ProductComponent } from './product/product.component';
import { CarouselComponent } from './carousel/carousel.component';
import { FooterComponent } from './footer/footer.component';
import { StarsComponent } from './stars/stars.component';
import { HeaderComponent } from './header/header.component';
import { ContentWrapperComponent } from './content-wrapper/content-wrapper.component';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    SidebarModule,
    ROUTER_CONFIG
  ],
  declarations: [
    NavbarComponent,
    SearchComponent,
    ProductComponent,
    CarouselComponent,
    FooterComponent,
    StarsComponent,
    HeaderComponent,
    ContentWrapperComponent,
    AppsComponent
  ]
})
export class AppsModule { }
