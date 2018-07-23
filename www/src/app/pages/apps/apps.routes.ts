/**
 * Created by Administrator on 2017/5/11.
 */

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AppsComponent } from './apps.component';
import { AuthGuard } from '../../auth-guard';
export const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', loadChildren: 'app/pages/apps/dashbord/dashbord.module#DashbordModule' },
      { path: 'chat/:id', loadChildren: 'app/pages/apps/chat-room/chat-room.module#ChatRoomModule' }
    ]
  },
];
export const ROUTER_CONFIG: ModuleWithProviders = RouterModule.forChild(routes);
