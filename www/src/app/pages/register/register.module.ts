import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ROUTER_CONFIG } from './register.routes';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    ROUTER_CONFIG
  ],
  declarations: [
    RegisterComponent
  ]
})
export class RegisterModule { }
