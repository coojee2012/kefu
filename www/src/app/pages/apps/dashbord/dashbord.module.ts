import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from '../content-header/content-header.component';
import { ContentContentComponent } from '../content-content/content-content.component';
import { DashbordComponent } from './dashbord.component';
import { ROUTER_CONFIG } from './dashbord.routes';
@NgModule({
  imports: [
    CommonModule,
    ROUTER_CONFIG
  ],
  declarations: [
    DashbordComponent,
    ContentHeaderComponent,
    ContentContentComponent
  ]
})
export class DashbordModule { }
