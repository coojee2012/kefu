import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { PbxManageComponent } from './pbx-manage.component';
import { ROUTER_CONFIG } from './pbx-manage.routes';
import { PaginationService } from '../../../services/PaginationService';
import { PbxExtensionComponent } from './pbx-extension/pbx-extension.component';
import { PbxQueueComponent } from './pbx-queue/pbx-queue.component';
import { PbxIvrComponent } from './pbx-ivr/pbx-ivr.component';
import { PbxRouteComponent } from './pbx-route/pbx-route.component';
import { PbxSoundsComponent } from './pbx-sounds/pbx-sounds.component';
import { PbxMemuComponent } from './pbx-memu/pbx-memu.component';
import { PbxConferenceComponent } from './pbx-conference/pbx-conference.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    ROUTER_CONFIG
  ],
  providers: [ PaginationService ],
  declarations: [PbxManageComponent, PbxExtensionComponent, PbxQueueComponent,
     PbxIvrComponent, PbxRouteComponent, PbxSoundsComponent, PbxMemuComponent, PbxConferenceComponent]
})
export class PbxManageModule { }
