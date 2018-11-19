/**
 * Created by Administrator on 2017/5/11.
 */

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { UserManageComponent } from './user-manage.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: UserManageComponent },
  { path: 'useradd', component: UserAddComponent },
  { path: 'user/:id', component: UserProfileComponent }
];
export const ROUTER_CONFIG: ModuleWithProviders = RouterModule.forChild(routes);
