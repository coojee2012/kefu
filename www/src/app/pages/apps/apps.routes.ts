/**
 * Created by Administrator on 2017/5/11.
 */

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AppsComponent } from './apps.component';

export const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    children: [
       { path: '', loadChildren: 'app/pages/apps/dashbord/dashbord.module#DashbordModule' },
       { path: 'password', loadChildren: 'app/pages/apps/dashbord/dashbord.module#DashbordModule' }
     ]
  },
  // { path: '', loadChildren: 'app/pages/apps/dashbord/dashbord.module#DashbordModule' },
];
export const ROUTER_CONFIG: ModuleWithProviders = RouterModule.forChild(routes);
