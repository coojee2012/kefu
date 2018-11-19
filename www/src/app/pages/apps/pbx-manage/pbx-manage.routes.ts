/**
 * Created by Administrator on 2017/5/11.
 */

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PbxManageComponent } from './pbx-manage.component';
import { PbxExtensionComponent } from './pbx-extension/pbx-extension.component';
import { PbxQueueComponent } from './pbx-queue/pbx-queue.component';
import { PbxIvrComponent } from './pbx-ivr/pbx-ivr.component';
import { PbxConferenceComponent } from './pbx-conference/pbx-conference.component';
import { PbxRouteComponent } from './pbx-route/pbx-route.component';
import { PbxSoundsComponent } from './pbx-sounds/pbx-sounds.component';

export const routes: Routes = [
  { path: '', component: PbxManageComponent },
  { path: 'extension', component: PbxExtensionComponent },
  { path: 'queue', component: PbxQueueComponent },
  { path: 'ivr', component: PbxIvrComponent },
  { path: 'sounds', component: PbxSoundsComponent },
  { path: 'route', component: PbxRouteComponent },
  { path: 'conference', component: PbxConferenceComponent },
];
export const ROUTER_CONFIG: ModuleWithProviders = RouterModule.forChild(routes);
