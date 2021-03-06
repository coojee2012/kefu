import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared';
import { UserManageComponent } from './user-manage.component';
import { ROUTER_CONFIG } from './user-manage.routes';
import { PaginationService } from '../../../services/PaginationService';
import { UserAddComponent } from './user-add/user-add.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    ROUTER_CONFIG
  ],
  providers: [PaginationService],
  declarations: [
    UserManageComponent,
    UserAddComponent,
    UserProfileComponent
  ]
})
export class UserManageModule { }
