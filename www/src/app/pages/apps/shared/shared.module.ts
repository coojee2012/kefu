import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ContentHeaderComponent } from './content-header/content-header.component';

/**
 * 滚动加载
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
  ],
  declarations: [
    ContentHeaderComponent
  ],
  exports: [
    CommonModule,
    ContentHeaderComponent
  ]
})
export class SharedModule { }
