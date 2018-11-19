import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderComponent } from './content-header/content-header.component';
// import { AlertModalComponent } from './alert-modal/alert-modal.component';

/**
 * 滚动加载
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // NgbModule,
    HttpModule,
    JsonpModule,
  ],
  declarations: [
    ContentHeaderComponent,
    // AlertModalComponent
  ],
  entryComponents: [
    // AlertModalComponent,
  ],
  exports: [
    CommonModule,
    // AlertModalComponent,
    ContentHeaderComponent
  ]
})
export class SharedModule { }
