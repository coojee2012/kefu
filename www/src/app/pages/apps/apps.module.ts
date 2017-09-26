import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { AppsComponent } from './apps.component';

import { ROUTER_CONFIG } from './apps.routes';

import {NavbarComponent} from './navbar/navbar.component';
import {SearchComponent} from './search/search.component';
import {ProductComponent} from './product/product.component';
import {CarouselComponent} from './carousel/carousel.component';
import {FooterComponent} from './footer/footer.component';
import {StarsComponent} from './stars/stars.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentWrapperComponent } from './content-wrapper/content-wrapper.component';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { ContentContentComponent } from './content-content/content-content.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
    SidebarComponent,
    ContentContentComponent,
    ContentHeaderComponent,
    ContentWrapperComponent,
    AppsComponent
  ]
})
export class AppsModule { }
