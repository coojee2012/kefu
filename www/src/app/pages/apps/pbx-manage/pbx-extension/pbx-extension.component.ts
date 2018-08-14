import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbdEnsureModalComponent } from '../../user-manage/ensure.modal.compnent';
import { LoggerService } from '../../../../services/LogService';
import { PbxManageService } from '../pbx-manage.service';
@Component({
  selector: 'app-pbx-extension',
  templateUrl: './pbx-extension.component.html',
  styleUrls: ['./pbx-extension.component.css']
})
export class PbxExtensionComponent implements OnInit {

  private singleExnten: string;
  private singlexPwd: string;
  private multiExnten: string;
  private multiPwd: string;
  private sort: any;
  private tipMsg: string;
  private tipStyle: string;
  private extenList: any[];
  private _success = new Subject<string>();
  constructor(
    private service: PbxManageService,
    private modalService: NgbModal,
    private logger: LoggerService,
  ) {
    this.singleExnten = '';
    this.singlexPwd = '';
    this.multiExnten = '';
    this.multiPwd = '';
    this.extenList = [];
    this.sort = {
      accountCode: 1,
    };
  }

  ngOnInit() {
    this.getList();
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

  checkExten(exten: string): boolean {
    return /^[1-9]\d\d\d$/.test(exten);
  }

  checkPwd(pwd: string): boolean {
    return /^[a-zA-Z0-9_-]{6,6}$/.test(pwd);
  }

  async saveSingleExten() {
    try {
      if (!this.checkExten(this.singleExnten) || !this.checkPwd(this.singlexPwd)) {
        this.tipStyle = 'danger';
        this._success.next('分机或密码格式错误！');
        return;
      }
      await new Promise((resolve, reject) => {
        const subscription = this.service.addExtension({
          accountCode: this.singleExnten,
          password: this.singlexPwd
        })
          .subscribe(results => {
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
      await this.getList();
    } catch (ex) {
      this.logger.error('Add exntension  error:', ex);
      this.tipStyle = 'danger';
      this._success.next('添加分机异常！请稍后重试！');
    }
  }

  async saveMutiExten() {
    try {
      const [preExten, endExten] = this.multiExnten.split('-');
      if (!this.checkExten(preExten) || !this.checkExten(endExten) || !this.checkPwd(this.multiPwd)) {
        this.tipStyle = 'danger';
        this._success.next('分机或密码格式错误！');
        return;
      }
      await new Promise((resolve, reject) => {
        const subscription = this.service.addMutiExtension({
          accountCode: this.multiExnten,
          password: this.multiPwd
        })
          .subscribe(results => {
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
      await this.getList();
    } catch (ex) {
      this.logger.error('Add mutil exntension  error:', ex);
      this.tipStyle = 'danger';
      this._success.next('添加分机异常！请稍后重试！');
    }

  }

  async getList() {
    try {
      await new Promise((resolve, reject) => {
        const subscription = this.service.getExtension(this.sort)
          .subscribe(results => {
            if (results.meta && results.meta.code === 200) {
              this.extenList = results.data;
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

    } catch (ex) {
      this.logger.error('Get exntension list error:', ex);
      this.tipStyle = 'danger';
      this._success.next('获取数据异常！请稍后重试！');
    }
  }

  setOrder(key: string) {
    if (this.sort[key] === 1) {
      this.sort[key] = -1;
    } else {
      this.sort[key] = 1;
    }
    this.getList();
  }

  async resetPassword(id, accountCode) {

  }
  async delExten(id, accountCode) {
    try {
      const modalRef = this.modalService.open(NgbdEnsureModalComponent, {
        size: 'sm',
        centered: true,
        windowClass: 'modal-danger in'
      });
      modalRef.componentInstance.name = `确认要删除分机:【 ${accountCode} 】吗？注意，删除后无法恢复！`;
      const result = await modalRef.result;
      if (result === 'yes') {
        await new Promise((resolve, reject) => {
          const subscription = this.service.delExtension(id)
            .subscribe(results => {
              if (results.meta && results.meta.code === 200) {
                this.getList();
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
      }

    } catch (ex) {
      this.logger.error('Get exntension list error:', ex);
      this.tipStyle = 'danger';
      this._success.next('获取数据异常！请稍后重试！');
    }
  }

}
