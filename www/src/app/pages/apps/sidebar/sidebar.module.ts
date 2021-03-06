import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SidebarSearchComponent } from './sidebar-search/sidebar-search.component';
import { SidebarUserPannelComponent } from './sidebar-user-pannel/sidebar-user-pannel.component';
// import { ROUTER_CONFIG } from './sidebar.routes';
@NgModule({
  imports: [
    CommonModule,
    RouterModule
    //  ROUTER_CONFIG
  ],
  declarations: [
    SidebarComponent,
    SidebarSearchComponent,
    SidebarUserPannelComponent
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
