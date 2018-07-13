import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


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

  ],
  providers: [
    // UTILS_STORAGE_PROVIDERS,
  ],
  declarations: [
  ],
  exports: [
    StorageModule,
    AuthorizationModule,
  ]
})
export class CoreModule { }

