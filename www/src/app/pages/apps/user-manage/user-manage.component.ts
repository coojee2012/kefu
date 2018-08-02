import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../core/authorization';
import { LoggerService } from '../../../services/LogService';
import { PaginationService } from '../../../services/PaginationService';
@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  private page: number;
  private searchKey: string;
  private user: any;
  private userList: any[];
  constructor(private logger: LoggerService,
    private paginationService: PaginationService,
    private authorizationService: AuthorizationService) {
    this.page = 1;
    this.searchKey = '';
    this.user = this.authorizationService.getCurrentUser().user;
    this.userList = [];
  }

  ngOnInit() {
    this.paginationService.setUrl(`/user/${this.user.domain}/list`);
    this.getData(1);
  }
  async onEnter() {
    try {
      // await this.sendMsg();
      this.logger.debug('searchKey', this.searchKey);
      this.getData(this.page);
    } catch (ex) {
      this.logger.error('onEnter Error:', ex);
    }
  }

  getData(page) {
    this.paginationService.getData(page, this.searchKey, {})
      .subscribe(
        (result) => {
          this.logger.debug('result:', result);
          if (result.meta.code === 200) {
            this.userList = result.data.users;
          } else {
            // this.isSubmitError = true;

          }
        },
        (error) => {

        }
      );
  }
  pageChange(e) {
    console.log('page changes ', e);
    this.page = +e;
    this.getData(e);
  }

}
