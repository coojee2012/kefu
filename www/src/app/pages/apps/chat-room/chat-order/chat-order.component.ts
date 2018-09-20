import { Component, OnInit, Input } from '@angular/core';
import { AuthorizationService } from '../../../../core/authorization';
import { LoggerService } from '../../../../services/LogService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatRoomService } from '../chat-room.service';
import { DataService, Room } from '../../../../services/DataService';
@Component({
  selector: 'app-chat-order',
  templateUrl: './chat-order.component.html',
  styleUrls: ['./chat-order.component.css']
})
export class ChatOrderComponent implements OnInit {
  @Input() roomId: string;
  private relationCustomId: string;
  private memu: string;
  private searchCustomKey: string;
  addCustomForm: FormGroup;
  private custormFromFolded: boolean;
  private bindCustormListShowed: boolean;
  private searchCustormerList: any[];

  constructor(
    private service: ChatRoomService,
    private logger: LoggerService,
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.memu = 'list';
    this.custormFromFolded = false;
    this.bindCustormListShowed = false;
  }

  ngOnInit() {
    this.searchCustomKey = '';
    this.searchCustormerList = [];
    this.createCustormForm();
  }

  action(memu: string) {
    this.memu = memu;
  }

  /**
   * //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
   * var pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
   * //用户名正则，4到16位（字母，数字，下划线，减号）
   * var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
   * //手机号正则
   * var mPattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
   * //ipv4地址正则
   * var ipP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
   * // 邮箱
   * ^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$
   */
  createCustormForm(): void {

    this.addCustomForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(12)
        ]
      ],
      email: [
        '',
        [
          Validators.pattern(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/),
          Validators.minLength(4),
          Validators.maxLength(32)
        ]
      ],
      mobile: [
        '',
        [
          Validators.pattern(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16[0-9])|(17[0-9])|(18[0,5-9])|(19[0-9]))\d{8}$/),
        ]
      ],
      level: [
        '0',
        [
          Validators.required,
        ]
      ],
      telphone: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(11)
        ]
      ],
      companyName: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(64)
        ]
      ],
      memo: [
        '',
        [
          Validators.maxLength(256),
        ]
      ],
      address: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(64)
        ]
      ]
    });



    // this.addUserForm.valueChanges
    //   .subscribe(data => this.onValueChanged(data));

    // this.registerForm.get('username').valueChanges
    //   .subscribe(value => this.checkMobile(value));
  }

  async bindCustomSearch() {
    try {
      if (!this.searchCustomKey) {
        return;
      }
      await new Promise((resolve, reject) => {
        const subscription = this.service.searchCustomer(this.searchCustomKey)
          .subscribe(results => {
            if (results.meta && results.meta.code === 200) {
              subscription.unsubscribe();
              this.searchCustormerList = results.data;
              resolve();
            } else {
              subscription.unsubscribe();
              reject(results);
            }
          },
            error => {
              subscription.unsubscribe();
              reject(error);
            });
      });
      this.custormFromFolded = true;
      this.bindCustormListShowed = true;
    } catch (error) {
      this.logger.error('查询客户列表异常:', error);
      let errMsg = '查询客户列表异常！';
      if (error && error.err) {
        errMsg += `错误码:${error.err.status}`;
      } else if (error && error.meta) {

      }
      this.service.tipSource.next({ message: errMsg, style: 'danger' });
    }
  }

  async bindCustom(index: number) {
    try {
      const selectedoc = this.searchCustormerList[index];
      // 更新form值的参考链接  https://blog.csdn.net/fangquan1980/article/details/80841007
      if (selectedoc) {
        this.relationCustomId = selectedoc._id;
        this.addCustomForm.patchValue({
          name: selectedoc.name,
          mobile: selectedoc.mobile,
          telphone: selectedoc.telphone,
          companyName: selectedoc.companyName,
          address: selectedoc.address,
          email: selectedoc.email,
          level: selectedoc.level,
          memo: selectedoc.memo,
        });
        await new Promise((resolve, reject) => {
          const subscription = this.service.bindCustomer(this.roomId, this.relationCustomId, selectedoc.name)
            .subscribe(results => {
              if (results.meta && results.meta.code === 200) {
                subscription.unsubscribe();
                this.dataService.RoomSource.next({ id: this.roomId, userName: selectedoc.name });
                resolve();
              } else {
                subscription.unsubscribe();
                reject(results);
              }
            },
              error => {
                subscription.unsubscribe();
                reject(error);
              });
        });
        this.returnCustomForm();
      } else {
        this.service.tipSource.next({ message: '绑定客户数据异常！', style: 'danger' });
      }

    } catch (error) {
      this.logger.error('binding custom error:', error);
      this.service.tipSource.next({ message: '绑定客户发生异常！', style: 'danger' });
    }
  }

  returnCustomForm() {
    this.custormFromFolded = false;
    this.bindCustormListShowed = false;
  }

  async addCustomSubmit() {
    try {
      if (this.relationCustomId) {
        await this.updateCustom();
      } else {
        await new Promise((resolve, reject) => {
          const subscription = this.service.addCustomer(this.addCustomForm.value)
            .subscribe(results => {
              if (results.meta && results.meta.code === 200) {
                subscription.unsubscribe();
                this.relationCustomId = results.data._id;
                this.dataService.RoomSource.next({ id: this.roomId, userName: results.data.name });
                this.service.tipSource.next({ message: '添加成功！', style: 'success' });
                resolve();
              } else {
                subscription.unsubscribe();
                reject(results.meta);
              }
            },
              error => {
                subscription.unsubscribe();
                reject(error);
              });
        });
        await new Promise((resolve, reject) => {
          const subscription = this.service.bindCustomer(this.roomId, this.relationCustomId, this.addCustomForm.value.name)
            .subscribe(results => {
              if (results.meta && results.meta.code === 200) {
                subscription.unsubscribe();
                resolve();
              } else {
                subscription.unsubscribe();
                reject(results);
              }
            },
              error => {
                subscription.unsubscribe();
                reject(error);
              });
        });
      }

    } catch (error) {
      this.service.tipSource.next({ message: '添加失败！', style: 'danger' });
      this.logger.error('add custom error:', error);
    }

  }

  async updateCustom() {
    try {
      await new Promise((resolve, reject) => {
        const subscription = this.service.modifyCustomer(this.relationCustomId, this.addCustomForm.value)
          .subscribe(results => {
            if (results.meta && results.meta.code === 200) {
              subscription.unsubscribe();
              this.dataService.RoomSource.next({ id: this.roomId, userName: this.addCustomForm.value.name });
              this.service.tipSource.next({ message: '更新成功！', style: 'success' });
              resolve();
            } else {
              subscription.unsubscribe();
              reject(results.meta);
            }
          },
            error => {
              subscription.unsubscribe();
              reject(error);
            });
      });
    } catch (error) {
      this.service.tipSource.next({ message: '更新用户信息失败！', style: 'danger' });
      this.logger.error('update custom error:', error);
    }
  }
  foldCustomForm() {
    this.custormFromFolded = !this.custormFromFolded;
  }

}
