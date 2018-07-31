import { Component, OnInit } from '@angular/core';
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
  constructor(private logger: LoggerService, private paginationService: PaginationService) {

    this.page = 1;
    this.searchKey = '';

  }

  ngOnInit() {
  }
  async onEnter() {
    try {
      // await this.sendMsg();
      this.logger.debug('searchKey', this.searchKey);
    } catch (ex) {
      this.logger.error('onEnter Error:', ex);
    }
  }
  pageChange(e) {
    console.log('page changes ', e);
  }

}
