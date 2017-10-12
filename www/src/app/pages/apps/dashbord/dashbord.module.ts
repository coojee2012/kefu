import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { ContentContentComponent } from '../content-content/content-content.component';
import { DashbordComponent } from './dashbord.component';
import { ROUTER_CONFIG } from './dashbord.routes';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ROUTER_CONFIG
  ],
  declarations: [
    DashbordComponent,
    ContentContentComponent
  ]
})
export class DashbordModule { }
