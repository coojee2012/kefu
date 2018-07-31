import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared';
import { UserManageComponent } from './user-manage.component';
import { ROUTER_CONFIG } from './user-manage.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ROUTER_CONFIG
  ],
  declarations: [
    UserManageComponent
  ]
})
export class UserManageModule { }
