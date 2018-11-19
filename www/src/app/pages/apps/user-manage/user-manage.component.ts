import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { NgbdEnsureModalComponent } from './ensure.modal.compnent';
import { AuthorizationService } from '../../../core/authorization';
import { LoggerService } from '../../../services/LogService';
import { PaginationService } from '../../../services/PaginationService';
import { UserManageService } from './user-manage.service';
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
  private sort: any;
  private tipMsg: string;
  private tipStyle: string;
  private _success = new Subject<string>();
  constructor(private logger: LoggerService,
    private modalService: NgbModal,
    private userManageService: UserManageService,
    private paginationService: PaginationService,
    private authorizationService: AuthorizationService) {
    this.page = 1;
    this.searchKey = '';
    this.user = this.authorizationService.getCurrentUser().user;
    this.userList = [];
    this.sort = {
      nickname: 1,
      username: 1
    };
    this.tipMsg = '';
  }

  ngOnInit() {
    this.paginationService.setUrl(`/user/${this.user.domain}/list`);
    this.getData(1);
    this._success.subscribe((message) => {
      this.tipMsg = message;
    });
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => {
      this.logger.debug('_success debouce');
      this.tipMsg = '';
      this.tipStyle = '';
    });
  }
  async onEnter() {
    try {
      // await this.sendMsg();
      this.logger.debug('search searchKey', this.searchKey);
      this.page = 1;
      this.getData(this.page);
    } catch (ex) {
      this.logger.error('onEnter Error:', ex);
    }
  }

  async delUser(id, name) {
    try {
      this.logger.debug('删除用户:', id, name);
      const modalRef = this.modalService.open(NgbdEnsureModalComponent, {
        size: 'sm',
        centered: true,
        windowClass: 'modal-danger in'
      });
      modalRef.componentInstance.name = `确认要删除用户:【 ${name} 】吗？注意，删除后无法恢复！`;
      const result = await modalRef.result;
      if (result === 'yes') {
        await new Promise((resolve, reject) => {
          const subscription = this.userManageService.delUser(id)
            .subscribe(
              results => {
                if (results.meta && results.meta.code === 200) {
                  subscription.unsubscribe();
                  resolve();
                } else {
                  subscription.unsubscribe();
                  this.tipStyle = 'danger';
                  this._success.next(results.meta.message);
                }
              },
              error => {
                subscription.unsubscribe();
                reject(error);
              });
        });
        this.getData(this.page);
        this.tipStyle = 'success';
        this._success.next('删除成功');
      } else {
        this.tipStyle = 'danger';
        this._success.next('取消删除');
      }
    } catch (ex) {
      this.logger.error('删除用户发生异常:', ex);
      this.tipStyle = 'danger';
      this._success.next('删除用户发生内部错误！');
    }

  }

  async resetPassword(id, name) {
    try {
      const modalRef = this.modalService.open(NgbdEnsureModalComponent, {
        size: 'sm',
        centered: true,
        windowClass: 'modal-warning in'
      });
      modalRef.componentInstance.name = `确认要重置用户:【 ${name} 】的密码为111111吗？`;
      const result = await modalRef.result;
      if (result === 'yes') {
        await new Promise((resolve, reject) => {
          const subscription = this.userManageService.resetPwd(id)
            .subscribe(
              results => {
                if (results.meta && results.meta.code === 200) {
                  subscription.unsubscribe();
                  resolve();
                } else {
                  subscription.unsubscribe();
                  // this.isSubmitError = true;
                  // this._success.next(results.meta.message);
                }
              },
              error => {
                subscription.unsubscribe();
                reject(error);
              });
        });
        this.getData(this.page);
        this.tipStyle = 'success';
        this._success.next('重置成功！');
      } else {
        this.tipStyle = 'danger';
        this._success.next('取消密码重置！');
      }
    } catch (ex) {
      this.logger.error('重置密码发生异常:', ex);
      this.tipStyle = 'danger';
      this._success.next('重置密码发生内部错误！');
    }

  }


  async search() {
    try {
      // await this.sendMsg();
      this.logger.debug('search searchKey', this.searchKey);
      this.page = 1;
      this.getData(this.page);
    } catch (ex) {
      this.logger.error('search Error:', ex);
    }
  }

  setOrder(key) {
    if (this.sort[key] === 1) {
      this.sort[key] = -1;
    } else {
      this.sort[key] = 1;
    }
    this.getData(this.page);
  }

  getData(page) {
    const subscription = this.paginationService.getData(page, this.searchKey, this.sort)
      .subscribe(
        (result) => {
          this.logger.debug('result:', result);
          if (result.meta.code === 200) {
            this.userList = result.data.users;
            subscription.unsubscribe();
          } else {
            // this.isSubmitError = true;
            subscription.unsubscribe();
          }
        },
        (error) => {
          subscription.unsubscribe();
        }
      );
  }
  pageChange(e) {
    console.log('page changes ', e);
    this.page = +e;
    this.getData(e);
  }

}
