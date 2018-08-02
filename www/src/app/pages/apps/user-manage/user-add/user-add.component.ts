import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../../core/authorization';
import { LoggerService } from '../../../../services/LogService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  private optUser: any;
  addUserForm: FormGroup;
  constructor(private logger: LoggerService,
    private authorizationService: AuthorizationService) {
    }

  ngOnInit() {
    this.optUser = this.authorizationService.getCurrentUser().user;
  }

  addUserSubmit(): any {

  }

}
