import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BoxModule, TabsModule, DropdownModule } from 'angular-admin-lte';

import { HeaderInnerComponent } from './header-inner/header-inner.component';
import { SidebarLeftInnerComponent } from './sidebar-left-inner/sidebar-left-inner.component';
import { SidebarRightInnerComponent } from './sidebar-right-inner/sidebar-right-inner.component';

// import { UTILS_STORAGE_PROVIDERS } from './utils-service/utils.service';
/**
 * 数据缓存）
 */
import { StorageModule } from './storage';
/**
 * 认证
 */
import { AuthorizationModule } from './authorization';
import { LoadingModule } from './loading';
import { LoggerModule } from './logger';
@NgModule({
  imports: [
    HttpModule,
    LoadingModule,
    StorageModule,
    AuthorizationModule,
    LoggerModule,
    DropdownModule,
    TabsModule,
    BoxModule
  ],
  providers: [
    // UTILS_STORAGE_PROVIDERS,
  ],
  declarations: [
    HeaderInnerComponent, SidebarLeftInnerComponent, SidebarRightInnerComponent
  ],
  exports: [
    StorageModule,
    AuthorizationModule,
    BoxModule, TabsModule, HeaderInnerComponent, SidebarLeftInnerComponent, SidebarRightInnerComponent
  ]
})
export class CoreModule { }

