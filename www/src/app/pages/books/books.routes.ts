/**
 * Created by Administrator on 2017/5/11.
 */

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { BooksComponent } from './books.component';
import { NotFoundComponent } from '../../shared/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: NotFoundComponent },
  {
    path: ':id', component: BooksComponent
  }
];
export const ROUTER_CONFIG: ModuleWithProviders = RouterModule.forChild(routes);
