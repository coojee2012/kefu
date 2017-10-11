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
       { path: 'dashbord', loadChildren: 'app/pages/apps/dashbord/dashbord.module#DashbordModule' },
       { path: 'chat', loadChildren: 'app/pages/apps/chat-room/chat-room.module#ChatRoomModule' }
     ]
  },
  // { path: '', loadChildren: 'app/pages/apps/dashbord/dashbord.module#DashbordModule' },
];
export const ROUTER_CONFIG: ModuleWithProviders = RouterModule.forChild(routes);
