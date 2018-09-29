webpackJsonp([0],{

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyHttp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_timeout__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_timeout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_timeout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file_transfer__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_system__ = __webpack_require__(15);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var MyHttp = /** @class */ (function (_super) {
    __extends(MyHttp, _super);
    function MyHttp(_backend, _defaultOptions, loadingCtrl, systemService, fileTransfer) {
        var _this = _super.call(this, _backend, _defaultOptions) || this;
        _this.loadingCtrl = loadingCtrl;
        _this.systemService = systemService;
        _this.fileTransfer = fileTransfer;
        _this.requestHeaders = {};
        _this.requestCount = 0;
        _this.timeoutLimit = 12000;
        return _this;
    }
    // request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    // 	return super.request(url, options)
    // 				.timeout(this.timeoutLimit)
    // 				.do(
    // 					()=>{
    // 						// debugger;
    // 					},
    // 					()=>{
    // 						// debugger;
    // 					}
    // 				)
    // 				.map(this.convertResponse)
    // }
    MyHttp.prototype.convertResponse = function (_res) {
        var res = _res.json();
        //code < 0 的当错误处理
        if (res.code < 0) {
            throw {
                $custom: 1,
                code: res.code,
                msg: res.msg,
                data: res.data
            };
        }
        return res;
    };
    MyHttp.prototype.get = function (url, options) {
        return _super.prototype.get.call(this, url, options)
            .timeout(this.timeoutLimit)
            .map(this.convertResponse);
    };
    MyHttp.prototype.post = function (url, body, options) {
        if (body.token) {
            options = Object.assign({}, options, {
                headers: { Authorization: "Bearer " + body.token }
            });
        }
        return _super.prototype.post.call(this, url, body, options)
            .timeout(this.timeoutLimit)
            .map(this.convertResponse);
    };
    MyHttp.prototype.put = function (url, body, options) {
        return _super.prototype.put.call(this, url, body, options)
            .timeout(this.timeoutLimit)
            .map(this.convertResponse);
    };
    MyHttp.prototype.delete = function (url, options) {
        return _super.prototype.delete.call(this, url, options)
            .timeout(this.timeoutLimit)
            .map(this.convertResponse);
    };
    MyHttp.prototype.patch = function (url, body, options) {
        return _super.prototype.patch.call(this, url, body, options)
            .timeout(this.timeoutLimit)
            .map(this.convertResponse);
    };
    MyHttp.prototype.head = function (url, options) {
        return _super.prototype.head.call(this, url, options)
            .timeout(this.timeoutLimit)
            .map(this.convertResponse);
    };
    MyHttp.prototype.options = function (url, options) {
        return _super.prototype.options.call(this, url, options)
            .timeout(this.timeoutLimit)
            .map(this.convertResponse);
    };
    MyHttp.prototype.setToken = function (token) {
        this._defaultOptions.headers.set('X-Access-Token', token);
        //上传手机资源
        this.requestHeaders['X-Access-Token'] = token;
    };
    MyHttp.prototype.removeToken = function () {
        this._defaultOptions.headers.delete('X-Access-Token');
        //上传手机资源
        delete this.requestHeaders['X-Access-Token'];
    };
    MyHttp.prototype.upload = function (filePath, fileName, remoteUrl, params) {
        var fileTransferObject = this.fileTransfer.create();
        var options = {
            fileKey: 'file',
            fileName: fileName,
            headers: this.requestHeaders,
            params: params
        };
        var p = fileTransferObject.upload(filePath, remoteUrl, options);
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].fromPromise(p)
            .timeout(this.timeoutLimit)
            .map(function (result) {
            var res = JSON.parse(result.response);
            if (res.code) {
                throw {
                    $custom: 1,
                    code: res.code,
                    msg: res.msg,
                    data: res.data
                };
            }
            return res;
        });
    };
    MyHttp.prototype.handleError = function (err, defaultMsg) {
        if (defaultMsg === void 0) { defaultMsg = '出错啦'; }
        if (err && err.status === 0) {
            return this.systemService.showToast('网络不通');
        }
        //请求超时
        if (err && err.name == 'TimeoutError') {
            return this.systemService.showToast('请求超时');
        }
        else if (err.$custom) {
            return this.systemService.showToast(err.msg || defaultMsg);
        }
        else if (err.code === 'userCancelled' //	android crop
            || (err.message === "Error on cropping" && err.code === "404") //	android imgPicker
            || (err === 'Camera cancelled.') //  android camera
        ) {
            return;
        }
        //程序异常
        this.systemService.showToast(defaultMsg);
    };
    MyHttp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* ConnectionBackend */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_8__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_file_transfer__["a" /* FileTransfer */]])
    ], MyHttp);
    return MyHttp;
}(__WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]));

//# sourceMappingURL=my-http.js.map

/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_vibration__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_local_notifications__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergeMap__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergeMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__chat_chat__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__friend_list_friend_list__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__discover_discover__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__me_me__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__login_login__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__chat_content_chat_content__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_msg__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_backend__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_rxjs_Subscription__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_rxjs_Subscription___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_rxjs_Subscription__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



















var IndexPage = /** @class */ (function () {
    function IndexPage(navCtrl, vibration, localNotifications, storage, alertCtrl, userService, msgService, systemService, myHttp, backEnd) {
        this.navCtrl = navCtrl;
        this.vibration = vibration;
        this.localNotifications = localNotifications;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.userService = userService;
        this.msgService = msgService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.backEnd = backEnd;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_7__chat_chat__["a" /* ChatPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_8__friend_list_friend_list__["a" /* FriendListPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_9__discover_discover__["a" /* DiscoverPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_10__me_me__["a" /* MePage */];
        this.chatUnread = 0;
        this.subscriptions = new __WEBPACK_IMPORTED_MODULE_18_rxjs_Subscription__["Subscription"]();
        this.apikey = '';
    }
    IndexPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, _b, token, ownId, ex_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        _a = this;
                        return [4 /*yield*/, this.storage.get('apikey')];
                    case 1:
                        _a.apikey = _c.sent();
                        console.log('indexpage:', this.apikey);
                        return [4 /*yield*/, this.getToken()];
                    case 2:
                        _b = _c.sent(), token = _b[0], ownId = _b[1];
                        if (!this.apikey) return [3 /*break*/, 5];
                        if (!token) return [3 /*break*/, 3];
                        console.log('当前用户:', token, ownId);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.createNewVistor()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [4 /*yield*/, this.connectServer()];
                    case 6:
                        _c.sent();
                        if (this.apikey) {
                            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__chat_content_chat_content__["a" /* ChatContentPage */], { relationId: this.apikey, chatName: '163163' });
                        }
                        //强迫下线通知
                        this.subscriptions.add(this.backEnd.onForceQuit.subscribe(function () {
                            _this.forceQuit();
                        }));
                        //没读消息数
                        this.subscriptions.add(this.msgService.chatList$
                            .map(function (chatList) {
                            var chatUnread = 0;
                            chatList.forEach(function (chat) {
                                chatUnread += chat.unread;
                            });
                            return chatUnread;
                        })
                            .subscribe(function (chatUnread) {
                            _this.chatUnread = chatUnread;
                        }));
                        //消息通知
                        this.subscriptions.add(this.msgService.newMsg$
                            .subscribe(function (msg) {
                            _this.notify(msg);
                        }));
                        return [3 /*break*/, 8];
                    case 7:
                        ex_1 = _c.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    IndexPage.prototype.createNewVistor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var token_1, ownId_1, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.userService.signVisitor(_this.apikey)
                                    .mergeMap(function (res) {
                                    //本地保存token
                                    token_1 = res.data.token;
                                    ownId_1 = res.data.username;
                                    return _this.saveToken(token_1, ownId_1);
                                })
                                    .subscribe(function () {
                                    //保存登录名，下次登录返显处来
                                    _this.storage.set('latestUsername', ownId_1);
                                    resolve();
                                }, function (err) { _this.myHttp.handleError(err, '登录失败'); reject(err); });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        ex_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    IndexPage.prototype.saveToken = function (token, ownId) {
        var p1 = this.storage.set('token', token);
        var p2 = this.storage.set('ownId', ownId);
        var pAll = Promise.all([p1, p2]);
        return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].fromPromise(pAll);
    };
    IndexPage.prototype.ngOnDestroy = function () {
        this.backEnd.disconnect();
        this.destroyData();
        this.unsubscribe();
    };
    IndexPage.prototype.connectServer = function (shouldInitData) {
        var _this = this;
        if (shouldInitData === void 0) { shouldInitData = true; }
        this.getToken()
            .then(function (all) {
            var token = all[0];
            var ownId = all[1];
            if (token && ownId) {
                _this.userService.safe(token, ownId).subscribe(function (res) {
                    _this.backEnd.connect(token, ownId, 'tenantId', 'username');
                    shouldInitData && _this.initData(token, ownId);
                }, function (err) {
                    if (err && err.status !== 200) {
                        _this.systemService.showToast(err.statusText);
                        _this.gotoLoginPage();
                        return;
                    }
                    else {
                        _this.myHttp.handleError(err);
                    }
                });
            }
            else {
                _this.systemService.showToast('请先登录');
                _this.gotoLoginPage();
            }
        })
            .catch(function (err) { return _this.myHttp.handleError(err); });
    };
    IndexPage.prototype.getToken = function () {
        var p1 = this.storage.get('token');
        var p2 = this.storage.get('ownId');
        return Promise.all([p1, p2]);
    };
    IndexPage.prototype.initData = function (token, useId) {
        this.userService.getSource(token);
        this.msgService.getSource(token, useId);
    };
    IndexPage.prototype.destroyData = function () {
        this.backEnd.clearSource();
        this.userService.clearSource();
        this.msgService.clearSource();
    };
    IndexPage.prototype.unsubscribe = function () {
        this.subscriptions.unsubscribe();
    };
    //强迫下线
    IndexPage.prototype.forceQuit = function () {
        //断开连接
        this.backEnd.disconnect();
        //取消所有订阅
        // this.unsubscribe();
        this.presentAlert();
    };
    IndexPage.prototype.notify = function (msg) {
        var ownId = this.backEnd.getOwnId();
        if (!ownId)
            return;
        if (ownId === msg.fromUserId)
            return;
        var content = msg.type === 0 ? msg.content : msg.type === 1 ? '[图片]' : '[语音]';
        //通知
        this.localNotifications.schedule({
            // id: msg._id,
            // title: msg._fromUser.nickname,
            // text: content,
            id: 1,
            title: 'test',
            text: msg
        });
        //震动
        this.vibration.vibrate(100);
    };
    IndexPage.prototype.presentAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '强迫下线',
            message: '账号在另一地方登录，如果不是本人操作，请及时修改密码！',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: '重新登录',
                    handler: function (data) {
                        _this.connectServer(false);
                    }
                },
                {
                    text: '切换账号',
                    handler: function (data) {
                        _this.gotoLoginPage();
                    }
                },
            ]
        });
        alert.present();
    };
    IndexPage.prototype.gotoLoginPage = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_11__login_login__["a" /* LoginPage */]);
    };
    IndexPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-index-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\index\index.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" [tabBadge]="chatUnread" tabBadgeStyle="danger" tabTitle="聊天" tabIcon="chatbubbles"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="通讯录" tabIcon="contacts"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="发现" tabIcon="compass"></ion-tab>\n  <ion-tab [root]="tab4Root" tabTitle="我的" tabIcon="contact"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\index\index.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_vibration__["a" /* Vibration */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_local_notifications__["a" /* LocalNotifications */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_13__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_14__services_msg__["a" /* MsgService */],
            __WEBPACK_IMPORTED_MODULE_15__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_16__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_17__providers_backend__["a" /* BackEnd */]])
    ], IndexPage);
    return IndexPage;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SystemService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import 'rxjs/add/operator/finally';

var _ = __webpack_require__(373);
var SystemService = /** @class */ (function () {
    function SystemService(toastCtrl, loadingCtrl) {
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
    }
    //Toast
    SystemService.prototype.createToast = function (options) {
        var toastDefaults = {
            duration: 2000,
            position: 'middle',
        };
        //只输入msg字符串
        if (_.isString(options))
            options = { message: options };
        options = _.extend(toastDefaults, options);
        return this.toastCtrl.create(options);
        // toast.present();
    };
    SystemService.prototype.showToast = function (options) {
        var toast = this.createToast(options);
        toast.present();
        return toast;
    };
    //Loading
    SystemService.prototype.createLoading = function (options) {
        var loadingDefaults = {};
        //只输入msg字符串
        if (_.isString(options))
            options = { content: options };
        options = _.extendOwn(loadingDefaults, options);
        return this.loadingCtrl.create(options);
    };
    SystemService.prototype.showLoading = function (options) {
        var loading = this.createLoading(options);
        loading.present();
        return loading;
    };
    SystemService.prototype.closeLoading = function (loading) {
        loading.dismiss();
    };
    //依附在异步上,异步完成后自动销毁
    SystemService.prototype.linkLoading = function (observable, LoadingOptions) {
        var _this = this;
        var loading = this.showLoading(LoadingOptions);
        return observable.do(function () {
            _this.closeLoading(loading);
        }, function () {
            _this.closeLoading(loading);
        });
    };
    SystemService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */]])
    ], SystemService);
    return SystemService;
}());

//# sourceMappingURL=system.js.map

/***/ }),

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FriendRequestPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FriendRequestPage = /** @class */ (function () {
    function FriendRequestPage(navCtrl, navParams, userService, systemService, myHttp) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.userId = navParams.data.userId;
    }
    FriendRequestPage.prototype.markFriend = function () {
        var _this = this;
        this.userService.makeFriend(this.userId, this.requestMsg).subscribe(function (res) {
            _this.systemService.showToast('申请成功！');
            setTimeout(function () {
                _this.navCtrl.pop();
            }, 1000);
        }, function (err) { return _this.myHttp.handleError(err, '申请失败'); });
    };
    FriendRequestPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-friend-request-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\friend-request\friend-request.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>朋友验证</ion-title>\n\n    <ion-buttons end>\n      <button ion-button (click)="markFriend()">发送</button>\n    </ion-buttons>\n  </ion-navbar>\n\n\n\n</ion-header>\n<ion-content>\n\n  <ion-list>\n    <ion-item>\n      <ion-input type="text" placeholder="请求信息" [(ngModel)]="requestMsg"></ion-input>\n    </ion-item>\n  </ion-list>\n  <p class="hint">你需要发送验证申请，等对方通过</p>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\friend-request\friend-request.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_3__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_4__providers_my_http__["a" /* MyHttp */]])
    ], FriendRequestPage);
    return FriendRequestPage;
}());

//# sourceMappingURL=friend-request.js.map

/***/ }),

/***/ 151:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimelineAddPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_crop__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_timeline__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var TimelineAddPage = /** @class */ (function () {
    function TimelineAddPage(sanitizer, fb, imagePicker, camera, crop, cordovaFile, navCtrl, actionSheetCtrl, timelineService, systemService, myHttp) {
        this.sanitizer = sanitizer;
        this.fb = fb;
        this.imagePicker = imagePicker;
        this.camera = camera;
        this.crop = crop;
        this.cordovaFile = cordovaFile;
        this.navCtrl = navCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.timelineService = timelineService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.medias = [];
    }
    TimelineAddPage.prototype.ngOnInit = function () {
        this.form = this.fb.group({
            content: [
                '',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required
                ]
            ]
        });
        this.medias.push(new MediaFile());
    };
    TimelineAddPage.prototype.publish = function () {
        var _this = this;
        var formValue = this.form.value;
        //上传文件
        var formData = new FormData();
        formData.append("content", formValue.content);
        this.medias.forEach(function (media) {
            if (media.isFill()) {
                formData.append("medias", media.file, 'media.png'); //暂只支持图片
            }
        });
        var obser = this.timelineService.publish(formData);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.systemService.showToast('发表成功');
            setTimeout(function () {
                _this.timelineService.refresh();
                _this.navCtrl.pop();
            }, 1500);
        }, function (err) { return _this.myHttp.handleError(err, '发表失败'); });
    };
    TimelineAddPage.prototype.fillMedia = function (media) {
        this.presentActionSheet(media);
    };
    TimelineAddPage.prototype.removeMedia = function (media) {
        var _this = this;
        this.medias.forEach(function (_media, i) {
            if (_media == media) {
                _this.medias.splice(i, 1);
                return false;
            }
        });
    };
    //上传图片
    TimelineAddPage.prototype.presentActionSheet = function (media) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    handler: function () {
                        _this.setByPhotograph(media);
                    }
                }, {
                    text: '从手机相册选择',
                    handler: function () {
                        _this.setByAlbum(media);
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: function () { }
                }
            ]
        });
        actionSheet.present();
    };
    //通过拍照设置头像
    TimelineAddPage.prototype.setByPhotograph = function (media) {
        var _this = this;
        this.photograph()
            .then(function (newImagePath) {
            return _this.cordovaFile.resolveLocalFilesystemUrl(newImagePath);
        })
            .then(function (fileEntry) {
            return new Promise(function (resolve, reject) {
                fileEntry.file(function (file) {
                    resolve(file);
                }, function (err) {
                    reject(err);
                });
            });
        })
            .then(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var Html5File = new Blob([e.target['result']], { type: 'image/png' });
                var src = _this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
                var isFill = media.isFill();
                media.set(src, Html5File);
                //重新编辑不需要增加addbtn
                if (!isFill)
                    _this.medias.push(new MediaFile());
            };
            reader.readAsArrayBuffer(file);
        })
            .catch(function (err) {
            console.log('拍照失败！', err);
        });
    };
    //通过手机相册设置头像
    TimelineAddPage.prototype.setByAlbum = function (media) {
        var _this = this;
        this.openAlbum()
            .then(function (newImagePath) {
            return _this.cordovaFile.resolveLocalFilesystemUrl(newImagePath);
        })
            .then(function (fileEntry) {
            return new Promise(function (resolve, reject) {
                fileEntry.file(function (file) {
                    resolve(file);
                }, function (err) {
                    reject(err);
                });
            });
        })
            .then(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var Html5File = new Blob([e.target['result']], { type: 'image/png' });
                var src = _this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
                var isFill = media.isFill();
                media.set(src, Html5File);
                //重新编辑不需要增加addbtn
                if (!isFill)
                    _this.medias.push(new MediaFile());
            };
            reader.readAsArrayBuffer(file);
        })
            .catch(function (err) {
            console.log('访问手机相册失败！', err);
        });
    };
    //拍照
    TimelineAddPage.prototype.photograph = function () {
        var options = {
            allowEdit: false,
        };
        return this.camera.getPicture(options);
    };
    TimelineAddPage.prototype.openAlbum = function () {
        //打开手机相册
        var options = {
            maximumImagesCount: 1
        };
        return this.imagePicker.getPictures(options).then(function (res) {
            return res[0];
        });
    };
    TimelineAddPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-timeline-add-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\timeline-add\timeline-add.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>记录心情</ion-title>\n\n    <ion-buttons end>\n      <button ion-button (click)="publish()" [disabled]="form.invalid">发表</button>\n    </ion-buttons>\n  </ion-navbar>\n\n\n\n</ion-header>\n<ion-content>\n  <form [formGroup]="form" (ngSubmit)="publish()">\n    <ion-list class="input-wrap">\n      <ion-item>\n        <ion-textarea type="text" placeholder="写下你的心情吧" formControlName="content"></ion-textarea>\n      </ion-item>\n    </ion-list>\n  </form>\n  <div class="media-wrap">\n    <div class="add-media-btn" *ngFor="let media of medias" (click)="fillMedia(media)">\n      <!--<button class="remove-btn" *ngIf="media.isFill()" (click)="removeMedia(media)"><ion-icon name="close" ></ion-icon></button>-->\n      <!--<button class="remove-btn" (click)="removeMedia(media)"><ion-icon name="close" ></ion-icon></button>-->\n      <img *ngIf="media.src" [src]="media.src" />\n      <ion-icon name="add" *ngIf="!media.src"></ion-icon>\n    </div>\n  </div>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\timeline-add\timeline-add.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__["a" /* ImagePicker */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_crop__["a" /* Crop */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_8__services_timeline__["a" /* TimelineService */],
            __WEBPACK_IMPORTED_MODULE_9__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_10__providers_my_http__["a" /* MyHttp */]])
    ], TimelineAddPage);
    return TimelineAddPage;
}());

var MediaFile = /** @class */ (function () {
    function MediaFile() {
        this.src = null;
        this.file = null;
    }
    MediaFile.prototype.set = function (src, file) {
        this.src = src;
        this.file = file;
    };
    MediaFile.prototype.isFill = function () {
        return !!(this.src && this.file);
    };
    return MediaFile;
}());
//# sourceMappingURL=timeline-add.js.map

/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimelineService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_config__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_backend__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var TimelineService = /** @class */ (function () {
    function TimelineService(myHttp, backEnd) {
        this.myHttp = myHttp;
        this.backEnd = backEnd;
        this.commentsCache = {};
        this.onRefreshSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
        this.onRefresh = this.onRefreshSubject.asObservable();
        this._init();
    }
    TimelineService.prototype._init = function () {
    };
    TimelineService.prototype.getSource = function () {
    };
    TimelineService.prototype.clearSource = function () {
    };
    // 朋友圈
    TimelineService.prototype.getTimelines = function () {
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/timeline/getTimelines');
    };
    //发表心情
    TimelineService.prototype.publish = function (formData) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/timeline/publish', formData);
    };
    // 点赞
    TimelineService.prototype.likeTimeline = function (timelineId, isLike) {
        var search = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* URLSearchParams */]();
        search.append('isLike', isLike);
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/timeline/likeTimeline/' + timelineId, { search: search });
    };
    // 评论
    TimelineService.prototype.commentTimeline = function (timelineId, content, atUserId) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/timeline/commentTimeline/' + timelineId, { content: content, atUserId: atUserId });
    };
    TimelineService.prototype.cacheComment = function (timelineId, atUserId, content) {
        if (atUserId === void 0) { atUserId = ''; }
        this.commentsCache[timelineId + '/' + atUserId] = content;
    };
    TimelineService.prototype.getCacheComment = function (timelineId, atUserId) {
        if (atUserId === void 0) { atUserId = ''; }
        return this.commentsCache[timelineId + '/' + atUserId];
    };
    TimelineService.prototype.removeCacheComment = function (timelineId, atUserId) {
        if (atUserId === void 0) { atUserId = ''; }
        delete this.commentsCache[timelineId + '/' + atUserId];
    };
    TimelineService.prototype.refresh = function () {
        this.onRefreshSubject.next();
    };
    TimelineService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_7__providers_backend__["a" /* BackEnd */]])
    ], TimelineService);
    return TimelineService;
}());

//# sourceMappingURL=timeline.js.map

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JokeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_config__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_backend__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var JokeService = /** @class */ (function () {
    function JokeService(myHttp, backEnd) {
        this.myHttp = myHttp;
        this.backEnd = backEnd;
    }
    // 朋友圈
    JokeService.prototype.getJokes = function () {
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_3__config_config__["b" /* API_HOST */] + '/joke/getJokes');
    };
    //发表笑话
    JokeService.prototype.publishJoke = function (formData) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_3__config_config__["b" /* API_HOST */] + '/joke/publish', formData);
    };
    //点好评
    JokeService.prototype.likeJoke = function (jokeId, isLike) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_3__config_config__["b" /* API_HOST */] + '/joke/like/' + jokeId, { jokeId: jokeId, isLike: isLike });
    };
    //点差评
    JokeService.prototype.dislikeJoke = function (jokeId, isDislike) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_3__config_config__["b" /* API_HOST */] + '/joke/dislike/' + jokeId, { isDislike: isDislike });
    };
    JokeService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_5__providers_backend__["a" /* BackEnd */]])
    ], JokeService);
    return JokeService;
}());

//# sourceMappingURL=joke.js.map

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserValidator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_user__ = __webpack_require__(16);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*UserValidator*/
var UserValidator = /** @class */ (function () {
    function UserValidator(userService) {
        this.userService = userService;
    }
    UserValidator.prototype.existsByUsernameAsync = function () {
        var _this = this;
        var timer;
        return function (contorl) {
            return new Promise(function (resolve, reject) {
                clearTimeout(timer);
                setTimeout(function () {
                    var username = contorl.value;
                    _this.userService.existsByUsername(username).subscribe(function (res) {
                        var isExists = res.data;
                        if (isExists) {
                            resolve({ existsByUsername: true });
                        }
                        else {
                            resolve(null);
                        }
                    }, function (err) {
                        console.log(err);
                        resolve({ existsByUsername: true });
                    });
                }, 300);
            });
        };
    };
    UserValidator = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_user__["a" /* UserService */]])
    ], UserValidator);
    return UserValidator;
}());

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_config__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_backend__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var UserService = /** @class */ (function () {
    function UserService(myHttp, backEnd) {
        this.myHttp = myHttp;
        this.backEnd = backEnd;
        this.ownSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"]({});
        this.own$ = this.ownSubject.asObservable();
        this.relationListSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.relationList$ = this.relationListSubject.asObservable();
        //source: relationListSubject
        this.friendListSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.friendList$ = this.friendListSubject.asObservable();
        this._init();
    }
    UserService.prototype._init = function () {
        var _this = this;
        //推送过来的修改用户信息
        this.backEnd.pushUserModed$.subscribe(function (user) {
            var relationList = _this.relationListSubject.getValue();
            relationList.forEach(function (relation) {
                if (relation._friend._id === user['_id']) {
                    relation._friend = user;
                }
            });
            _this.relationListSubject.next(relationList);
        });
        //relationList 改变通知 friendList改变
        this.relationListSubject
            .map(function (relationList) {
            var friendList = [];
            relationList.forEach(function (relation) {
                //关系确认才是好友关系
                if (relation.confirm) {
                    friendList.push(relation._friend);
                }
            });
            return friendList;
        }).subscribe(function (friendList) {
            _this.friendListSubject.next(friendList);
        });
    };
    UserService.prototype.getSource = function (token) {
        this.getOwn();
        this.getRelationList();
    };
    UserService.prototype.clearSource = function () {
        this.ownSubject.next({});
        this.relationListSubject.next([]);
        this.friendListSubject.next([]);
    };
    UserService.prototype.getOwn = function () {
        var _this = this;
        var token = this.backEnd.getToken();
        var options = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ Authorization: "Bearer " + token })
        };
        this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/getOwn', options)
            .subscribe(function (res) {
            _this.ownSubject.next(res.data);
        }, function (err) {
            console.log(err);
        });
    };
    //获取关系列表
    UserService.prototype.getRelationList = function () {
        var _this = this;
        var token = this.backEnd.getToken();
        var options = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ Authorization: "Bearer " + token })
        };
        this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/getRelationList', options)
            .subscribe(function (res) {
            console.log('getRelationList', res.data);
            _this.relationListSubject.next(res.data);
        }, function (err) {
            console.log(err);
        });
    };
    //通过手机通讯录查找好友
    UserService.prototype.getUserListByMobiles = function (mobiles) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/getUserListByMobiles', { mobiles: mobiles });
    };
    //登录
    UserService.prototype.login = function (postData) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/login', postData);
    };
    //登录
    UserService.prototype.safe = function (token, userId) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/safe', { token: token, userId: userId });
    };
    //获取验证码
    UserService.prototype.getVerificationCode = function (mobile) {
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/getVerificationCode/' + mobile);
    };
    //验证验证码
    UserService.prototype.checkVerificationCode = function (mobile, code) {
        var postData = { mobile: mobile, code: code };
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/checkVerificationCode', postData);
    };
    //注册
    UserService.prototype.signup = function (mobileToken, username, password) {
        var postData = { mobileToken: mobileToken, username: username, password: password };
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/signup', postData);
    };
    // 临时访客注册
    UserService.prototype.signVisitor = function (apikey) {
        var postData = { apikey: apikey };
        var options = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ Authorization: "Bearer " + apikey })
        };
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/signvisitor', postData, options);
    };
    //验证访客apikey
    UserService.prototype.checkVisitorToken = function (apikey, token) {
        var options = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ Authorization: "Bearer " + token })
        };
        var postData = { apikey: apikey };
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/checkVisitorToken', postData, options);
    };
    //完善资料
    UserService.prototype.setInfo = function (formData) {
        return this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/setInfo', formData);
    };
    //搜索用户
    UserService.prototype.searchUser = function (search) {
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/searchUser/' + search);
    };
    //获取用户资料
    UserService.prototype.getUser = function (userId) {
        var token = this.backEnd.getToken();
        var options = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ Authorization: "Bearer " + token })
        };
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/getUser/' + userId, options);
    };
    //申请好友
    UserService.prototype.makeFriend = function (userId, requestMsg) {
        if (requestMsg === void 0) { requestMsg = ''; }
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/makeFriend/' + userId + '?requestMsg=' + requestMsg);
    };
    //确认好友
    UserService.prototype.confirmFriend = function (userId) {
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/confirmFriend/' + userId);
    };
    //获取新好友列表
    UserService.prototype.getFriendNewList = function () {
        var token = this.backEnd.getToken();
        var options = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ Authorization: "Bearer " + token })
        };
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/getFriendNewList', options);
    };
    //修改头像
    UserService.prototype.modAvatar = function (file) {
        var _this = this;
        var formData = new FormData();
        var observable;
        formData.append('file', file);
        observable = this.myHttp.post(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/modAvatar', formData)
            .subscribe(function (res) {
            _this.ownSubject.next(res.data);
        }, function (err) {
            console.log(err);
        });
        return observable;
    };
    //修改昵称
    UserService.prototype.modNickname = function (nickname) {
        var _this = this;
        var observable = this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/modNickname/' + nickname);
        observable.subscribe(function (res) {
            _this.ownSubject.next(res.data);
        }, function (err) {
            console.log(err);
        });
        return observable;
    };
    //修改性别
    UserService.prototype.modGender = function (gender) {
        var _this = this;
        var observable = this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/modGender/' + gender);
        observable.subscribe(function (res) {
            _this.ownSubject.next(res.data);
        }, function (err) {
            console.log(err);
        });
        return observable;
    };
    //修改个性签名
    UserService.prototype.modMotto = function (motto) {
        var _this = this;
        var observable = this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/modMotto/' + motto);
        observable.subscribe(function (res) {
            _this.ownSubject.next(res.data);
        }, function (err) {
            console.log(err);
        });
        return observable;
    };
    //通过username查找是否存在帐号
    UserService.prototype.existsByUsername = function (username) {
        return this.myHttp.get(__WEBPACK_IMPORTED_MODULE_5__config_config__["b" /* API_HOST */] + '/user/existsByUsername/' + username);
    };
    UserService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_7__providers_backend__["a" /* BackEnd */]])
    ], UserService);
    return UserService;
}());

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 168:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 168;

/***/ }),

/***/ 211:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 211;

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chat_content_chat_content__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__chat_popover_chat_popover__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__friend_add_friend_add__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_msg__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_backend__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_utils__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ChatPage = /** @class */ (function () {
    function ChatPage(zone, appCtrl, popoverCtrl, msgService, backEnd) {
        this.zone = zone;
        this.appCtrl = appCtrl;
        this.popoverCtrl = popoverCtrl;
        this.msgService = msgService;
        this.backEnd = backEnd;
        this.chatList = [];
        this.connectState = 0;
        this.subscriptions = new __WEBPACK_IMPORTED_MODULE_7_rxjs__["Subscription"]();
    }
    ChatPage.prototype.ngOnInit = function () {
        var _this = this;
        //连接状态
        this.subscriptions.add(this.backEnd.state$.subscribe(function (state) {
            _this.connectState = state;
        }));
        this.subscriptions.add(this.msgService.chatList$.subscribe(function (chatList) {
            _this.chatList = chatList;
            _this.updateDiff();
        }));
        this.timer = setInterval(function () {
            _this.updateDiff();
        }, 60000);
    };
    ChatPage.prototype.updateDiff = function () {
        this.chatList.forEach(function (item) {
            item['timediff'] = Object(__WEBPACK_IMPORTED_MODULE_8__utils_utils__["d" /* getDiff */])(item.lastSendTime);
            return item;
        });
    };
    ChatPage.prototype.ngAfterViewInit = function (a, b, c) {
        // viewChild is set after the view has been initialized
    };
    ChatPage.prototype.ngAfterViewChecked = function (a, b, c) {
        // viewChild is set after the view has been initialized
    };
    ChatPage.prototype.ngOnDestory = function () {
        this.subscriptions.unsubscribe();
        clearInterval(this.timer);
    };
    ChatPage.prototype.presentPopover = function (event) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_3__chat_popover_chat_popover__["a" /* ChatPopoverPage */], {}, {
            cssClass: 'chat-popover'
        });
        popover.present({
            ev: event
        });
    };
    ChatPage.prototype.ngOnDestroy = function () {
        clearInterval(this.timer);
    };
    ChatPage.prototype.deleteChat = function (relationId) {
        this.msgService.deleteChat(relationId);
    };
    ChatPage.prototype.gotoChatContentPage = function (relationId, chatName) {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_2__chat_content_chat_content__["a" /* ChatContentPage */], { relationId: relationId, chatName: chatName });
    };
    ChatPage.prototype.gotoFriendAddPage = function () {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_4__friend_add_friend_add__["a" /* FriendAddPage */]);
    };
    ChatPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-chat-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\chat\chat.html"*/'<ion-header>\n  <ion-navbar>\n\n    <!-- <ion-buttons start >\n      <button ion-button icon-only (click)="gotoFriendListPage()">\n          <ion-icon name="contacts"></ion-icon>\n      </button>\n    </ion-buttons> -->\n\n    <ion-title>聊天{{connectState | connectState}}</ion-title>\n\n    <ion-buttons end>\n      <button ion-button icon-only (click)="presentPopover($event)">\n          <ion-icon name="more"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-list>\n    <ion-item-sliding *ngFor="let chat of chatList">\n      <button ion-item detail-none (click)="gotoChatContentPage(chat.relationId,chat.name)">\n		<ion-thumbnail item-left>\n			<cy-img [src]="chat.avatarSrc | avatarSrc"></cy-img>\n		</ion-thumbnail>\n		\n		<h2>{{chat.name}} <ion-note>{{chat.timediff | timediff}}</ion-note></h2>\n		<p>{{chat.lastContent}}</p>\n\n		<ion-badge color="danger" *ngIf="chat.unread > 0">{{chat.unread}}</ion-badge>\n	  </button>\n      <ion-item-options side="right">\n        <button ion-button color="danger" (click)="deleteChat(chat.relationId)">\n        <ion-icon name="trash"></ion-icon>\n        <span class="button-title">删除</span>\n      </button>\n      </ion-item-options>\n    </ion-item-sliding>\n\n\n  </ion-list>\n  <!-- <cy-img src="./assets/img/fengjing1.jpg" style="width:100%;height:100px;" [zoom]="true"></cy-img>\n  <cy-img src="./assets/img/fengjing2.jpg" style="width:100%;height:100px;" [zoom]="true"></cy-img>\n  <cy-img src="./assets/img/fengjing3.jpg" style="width:100%;height:100px;" [zoom]="true"></cy-img> -->\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\chat\chat.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* NgZone */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* PopoverController */],
            __WEBPACK_IMPORTED_MODULE_5__services_msg__["a" /* MsgService */],
            __WEBPACK_IMPORTED_MODULE_6__providers_backend__["a" /* BackEnd */]])
    ], ChatPage);
    return ChatPage;
}());

//# sourceMappingURL=chat.js.map

/***/ }),

/***/ 264:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyReplaySubject; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_ReplaySubject__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_ReplaySubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_ReplaySubject__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var MyReplaySubject = /** @class */ (function (_super) {
    __extends(MyReplaySubject, _super);
    function MyReplaySubject(bufferSize, scheduler) {
        var _this = _super.call(this, bufferSize, (3600000 * 24 * 365 * 100), scheduler) || this;
        _this.clean = false;
        return _this;
    }
    MyReplaySubject.prototype.clearBuffer = function () {
        this.clean = true;
        this.subscribe().unsubscribe();
        this.clean = false;
    };
    MyReplaySubject.prototype._getNow = function () {
        var t = new Date().setFullYear(3000, 1, 1);
        return this.clean ? t : _super.prototype._getNow.call(this);
    };
    return MyReplaySubject;
}(__WEBPACK_IMPORTED_MODULE_0_rxjs_ReplaySubject__["ReplaySubject"]));

//# sourceMappingURL=MyRelaySubject.js.map

/***/ }),

/***/ 273:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReorderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ReorderPage = /** @class */ (function () {
    function ReorderPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.ladder = [
            'Adelaide',
            'Collingwood',
            'Essendon',
            'Hawthorn',
            'Carlton',
            'Sydney',
            'Western Bulldogs',
            'West Coast',
            'Fremantle',
            'North Melbourne',
            'Richmond',
            'Greater Western Sydney',
            'St Kilda',
            'Geelong',
            'Brisbane',
            'Melbourne',
            'Port Adelaide',
            'Gold Coast'
        ];
    }
    ReorderPage.prototype.reorderItems = function (indexes) {
        this.ladder = Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* reorderArray */])(this.ladder, indexes);
    };
    ReorderPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'reorder-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\reorder\reorder.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>排序</ion-title>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n	<ion-list reorder="true" (ionItemReorder)="reorderItems($event)">\n        <ion-item *ngFor="let team of ladder; let i = index;">{{team}}</ion-item>\n    </ion-list>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\reorder\reorder.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], ReorderPage);
    return ReorderPage;
}());

//# sourceMappingURL=reorder.js.map

/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fileUtils; });
var fileUtils = {
    openAlbum: function () {
        return new Promise(function (resolve, reject) {
            var fileDOM = document.createElement('input');
            fileDOM.setAttribute('type', 'file');
            document.body.appendChild(fileDOM);
            fileDOM.addEventListener('change', function () {
                resolve(this.files[0]);
                document.body.removeChild(fileDOM);
            }, false);
            fileDOM.click();
        });
    },
    imgDataURL2File: function (dataURL, fileName, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            var imgDOM = new Image();
            var canvasDOM = document.createElement('canvas');
            var ctx = canvasDOM.getContext('2d');
            imgDOM.onload = function () {
                //裁剪
                canvasDOM.width = options['destWidth'] || imgDOM.width;
                canvasDOM.height = options['destHeight'] || imgDOM.height;
                //ctx.drawImage(imgDOM,0,0,null,null); 会出现全透明的情况
                if (options['imgWidth'] && options['imgHeight']) {
                    ctx.drawImage(imgDOM, 0, 0, options['imgWidth'], options['imgHeight']);
                }
                else {
                    ctx.drawImage(imgDOM, 0, 0);
                }
                canvasDOM.toBlob(function (blob) {
                    var file = new File([blob], fileName);
                    resolve(file);
                });
            };
            imgDOM.src = dataURL;
        });
    },
    File2DataURL: function (file) {
        return new Promise(function (resolve, reject) {
            var fr = new FileReader();
            fr.onload = function (res) {
                resolve(res.target['result']);
            };
            fr.readAsDataURL(file);
        });
    }
};
//# sourceMappingURL=file-utils.js.map

/***/ }),

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatPopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__friend_add_friend_add__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__timeline_add_timeline_add__ = __webpack_require__(151);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ChatPopoverPage = /** @class */ (function () {
    function ChatPopoverPage(viewCtrl, navCtrl) {
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
    }
    ChatPopoverPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    ChatPopoverPage.prototype.gotoFriendAddPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__friend_add_friend_add__["a" /* FriendAddPage */]);
        this.viewCtrl.dismiss();
    };
    ChatPopoverPage.prototype.gotoTimelineAddPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__timeline_add_timeline_add__["a" /* TimelineAddPage */]);
        this.viewCtrl.dismiss();
    };
    ChatPopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-chat-popover-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\chat-popover\chat-popover.html"*/'<ion-list>\n  <button ion-item detail-none>\n    <ion-icon name="md-qr-scanner" item-left ></ion-icon>\n		扫一扫\n  </button>\n  <button ion-item detail-none (click)="gotoFriendAddPage()">\n    <ion-icon name="person-add" item-left></ion-icon>\n		添加好友\n  </button>\n  <button ion-item detail-none (click)="gotoTimelineAddPage()">\n    <ion-icon name="create" item-left></ion-icon>\n		发表心情\n  </button>\n</ion-list>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\chat-popover\chat-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], ChatPopoverPage);
    return ChatPopoverPage;
}());

//# sourceMappingURL=chat-popover.js.map

/***/ }),

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FriendByContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_contacts__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_fromPromise__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_fromPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_fromPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__friend_request_friend_request__ = __webpack_require__(150);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var FriendByContactPage = /** @class */ (function () {
    function FriendByContactPage(platform, contacts, navCtrl, userService, systemService, myHttp) {
        this.platform = platform;
        this.contacts = contacts;
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.userList = [];
    }
    FriendByContactPage.prototype.ngOnInit = function () {
        var _this = this;
        var nonsupport = this.platform.is('mobileweb');
        if (nonsupport)
            return this.systemService.showToast('访问手机录暂不支持浏览器，请下载APP体验');
        this.findContacts()
            .subscribe(function (contacts) {
            function getDisplayName(mobile) {
                var displayName;
                contacts.forEach(function (contact) {
                    if (contact.phoneNumber === mobile) {
                        displayName = contact.displayName;
                        return false;
                    }
                });
                return displayName;
            }
            var mobiles = contacts.map(function (contact) { return contact.phoneNumber; });
            return _this.userService.getUserListByMobiles(mobiles).subscribe(function (res) {
                var users = res.data;
                users.forEach(function (user, i) {
                    user.displayName = _this.getDisplayName(user.mobile, contacts);
                });
                _this.userList = users;
            });
        }, function (err) { return _this.myHttp.handleError(err, '获取通讯录好友失败'); });
    };
    FriendByContactPage.prototype.findContacts = function () {
        var fields = ['displayName'];
        var options = { hasPhoneNumber: true };
        var p = this.contacts.find(fields, options)
            .then(function (contacts) {
            var newContacts = [];
            contacts.forEach(function (contact) {
                //一个联系人，手机号码可能有多个
                contact.phoneNumbers.forEach(function (phoneNumber) {
                    newContacts.push({
                        displayName: contact.displayName,
                        phoneNumber: phoneNumber.value
                    });
                });
            });
            return newContacts;
        });
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].fromPromise(p);
    };
    FriendByContactPage.prototype.gotoFriendRequestPage = function (userId) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__friend_request_friend_request__["a" /* FriendRequestPage */], { userId: userId });
    };
    FriendByContactPage.prototype.getDisplayName = function (mobile, contacts) {
        var displayName;
        contacts.forEach(function (contact) {
            if (contact.phoneNumber === mobile) {
                displayName = contact.displayName;
                return false;
            }
        });
        return displayName;
    };
    FriendByContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-friend-by-contact-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\friend-by-contact\friend-by-contact.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>通讯录朋友</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-list>\n    <ion-item detail-none *ngFor="let user of userList">\n      <ion-thumbnail item-left>\n        <img [src]="user.avatarSrc">\n      </ion-thumbnail>\n\n      <h2 class="displayName">{{user.displayName}}</h2>\n      <p class="nickname">昵称:{{user.nickname}}</p>\n\n      <button ion-button outline item-end *ngIf="!user._isFriend" (click)=" gotoFriendRequestPage(user._id)">添加</button>\n      <ion-note item-right *ngIf="user._isFriend">已添加</ion-note>\n    </ion-item>\n\n\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\friend-by-contact\friend-by-contact.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_contacts__["a" /* Contacts */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_6__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_5__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_7__providers_my_http__["a" /* MyHttp */]])
    ], FriendByContactPage);
    return FriendByContactPage;
}());

//# sourceMappingURL=friend-by-contact.js.map

/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FriendListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__friend_add_friend_add__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__friend_new_friend_new__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_detail_user_detail__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_user__ = __webpack_require__(16);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var FriendListPage = /** @class */ (function () {
    function FriendListPage(app, navCtrl, userService) {
        this.app = app;
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.list = [];
    }
    FriendListPage.prototype.ngOnInit = function () {
        var _this = this;
        this.friendListSubscription = this.userService.friendList$.subscribe(function (friendList) {
            _this.list = friendList;
        });
    };
    FriendListPage.prototype.ngOnDestroy = function () {
        this.friendListSubscription.unsubscribe();
    };
    FriendListPage.prototype.gotoUserDetailPage = function (userId) {
        this.app.getRootNav().push(__WEBPACK_IMPORTED_MODULE_4__user_detail_user_detail__["a" /* UserDetailPage */], { userId: userId });
    };
    FriendListPage.prototype.gotoFriendAddPage = function () {
        this.app.getRootNav().push(__WEBPACK_IMPORTED_MODULE_2__friend_add_friend_add__["a" /* FriendAddPage */]);
    };
    FriendListPage.prototype.gotoFriendNewPage = function () {
        this.app.getRootNav().push(__WEBPACK_IMPORTED_MODULE_3__friend_new_friend_new__["a" /* FriendNewPage */]);
    };
    FriendListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-friend-list-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\friend-list\friend-list.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>通讯录</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n	<ion-list>\n		<button ion-item (click)="gotoFriendAddPage()">\n			<ion-icon name="person-add" item-left color="primary"></ion-icon>\n			添加好友\n		</button>\n		<button ion-item (click)="gotoFriendNewPage()">\n			<ion-icon name="link" item-left item-left color="thirdly"></ion-icon>\n			请求列表\n		</button>\n	</ion-list>\n\n	<ion-list *ngIf="list.length">\n		<button  ion-item detail-none *ngFor="let item of list" (click)="gotoUserDetailPage(item._id)">\n			<ion-thumbnail item-left>\n	           <img [src]="item.avatarSrc | avatarSrc">\n	        </ion-thumbnail>\n	        <h2>{{item.nickname}}</h2>\n		</button>\n	</ion-list>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\friend-list\friend-list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_5__services_user__["a" /* UserService */]])
    ], FriendListPage);
    return FriendListPage;
}());

//# sourceMappingURL=friend-list.js.map

/***/ }),

/***/ 297:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FriendNewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FriendNewPage = /** @class */ (function () {
    function FriendNewPage(userService, systemService, myHttp) {
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
    }
    FriendNewPage.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getFriendNewList().subscribe(function (res) {
            _this.list = res.data;
        }, function (err) { return _this.myHttp.handleError('查找好友申请列表失败'); });
    };
    FriendNewPage.prototype.confirmFriend = function (userId) {
        var _this = this;
        this.userService.confirmFriend(userId).subscribe(function (res) {
            _this.list.forEach(function (item) {
                if (item.fromUserId === userId) {
                    item.confirm = true;
                    return false;
                }
            });
            //刷新朋友列表
            _this.userService.getRelationList();
        }, function (err) { return _this.myHttp.handleError('添加失败'); });
    };
    FriendNewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-friend-new-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\friend-new\friend-new.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>新好友</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n  <div *ngIf="list && !list.length === 0" class="no-friend-request-tip">\n    <div>\n      <ion-icon name="sad" class="tip-icon"></ion-icon>\n    </div>\n    没有新好友请求\n  </div>\n\n  <ion-list *ngIf="list && list.length > 0">\n    <ion-item *ngFor="let item of list">\n      <ion-thumbnail item-left>\n        <img [src]="item._fromUser.avatarSrc | avatarSrc">\n      </ion-thumbnail>\n      <h2>{{item._fromUser.nickname}}</h2>\n      <p>{{item.requestMsg}}</p>\n\n      <button ion-button outline item-end *ngIf="!item.confirm" (click)="confirmFriend(item._fromUser._id)">添加</button>\n\n      <ion-note item-end *ngIf="item.confirm">已添加</ion-note>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\friend-new\friend-new.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_2__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_3__providers_my_http__["a" /* MyHttp */]])
    ], FriendNewPage);
    return FriendNewPage;
}());

//# sourceMappingURL=friend-new.js.map

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiscoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__timeline_list_timeline_list__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__joke_list_joke_list__ = __webpack_require__(300);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DiscoverPage = /** @class */ (function () {
    function DiscoverPage(navCtrl, appCtrl) {
        this.navCtrl = navCtrl;
        this.appCtrl = appCtrl;
    }
    DiscoverPage.prototype.gotoTimelineListPage = function () {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_2__timeline_list_timeline_list__["a" /* TimelineListPage */]);
    };
    DiscoverPage.prototype.gotoJokeListPage = function () {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_3__joke_list_joke_list__["a" /* JokeListPage */]);
    };
    DiscoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-discover-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\discover\discover.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>发现</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-list margin-top>\n		<button ion-item (click)="gotoTimelineListPage()">\n			<ion-icon name="send" item-left></ion-icon>\n			朋友圈\n		</button>\n	</ion-list>\n\n	<ion-list margin-top>\n		<button ion-item (click)="gotoJokeListPage()">\n			<ion-icon name="happy" item-left></ion-icon>\n			笑话\n		</button>\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\discover\discover.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */]])
    ], DiscoverPage);
    return DiscoverPage;
}());

//# sourceMappingURL=discover.js.map

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimelineListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__user_detail_user_detail__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__timeline_add_timeline_add__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_backend__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_timeline__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_keyboard__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils_utils__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












function isStringLike(s) {
    return s !== undefined && s !== null && s !== '';
}
var TimelineListPage = /** @class */ (function () {
    function TimelineListPage(cdRef, renderer, fb, navCtrl, keyboard, timelineService, systemService, backEnd, myHttp) {
        this.cdRef = cdRef;
        this.renderer = renderer;
        this.fb = fb;
        this.navCtrl = navCtrl;
        this.keyboard = keyboard;
        this.timelineService = timelineService;
        this.systemService = systemService;
        this.backEnd = backEnd;
        this.myHttp = myHttp;
        this.timelines = [];
        this.commenting = false;
        this.form = fb.group({
            content: ''
        });
    }
    TimelineListPage.prototype.ngOnInit = function () {
        var _this = this;
        var obser = this.timelineService.getTimelines();
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.timelines = res.data;
            _this.updateDiff();
        }, function (err) { return _this.myHttp.handleError(err, '查看朋友圈出错啦'); });
        this.contentComponent.ionScrollStart.subscribe(function (e) {
            _this.hideCommentInput();
        }, function (err) {
            console.log(err);
        });
        this.keyboard.onKeyboardHide().subscribe(function (v) {
            console.log(v);
            _this.hideCommentInput();
        }, function (err) {
            console.log(err);
        });
        this.timer = setInterval(function () {
            _this.updateDiff();
        }, 60000);
        this.timelineService.onRefresh.subscribe(function () {
            _this.doRefresh();
        }, function (err) {
            console.log(err);
        });
        // document.addEventListener("resize", () => {
        // 	console.log(123123);
        // 	this.contentComponent.resize();
        // }, false);
    };
    TimelineListPage.prototype.updateDiff = function () {
        this.timelines.forEach(function (item) {
            item['timediff'] = Object(__WEBPACK_IMPORTED_MODULE_11__utils_utils__["d" /* getDiff */])(item.publishTime);
            return item;
        });
    };
    TimelineListPage.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
    };
    TimelineListPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.timelineService.getTimelines()
            .do(function () {
            refresher && refresher.complete();
        }, function () {
            refresher && refresher.complete();
        })
            .subscribe(function (res) {
            _this.timelines = res.data;
            _this.updateDiff();
        }, function (err) { return _this.myHttp.handleError(err, '查看朋友圈出错啦'); });
    };
    TimelineListPage.prototype.likeTimeline = function (timelineId, isLike) {
        var _this = this;
        this.timelineService.likeTimeline(timelineId, isLike)
            .subscribe(function (res) {
            var timeline = res.data;
            _this.timelines.forEach(function (_timeline, i) {
                if (_timeline._id === timeline._id) {
                    _this.timelines[i].likeUserIds = timeline.likeUserIds;
                    _this.timelines[i]._likeUsers = timeline._likeUsers;
                    _this.timelines[i]._isLike = timeline._isLike;
                    return false;
                }
            });
        }, function (err) { return _this.myHttp.handleError(err, '点赞失败'); });
    };
    TimelineListPage.prototype.commentTimeline = function () {
        var _this = this;
        var timelineId = this.commentTimelineId;
        var atUserId = this.atUserId;
        var content = this.form.value.content;
        this.timelineService.commentTimeline(timelineId, content, atUserId).subscribe(function (res) {
            var timeline = res.data;
            _this.timelines.forEach(function (_timeline, i) {
                if (_timeline._id === timeline._id) {
                    _this.timelines[i]._comments = timeline._comments;
                    return false;
                }
            });
        }, function (err) { return _this.myHttp.handleError(err, '评论失败'); });
    };
    TimelineListPage.prototype.onContentClick = function () {
        if (!this.commenting)
            return;
        this.hideCommentInput();
    };
    TimelineListPage.prototype.onCommentBtnClick = function (e, timelineId, atUserId, atUserName) {
        e.stopPropagation();
        if (this.commenting === true) {
            this.hideCommentInput();
            return;
        }
        if (atUserId === this.backEnd.getOwnId()) {
        }
        else {
            this.showCommentInput(timelineId, atUserId, atUserName);
        }
    };
    TimelineListPage.prototype.showCommentInput = function (timelineId, atUserId, atUserName) {
        var _this = this;
        this.commentTimelineId = timelineId;
        this.atUserId = atUserId;
        this.atUserName = atUserName;
        this.commenting = true;
        this.contentComponent.resize();
        this.cdRef.detectChanges();
        //反显草稿
        var content = this.timelineService.getCacheComment(timelineId, atUserId);
        if (!isStringLike(content)) {
            content = '';
        }
        this.form.setValue({
            content: content
        });
        //input获得焦点
        setTimeout(function () {
            _this.renderer.invokeElementMethod(_this.input.nativeElement, 'focus');
            _this.keyboard.show();
        }, 0);
    };
    TimelineListPage.prototype.hideCommentInput = function () {
        //保存草稿
        var content = this.form.value.content;
        this.timelineService.cacheComment(this.commentTimelineId, this.atUserId, content);
        //清除评论框状态
        this.commentTimelineId = null;
        this.atUserId = null;
        this.atUserName = null;
        this.commenting = false;
        this.contentComponent.resize();
        this.cdRef.detectChanges();
    };
    TimelineListPage.prototype.getPlaceholder = function () {
        return this.atUserId ? "\u56DE\u590D" + this.atUserName + "\uFF1A" : "\u8BC4\u8BBA";
    };
    TimelineListPage.prototype.gotoTimelineAddPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__timeline_add_timeline_add__["a" /* TimelineAddPage */]);
    };
    TimelineListPage.prototype.gotoUserDetailPage = function (userId) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__user_detail_user_detail__["a" /* UserDetailPage */], { userId: userId });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('input'),
        __metadata("design:type", Object)
    ], TimelineListPage.prototype, "input", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* Content */]),
        __metadata("design:type", Object)
    ], TimelineListPage.prototype, "contentComponent", void 0);
    TimelineListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-timeline-list-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\timeline-list\timeline-list.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>朋友圈</ion-title>\n\n    <ion-buttons end>\n      <button ion-button icon-only (click)="gotoTimelineAddPage()">\n          <ion-icon name="create"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content [fullscreen]="true" (click)="onContentClick()">\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content></ion-refresher-content>\n  </ion-refresher>\n\n  <div class="timeline" *ngFor="let timeline of timelines">\n\n    <img class="avatar" [src]="timeline._user && timeline._user.avatarSrc | avatarSrc" (click)="gotoUserDetailPage(timeline.userId)">\n\n    <div class="right-container ">\n      <a class="nickname" (click)="gotoUserDetailPage(timeline.userId)">{{timeline._user && timeline._user.nickname}}</a>\n      <!--内容-->\n      <p class="content">{{timeline.content}}</p>\n\n      <!--图片区-->\n      <div class="media-container clearfix">\n        <div class="media-wrap" *ngFor="let mediaSrc of timeline.mediaSrcs">\n          <cy-img [src]="mediaSrc | imgSrc" width="100%" height="100%" [zoom]="true"></cy-img>\n        </div>\n      </div>\n      <div>\n        <span class="publishTime">{{timeline.timediff | timediff}}</span>\n        <div class="cb-wrap clearfix">\n          <div class="comment-btn-wrap">\n            <!--点赞按钮-->\n            <button ion-button icon-left clear small (click)="likeTimeline(timeline._id,!timeline._isLike)">\n        			<ion-icon name="heart" color="fourthly" *ngIf="timeline._isLike"></ion-icon>\n							<ion-icon name="heart-outline" color="fourthly" *ngIf="!timeline._isLike"></ion-icon>\n      			</button>\n            <!--评论按钮-->\n            <button ion-button icon-left clear small (click)="onCommentBtnClick($event,timeline._id)">\n							<ion-icon name="md-chatboxes" color="grey"></ion-icon>\n						</button>\n          </div>\n        </div>\n      </div>\n\n      <div class="cc-wrap" *ngIf="(timeline._likeUsers && timeline._likeUsers.length) || (timeline._comments && timeline._comments.length)">\n        <div class="comment-content-wrap">\n          <!--点赞-->\n          <div class="likes" *ngIf="timeline._likeUsers && timeline._likeUsers.length">\n            <ion-icon name="heart-outline"></ion-icon>\n            <ng-template ngFor let-likeUser [ngForOf]="timeline._likeUsers" let-i="index">\n              <span *ngIf="i>0">,</span>\n              <span class="likeUser" (click)="gotoUserDetailPage(timeline.userId)">\n							 {{likeUser.nickname}}\n              </span>\n            </ng-template>\n            \n          </div>\n          <!--评论-->\n          <div class="comments" *ngIf="timeline._comments && timeline._comments.length">\n            <div class="comment" *ngFor="let comment of timeline._comments" (click)="onCommentBtnClick($event, timeline._id, comment.userId, comment._user.nickname)">\n              <span>{{comment._user && comment._user.nickname}}</span>\n              <span *ngIf="comment._atUser">@ {{comment._atUser && comment._atUser.nickname}}</span>：{{comment.content}}\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n\n</ion-content>\n\n<ion-footer [ngClass]="{hide:!commenting}">\n  <ion-toolbar>\n    <form [formGroup]="form" (ngSubmit)="commentTimeline()">\n      <input #input type="text" [attr.placeholder]="getPlaceholder()" formControlName="content" />\n    </form>\n  </ion-toolbar>\n</ion-footer>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\timeline-list\timeline-list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* ChangeDetectorRef */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_6__services_timeline__["a" /* TimelineService */],
            __WEBPACK_IMPORTED_MODULE_7__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_backend__["a" /* BackEnd */],
            __WEBPACK_IMPORTED_MODULE_9__providers_my_http__["a" /* MyHttp */]])
    ], TimelineListPage);
    return TimelineListPage;
}());

//# sourceMappingURL=timeline-list.js.map

/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JokeListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__joke_add_joke_add__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_joke__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_do__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







function isStringLike(s) {
    return s !== undefined && s !== null && s !== '';
}
var JokeListPage = /** @class */ (function () {
    function JokeListPage(fb, jokeService, myHttp, navCtrl) {
        this.fb = fb;
        this.jokeService = jokeService;
        this.myHttp = myHttp;
        this.navCtrl = navCtrl;
        this.jokes = [];
        this.form = fb.group({
            content: ''
        });
    }
    JokeListPage.prototype.ngOnInit = function () {
        var _this = this;
        this.jokeService.getJokes()
            .subscribe(function (res) {
            _this.jokes = res.data;
        }, function (err) { return _this.myHttp.handleError(err, '获取数据出错啦'); });
    };
    JokeListPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.jokeService.getJokes()
            .do(function () {
            refresher && refresher.complete();
        }, function () {
            refresher && refresher.complete();
        })
            .subscribe(function (res) {
            _this.jokes = res.data;
        }, function (err) { return _this.myHttp.handleError(err, '获取数据出错啦'); });
    };
    JokeListPage.prototype.likeJoke = function (joke, isLike) {
        var _this = this;
        this.jokeService.likeJoke(joke._id, isLike)
            .subscribe(function (res) {
            Object.assign(joke, res.data);
        }, function (err) { return _this.myHttp.handleError(err, '出错啦'); });
    };
    JokeListPage.prototype.dislikeJoke = function (joke, isDislike) {
        var _this = this;
        this.jokeService.dislikeJoke(joke._id, isDislike)
            .subscribe(function (res) {
            Object.assign(joke, res.data);
        }, function (err) { return _this.myHttp.handleError(err, '出错啦'); });
    };
    JokeListPage.prototype.gotoJokeAddPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__joke_add_joke_add__["a" /* JokeAddPage */]);
    };
    JokeListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-joke-list-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\joke-list\joke-list.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>笑话</ion-title>\n\n		<ion-buttons end>\n			<button ion-button icon-only (click)="gotoJokeAddPage()">\n				<ion-icon name="create"></ion-icon>\n			</button>\n		</ion-buttons>\n	</ion-navbar>\n</ion-header>\n\n\n<ion-content [fullscreen]="true">\n	<ion-refresher (ionRefresh)="doRefresh($event)">\n		<ion-refresher-content></ion-refresher-content>\n	</ion-refresher>\n\n	<ion-card *ngFor="let joke of jokes">\n\n		<ion-item>\n			<ion-avatar item-start>\n				<img [src]="joke._user.avatarSrc | avatarSrc" />\n			</ion-avatar>\n			<h2>\n				<ion-icon name="male" color="primary" *ngIf="joke._user.gender===0"></ion-icon>\n				<ion-icon name="female" color="fourthly" *ngIf="joke._user.gender===1"></ion-icon>\n				{{joke._user.nickname}}\n			</h2>\n			<p>{{joke.publishTime | date:\'yyyy-MM-dd hh:mm:ss\'}}</p>\n		</ion-item>\n\n		<img src="img/advance-card-bttf.png">\n\n		<ion-card-content>\n			<p>{{ joke.content }}</p>\n		</ion-card-content>\n\n		<ion-row>\n			<ion-col>\n				<button ion-button icon-left clear small (click)="likeJoke(joke, !joke._isLike)">\n					<ion-icon [name]="joke._isLike ? \'happy\' : \'happy-outline\'"></ion-icon>\n					<div>{{ joke._likeCount}}</div>\n				</button>\n\n				<button ion-button icon-left clear small (click)="dislikeJoke(joke, !joke._isDislike)">\n					<ion-icon [name]="joke._isDislike ? \'sad\' : \'sad-outline\'"></ion-icon>\n					<div>{{ joke._dislikeCount}}</div>\n				</button>\n			</ion-col>\n		</ion-row>\n\n	</ion-card>\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\joke-list\joke-list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__services_joke__["a" /* JokeService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */]])
    ], JokeListPage);
    return JokeListPage;
}());

//# sourceMappingURL=joke-list.js.map

/***/ }),

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JokeAddPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_joke__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var JokeAddPage = /** @class */ (function () {
    function JokeAddPage(sanitizer, fb, navCtrl, actionSheetCtrl, jokeService, systemService, myHttp) {
        this.sanitizer = sanitizer;
        this.fb = fb;
        this.navCtrl = navCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.jokeService = jokeService;
        this.systemService = systemService;
        this.myHttp = myHttp;
    }
    JokeAddPage.prototype.ngOnInit = function () {
        this.form = this.fb.group({
            content: [
                '',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required
                ]
            ]
        });
    };
    JokeAddPage.prototype.publish = function () {
        var _this = this;
        var formValue = this.form.value;
        //上传文件
        var formData = new FormData();
        formData.append("content", formValue.content);
        var obser = this.jokeService.publishJoke(formData);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.systemService.showToast('发表成功');
            setTimeout(function () {
                _this.navCtrl.pop();
            }, 1500);
        }, function (err) { return _this.myHttp.handleError(err, '发表失败'); });
    };
    JokeAddPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-joke-add-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\joke-add\joke-add.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>发表笑话</ion-title>\n\n    <ion-buttons end>\n      <button ion-button (click)="publish()" [disabled]="form.invalid">发表</button>\n    </ion-buttons>\n  </ion-navbar>\n\n\n\n</ion-header>\n<ion-content>\n  <form [formGroup]="form" (ngSubmit)="publish()">\n    <ion-list class="input-wrap">\n      <ion-item>\n        <ion-textarea type="text" placeholder="来一段" formControlName="content"></ion-textarea>\n      </ion-item>\n    </ion-list>\n  </form>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\joke-add\joke-add.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_4__services_joke__["a" /* JokeService */],
            __WEBPACK_IMPORTED_MODULE_5__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_6__providers_my_http__["a" /* MyHttp */]])
    ], JokeAddPage);
    return JokeAddPage;
}());

//# sourceMappingURL=joke-add.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_barcode_scanner__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__download_download__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__setting_setting__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__me_detail_me_detail__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__qrcode_qrcode__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_backend__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var MePage = /** @class */ (function () {
    function MePage(platform, appCtrl, barcodeScanner, userService, backend, systemService, myHttp) {
        this.platform = platform;
        this.appCtrl = appCtrl;
        this.barcodeScanner = barcodeScanner;
        this.userService = userService;
        this.backend = backend;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.own = {};
    }
    MePage.prototype.ngOnInit = function () {
        var _this = this;
        this.own_Subscription = this.userService.own$.subscribe(function (own) { return _this.own = own; });
    };
    MePage.prototype.ngOnDestroy = function () {
        this.own_Subscription.unsubscribe();
    };
    MePage.prototype.scanBarCode = function () {
        var _this = this;
        var nonsupport = this.platform.is('mobileweb');
        if (nonsupport)
            return this.systemService.showToast('扫一扫暂不支持浏览器，请下载APP体验');
        var options = {
            showFlipCameraButton: true,
            showTorchButton: true,
            orientation: 'portrait'
        };
        this.barcodeScanner.scan(options)
            .then(function (barcodeData) {
            console.log('barcodeData', barcodeData);
            // Success! Barcode data is here
        }, function (err) { return _this.myHttp.handleError(err, '出错啦'); });
    };
    MePage.prototype.gotoMeDetailPage = function () {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_5__me_detail_me_detail__["a" /* MeDetailPage */]);
    };
    MePage.prototype.gotoDownloadPage = function () {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_3__download_download__["a" /* DownloadPage */]);
    };
    MePage.prototype.gotoSettingPage = function () {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_4__setting_setting__["a" /* SettingPage */]);
    };
    MePage.prototype.gotoQRcodePage = function () {
        this.appCtrl.getRootNav().push(__WEBPACK_IMPORTED_MODULE_6__qrcode_qrcode__["a" /* QRcodePage */]);
    };
    MePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-me-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\me\me.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>我的</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list margin-top>\n    <button class="info" ion-item (click)="gotoMeDetailPage()">\n			<ion-thumbnail item-left>\n	           <img [src]="own.avatarSrc | avatarSrc" />\n	        </ion-thumbnail>\n	        <h2>\n            <span class="nickname">{{own.nickname}}</span>\n             <ion-icon name="male" color="primary" *ngIf="own.gender===0"></ion-icon>\n            <ion-icon name="female" color="fourthly" *ngIf="own.gender===1"></ion-icon>\n          </h2>\n          <p class="username">用户名：{{own.username}}</p>\n        </button>\n  </ion-list>\n\n\n  <ion-list>\n    <button ion-item (click)="scanBarCode()">\n      <ion-icon name="md-qr-scanner" color="primary" item-left></ion-icon> 扫一扫\n    </button>\n    <!-- <button ion-item (click)="gotoQRcodePage()">\n      <ion-icon name="md-qr-scanner" color="primary" item-left></ion-icon> 我的二维码\n    </button> -->\n\n    <button ion-item (click)="gotoDownloadPage()">\n      <ion-icon name="logo-android" color="android" item-left></ion-icon> 下载APP\n    </button>\n  </ion-list>\n\n  <ion-list>\n    <button ion-item (click)="gotoSettingPage()">\n      <ion-icon name="settings" color="thirdly" item-left></ion-icon> 设置\n      </button>\n  </ion-list>\n\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\me\me.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
            __WEBPACK_IMPORTED_MODULE_7__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_9__providers_backend__["a" /* BackEnd */],
            __WEBPACK_IMPORTED_MODULE_8__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_10__providers_my_http__["a" /* MyHttp */]])
    ], MePage);
    return MePage;
}());

//# sourceMappingURL=me.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DownloadPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_config__ = __webpack_require__(40);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DownloadPage = /** @class */ (function () {
    function DownloadPage() {
        this.android_url = __WEBPACK_IMPORTED_MODULE_1__config_config__["a" /* ANDROID_DOWNLOAD_URL */];
    }
    DownloadPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-download-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\download\download.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>下载APP</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <h2>Android版</h2>\n\n  <div padding class="qrcode-wrap">\n    <cy-qrcode class="qrcode" [text]="android_url"></cy-qrcode>\n\n    <a margin-top ion-button block round [href]="android_url">下载</a>\n  </div>\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\download\download.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], DownloadPage);
    return DownloadPage;
}());

//# sourceMappingURL=download.js.map

/***/ }),

/***/ 304:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(70);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SettingPage = /** @class */ (function () {
    function SettingPage(navCtrl, storage) {
        this.navCtrl = navCtrl;
        this.storage = storage;
    }
    SettingPage.prototype.clearStorage = function () {
        this.storage.clear();
    };
    //登出
    SettingPage.prototype.signout = function () {
        var that = this;
        this.storage.remove('token').then(function () {
            that.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
        });
    };
    SettingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-setting-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\setting\setting.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>设置</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list margin-top>\n    <button ion-item (click)="clearStorage()">清除缓存</button>\n  </ion-list>\n\n  <div padding-horizontal>\n    <button ion-button block round color="danger" (click)="signout()">登出</button>\n  </div>\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\setting\setting.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], SettingPage);
    return SettingPage;
}());

//# sourceMappingURL=setting.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VerifyMobilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__validators_index__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__signup_signup__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__login_login__ = __webpack_require__(70);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var VerifyMobilePage = /** @class */ (function () {
    function VerifyMobilePage(navCtrl, renderer, userservice, fb, systemService, myHttp, alertCtrl) {
        this.navCtrl = navCtrl;
        this.renderer = renderer;
        this.userservice = userservice;
        this.fb = fb;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.alertCtrl = alertCtrl;
        this.disableButton = false;
        this.buttonName = '获取验证码';
        this.countdown = 60;
        this.formLabelMap = {
            mobile: '手机号',
            code: '验证码'
        };
        this.form = fb.group({
            mobile: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_6__validators_index__["c" /* myValidators */].mobile
                ]
            ],
            code: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required,
                ]
            ]
        });
    }
    VerifyMobilePage.prototype._countdown = function () {
        var _this = this;
        if (this.countdown === 0) {
            this.disableButton = false;
            this.buttonName = '获取验证码';
            this.countdown = 60;
            clearInterval(this.timer);
        }
        else {
            this.disableButton = true;
            this.countdown--;
            this.buttonName = "\u83B7\u53D6\u9A8C\u8BC1\u7801(" + this.countdown + ")";
            this.timer = setTimeout(function () {
                _this._countdown();
            }, 1000);
        }
    };
    //获取短信验证码
    VerifyMobilePage.prototype.getVerificationCode = function (e) {
        var _this = this;
        e.preventDefault();
        if (this.form.controls['mobile'].invalid) {
            var msg = Object(__WEBPACK_IMPORTED_MODULE_6__validators_index__["a" /* getErrorMsgByFormControl */])(this.form.controls['mobile'], this.formLabelMap['mobile']);
            this.systemService.showToast(msg);
            return;
        }
        //获取验证码
        var mobile = this.form.value.mobile;
        this.userservice.getVerificationCode(mobile).subscribe(function (res) {
            _this._countdown();
            _this.codeInput.setFocus();
            _this.systemService.showToast(res.msg);
        }, function (err) { return _this.myHttp.handleError(err, '发送短信失败'); });
    };
    //验证短信验证码
    VerifyMobilePage.prototype.checkVerificationCode = function () {
        var _this = this;
        if (this.form.invalid) {
            var msg = Object(__WEBPACK_IMPORTED_MODULE_6__validators_index__["b" /* getErrorMsgByFormGroup */])(this.form, this.formLabelMap);
            this.systemService.showToast(msg);
            return;
        }
        var mobile = this.form.value.mobile;
        var code = this.form.value.code;
        var obser = this.userservice.checkVerificationCode(mobile, code);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            //手机号已经注册
            if (res.code === 1) {
                var confirm_1 = _this.alertCtrl.create({
                    title: '该手机号码已经注册过',
                    message: '该手机号码已经注册过，如果是你的号码，你可以直接登录。',
                    buttons: [
                        {
                            text: '重新输入',
                            handler: function () {
                                _this.form.reset();
                                _this.countdown = 0;
                            }
                        },
                        {
                            text: '去登录',
                            handler: function () {
                                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_8__login_login__["a" /* LoginPage */], { username: mobile });
                            }
                        }
                    ]
                });
                confirm_1.present();
                return;
            }
            var mobileToken = res.data.mobileToken;
            _this.gotoSignupPage(mobileToken);
        }, function (err) { return _this.myHttp.handleError(err, '手机验证失败'); });
    };
    VerifyMobilePage.prototype.gotoSignupPage = function (mobileToken) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__signup_signup__["a" /* SignupPage */], { mobileToken: mobileToken });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('codeInput'),
        __metadata("design:type", Object)
    ], VerifyMobilePage.prototype, "codeInput", void 0);
    VerifyMobilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-verifymobile-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\verifymobile\verifymobile.html"*/'<ion-header no-border>\n  <ion-navbar color="transparent">\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <h1 class="tip">请输入你的手机号</h1>\n  <form [formGroup]="form" (ngSubmit)="checkVerificationCode()">\n    <ion-list>\n      <ion-item>\n        <ion-label>手机号</ion-label>\n        <ion-input type="tel" formControlName="mobile" placeholder="11位手机号" [clearInput]="true"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-label>验证码</ion-label>\n        <ion-input #codeInput type="tel" formControlName="code" placeholder="6位数字" [clearInput]="true"></ion-input>\n        <button ion-button item-end outline round (click)="getVerificationCode($event)" [disabled]="disableButton">{{buttonName}}</button>\n      </ion-item>\n    </ion-list>\n    <div padding-horizontal>\n      <button type="submit" ion-button block round>下一步</button>\n    </div>\n  </form>\n</ion-content>'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\verifymobile\verifymobile.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer */],
            __WEBPACK_IMPORTED_MODULE_3__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* AlertController */]])
    ], VerifyMobilePage);
    return VerifyMobilePage;
}());

//# sourceMappingURL=verifymobile.js.map

/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__validators_user__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__patterns__ = __webpack_require__(627);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__validators_index__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__set_info_set_info__ = __webpack_require__(307);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











// declare var cordova: any;
var SignupPage = /** @class */ (function () {
    function SignupPage(sanitizer, navCtrl, navParams, actionSheetCtrl, userservice, fb, userService, userValidator, systemService, myHttp) {
        this.sanitizer = sanitizer;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.actionSheetCtrl = actionSheetCtrl;
        this.userservice = userservice;
        this.fb = fb;
        this.userService = userService;
        this.userValidator = userValidator;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.formLabelMap = {
            username: '用户名',
            password: '密码'
        };
        var mobileToken = navParams.data['mobileToken'];
        this.form = fb.group({
            mobileToken: mobileToken,
            username: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(__WEBPACK_IMPORTED_MODULE_7__patterns__["a" /* patterns */].username)
                ],
                this.userValidator.existsByUsernameAsync()
            ],
            password: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(__WEBPACK_IMPORTED_MODULE_7__patterns__["a" /* patterns */].password)
                ]
            ]
        });
    }
    SignupPage.prototype.signup = function () {
        var _this = this;
        if (this.form.invalid) {
            var msg = Object(__WEBPACK_IMPORTED_MODULE_9__validators_index__["b" /* getErrorMsgByFormGroup */])(this.form, this.formLabelMap);
            this.systemService.showToast(msg);
            return;
        }
        var formData = this.form.value;
        var obser = this.userService.signup(formData.mobileToken, formData.username, formData.password);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__set_info_set_info__["a" /* SetInfoPage */], { mobileToken: formData.mobileToken });
        }, function (err) { return _this.myHttp.handleError(err, '注册失败'); });
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-signup-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\signup\signup.html"*/'<ion-header no-border>\n  <ion-navbar color="transparent">\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <form [formGroup]="form" (ngSubmit)="signup()">\n    <h2 class="tip">注册帐号</h2>\n    <ion-list>\n      <ion-item>\n        <ion-label>用户名</ion-label>\n        <ion-input type="text" formControlName="username" placeholder="6-18个字符，字母、数字或_，开头必须为字母"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-label>密码</ion-label>\n        <ion-input type="password" formControlName="password" placeholder="6-18个字符，字母、数字或_"></ion-input>\n      </ion-item>\n    </ion-list>\n\n    <div padding-horizontal>\n      <button ion-button block round>注册</button>\n    </div>\n  </form>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\signup\signup.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_5__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_5__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_6__validators_user__["a" /* UserValidator */],
            __WEBPACK_IMPORTED_MODULE_4__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_8__providers_my_http__["a" /* MyHttp */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SetInfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_crop__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__validators_user__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__validators_index__ = __webpack_require__(99);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












// declare var cordova: any;
var SetInfoPage = /** @class */ (function () {
    function SetInfoPage(sanitizer, navCtrl, navParams, imagePicker, platform, camera, crop, actionSheetCtrl, userservice, fb, userService, userValidator, systemService, myHttp) {
        this.sanitizer = sanitizer;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.imagePicker = imagePicker;
        this.platform = platform;
        this.camera = camera;
        this.crop = crop;
        this.actionSheetCtrl = actionSheetCtrl;
        this.userservice = userservice;
        this.fb = fb;
        this.userService = userService;
        this.userValidator = userValidator;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.formLabelMap = {
            avatar: '个性头像',
            nickname: '昵称',
            gender: '性别',
            motto: '个性签名'
        };
        var mobileToken = navParams.data['mobileToken'];
        this.form = fb.group({
            mobileToken: mobileToken,
            avatar: [[]],
            nickname: [
                '',
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
            ],
            gender: 0,
            motto: '',
        });
    }
    SetInfoPage.prototype.selectGender = function (event) {
        var _this = this;
        event.preventDefault();
        var actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '男',
                    handler: function () {
                        _this.form.controls['gender'].setValue(0);
                    }
                }, {
                    text: '女',
                    handler: function () {
                        _this.form.controls['gender'].setValue(1);
                    }
                }
            ]
        });
        actionSheet.present();
    };
    SetInfoPage.prototype.setInfo = function () {
        var _this = this;
        if (this.form.invalid) {
            var msg = Object(__WEBPACK_IMPORTED_MODULE_11__validators_index__["b" /* getErrorMsgByFormGroup */])(this.form, this.formLabelMap);
            this.systemService.showToast(msg);
            return;
        }
        var postData = this.form.value;
        //上传文件
        var formData = new FormData();
        formData.append("mobileToken", postData.mobileToken);
        formData.append("avatar", postData.avatar[0], 'avatar.png');
        formData.append("nickname", postData.nickname);
        formData.append("gender", postData.gender);
        formData.append("motto", postData.motto);
        var obser = this.userService.setInfo(formData);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.systemService.showToast('保存成功');
            setTimeout(function () {
                _this.navCtrl.popToRoot();
            }, 2000);
        }, function (err) { return _this.myHttp.handleError(err, '保存失败'); });
    };
    SetInfoPage.prototype.skip = function () {
        this.navCtrl.popToRoot();
    };
    // 设置头像
    SetInfoPage.prototype.presentActionSheet = function () {
        // let actionSheet = this.actionSheetCtrl.create({
        // 	buttons: [
        // 		{
        // 			text: '拍照',
        // 			handler: () => {
        // 				this.setByPhotograph();
        // 			}
        // 		}, {
        // 			text: '从手机相册选择',
        // 			handler: () => {
        // 				this.setByAlbum();
        // 			}
        // 		}, {
        // 			text: '取消',
        // 			role: 'cancel',
        // 			handler: () => {
        // 			}
        // 		}
        // 	]
        // });
        // actionSheet.present();
    };
    //通过拍照设置头像
    SetInfoPage.prototype.setByPhotograph = function () {
        // this.photograph()
        // 	.then((imageData) => {
        // 		return this.cropImg(imageData);
        // 	})
        // 	.then(newImagePath => {
        // 		return this.file.resolveLocalFilesystemUrl(newImagePath)
        // 	})
        // 	.then((fileEntry: FileEntry) => {
        // 		return new Promise<CordovaFile>((resolve, reject) => {
        // 			fileEntry.file(
        // 				file => {
        // 					resolve(file);
        // 				},
        // 				err => {
        // 					reject(err);
        // 				}
        // 			);
        // 		});
        // 	})
        // 	.then((file: CordovaFile) => {
        // 		var reader = new FileReader();
        // 		reader.onloadend = (e) => {
        // 			var Html5File = new Blob([e.target['result']], { type: 'image/png' });
        // 			Html5File['name'] = 'avatar.png';
        // 			this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
        // 			this.form.controls['avatar'].setValue([Html5File, Html5File]);
        // 		};
        // 		reader.readAsArrayBuffer(file as Blob);
        // 	})
        // 	.catch((err) => this.myHttp.handleError(err, '设置头像失败'));
    };
    //通过手机相册设置头像
    SetInfoPage.prototype.setByAlbum = function () {
        // this.openAlbum()
        // 	.then((uri) => {
        // 		return this.cropImg(uri);
        // 	})
        // 	.then(newImagePath => {
        // 		return CordovaFile.resolveLocalFilesystemUrl(newImagePath)
        // 	})
        // 	.then((fileEntry: FileEntry) => {
        // 		return new Promise<CordovaFile>((resolve, reject) => {
        // 			fileEntry.file(
        // 				file => {
        // 					resolve(file);
        // 				},
        // 				err => {
        // 					reject(err);
        // 				}
        // 			);
        // 		});
        // 	})
        // 	.then((file: CordovaFile) => {
        // 		var reader = new FileReader();
        // 		reader.onloadend = (e) => {
        // 			var Html5File = new Blob([e.target['result']], { type: 'image/png' });
        // 			Html5File['name'] = 'avatar.png';
        // 			this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
        // 			this.form.controls['avatar'].setValue([Html5File, Html5File]);
        // 		};
        // 		reader.readAsArrayBuffer(<Blob>file);
        // 	})
        // 	.catch((err) => this.myHttp.handleError(err, '设置头像失败'));
    };
    SetInfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-set-info-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\set-info\set-info.html"*/'<ion-header no-border>\n	<ion-navbar color="transparent">\n		<ion-buttons end>\n			<button ion-button icon-only (click)="skip()">\n				跳过,以后设置\n			</button>\n		</ion-buttons>\n	</ion-navbar>\n</ion-header>\n<ion-content>\n\n	<form [formGroup]="form" (ngSubmit)="setInfo()">\n		<h2 class="tip">完善个人资料</h2>\n		<div class="avatar-wrap">\n			<img [src]="avatarSrc | avatarSrc" (click)="presentActionSheet()" />\n			<p class="avatar-tip">点击图片，上传头像</p>\n		</div>\n		<ion-list>\n			<button ion-item (click)="selectGender($event)">\n				<ion-label>性别</ion-label>\n				<ion-note item-right>{{form.value.gender | gender}}</ion-note>\n			</button>\n			<ion-item>\n				<ion-label>昵称</ion-label>\n				<ion-input type="text" formControlName="nickname"></ion-input>\n			</ion-item>\n\n			<ion-item>\n				<ion-label>个性签名</ion-label>\n				<ion-textarea type="text" formControlName="motto"></ion-textarea>\n			</ion-item>\n		</ion-list>\n		<div padding-horizontal>\n			<button ion-button block>保存</button>\n		</div>\n	</form>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\set-info\set-info.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__["a" /* ImagePicker */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_crop__["a" /* Crop */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_8__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_8__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_9__validators_user__["a" /* UserValidator */],
            __WEBPACK_IMPORTED_MODULE_7__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_10__providers_my_http__["a" /* MyHttp */]])
    ], SetInfoPage);
    return SetInfoPage;
}());

//# sourceMappingURL=set-info.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mod_avatar_mod_avatar__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mod_nickname_mod_nickname__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mod_gender_mod_gender__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mod_motto_mod_motto__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_user__ = __webpack_require__(16);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







// import { SystemService } from '../../services/system';
var MeDetailPage = /** @class */ (function () {
    function MeDetailPage(navCtrl, userService) {
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.own = {};
    }
    MeDetailPage.prototype.ngOnInit = function () {
        var _this = this;
        this.own_Subscription = this.userService.own$.subscribe(function (own) {
            _this.own = own;
        });
    };
    MeDetailPage.prototype.ngOnDestroy = function () {
        this.own_Subscription.unsubscribe();
    };
    MeDetailPage.prototype.gotoModAvatarPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__mod_avatar_mod_avatar__["a" /* ModAvatarPage */], { avatarSrc: this.own.avatarSrc });
    };
    MeDetailPage.prototype.gotoModNicknamePage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__mod_nickname_mod_nickname__["a" /* ModNicknamePage */], { nickname: this.own.nickname });
    };
    MeDetailPage.prototype.gotoModGenderPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__mod_gender_mod_gender__["a" /* ModGenderPage */], { gender: this.own.gender });
    };
    MeDetailPage.prototype.gotoModMottoPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__mod_motto_mod_motto__["a" /* ModMottoPage */], { motto: this.own.motto });
    };
    MeDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-me-detail-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\me-detail\me-detail.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>个人信息</ion-title>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n	<ion-list>\n		<button ion-item (click)="gotoModAvatarPage()">\n			<span>个人头像</span>\n			<ion-thumbnail item-right>\n	           <img [src]="own.avatarSrc | avatarSrc" />\n	        </ion-thumbnail>\n		</button>\n		<button ion-item (click)="gotoModNicknamePage()">\n			<span >昵称</span>\n			<ion-note item-right>{{own.nickname}}</ion-note>\n		</button>\n		<ion-item>\n			<span>用户名</span>\n			<ion-note item-right>{{own.username}}</ion-note>\n		</ion-item>\n		<button ion-item (click)="gotoModGenderPage()">\n			<span>性别</span>\n			<ion-note item-right>{{own.gender | gender}}</ion-note>\n		</button>\n		<!--<button ion-item>\n			<span>地区</span>\n			<ion-note item-right>广东 东莞</ion-note>\n		</button>-->\n		<button ion-item (click)="gotoModMottoPage()">\n			<span>个性签名</span>\n			<ion-note item-right>{{own.motto || \'没填写\'}}</ion-note>\n		</button>\n	</ion-list>\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\me-detail\me-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_6__services_user__["a" /* UserService */]])
    ], MeDetailPage);
    return MeDetailPage;
}());

//# sourceMappingURL=me-detail.js.map

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModAvatarPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_image_picker__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_crop__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_toPromise__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils_file_utils__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_file__ = __webpack_require__(91);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













function FileEntry2Blob(fileEntry) {
    return new Promise(function (resolve, reject) {
        fileEntry.file(function (file) {
            resolve(file);
        }, function (err) {
            reject(err);
        });
    })
        .then(function (iFile) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var Html5File = new Blob([e.target['result']], { type: 'image/png' });
                Html5File['name'] = 'avatar.png';
                resolve(Html5File);
            };
            reader.onerror = function (err) {
                reject(err);
            };
            reader.readAsArrayBuffer(iFile);
        });
    });
}
var ModAvatarPage = /** @class */ (function () {
    function ModAvatarPage(sanitizer, platform, navCtrl, navParams, storage, imagePicker, camera, crop, fileCordova, actionSheetCtrl, userService, systemService, myHttp) {
        // this.avatarSrc = navParams.data['avatarSrc'];
        this.sanitizer = sanitizer;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.imagePicker = imagePicker;
        this.camera = camera;
        this.crop = crop;
        this.fileCordova = fileCordova;
        this.actionSheetCtrl = actionSheetCtrl;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
    }
    ModAvatarPage.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.own$.subscribe(function (own) {
            _this.avatarSrc = own.avatarSrc;
        });
    };
    ModAvatarPage.prototype.presentActionSheet = function () {
        var _this = this;
        var supportCordova = this.platform.is('cordova');
        if (supportCordova) {
            var buttons = [
                {
                    text: '拍照',
                    handler: function () {
                        _this.setByPhotograph();
                    }
                }, {
                    text: '从手机相册选择',
                    handler: function () {
                        _this.setByAlbum();
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: function () {
                    }
                }
            ];
            var actionSheet = this.actionSheetCtrl.create({
                buttons: buttons
            });
            actionSheet.present();
        }
        else {
            this.setByAlbum_html5();
        }
    };
    //通过拍照设置头像
    ModAvatarPage.prototype.setByPhotograph = function () {
        var _this = this;
        var supportCordova = this.platform.is('cordova');
        if (!supportCordova)
            return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');
        this.photograph()
            .then(function (fileURI) {
            return _this.cropImg(fileURI);
        })
            .then(function (newImagePath) {
            return _this.fileCordova.resolveLocalFilesystemUrl(newImagePath);
        })
            .then(function (fileEntry) {
            return FileEntry2Blob(fileEntry);
        })
            .then(function (file) {
            _this.userService.modAvatar(file);
        })
            .catch(function (err) { return _this.myHttp.handleError(err, '设置头像失败'); });
    };
    //通过手机相册设置头像
    ModAvatarPage.prototype.setByAlbum = function () {
        var _this = this;
        var supportCordova = this.platform.is('cordova');
        if (!supportCordova)
            return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');
        this.openAlbum()
            .then(function (fileURI) {
            return _this.cropImg(fileURI);
        })
            .then(function (newImagePath) {
            return _this.fileCordova.resolveLocalFilesystemUrl(newImagePath);
        })
            .then(function (fileEntry) {
            return FileEntry2Blob(fileEntry);
        })
            .then(function (file) {
            _this.userService.modAvatar(file);
        })
            .catch(function (err) { return _this.myHttp.handleError(err, '设置头像失败'); });
    };
    ModAvatarPage.prototype.setByAlbum_html5 = function () {
        var that = this;
        __WEBPACK_IMPORTED_MODULE_11__utils_file_utils__["a" /* fileUtils */].openAlbum()
            .then(function (file) {
            return Promise.all([__WEBPACK_IMPORTED_MODULE_11__utils_file_utils__["a" /* fileUtils */].File2DataURL(file), file]);
        })
            .then(function (values) {
            var dataURL = values[0];
            var file = values[1];
            // return utils.imgDataURL2File(dataURL, file.name, { destWidth: 100, destHeight: 100 })
            return __WEBPACK_IMPORTED_MODULE_11__utils_file_utils__["a" /* fileUtils */].imgDataURL2File(dataURL, file.name);
        })
            .then(function (_file) {
            that.userService.modAvatar(_file);
        });
    };
    //拍照
    ModAvatarPage.prototype.photograph = function () {
        var allowEdit = this.platform.is('ios') ? true : false;
        var options = {
            allowEdit: allowEdit,
            targetWidth: 400,
            targetHeight: 400,
        };
        return this.camera.getPicture(options);
    };
    //打开手机相册
    ModAvatarPage.prototype.openAlbum = function () {
        var options = {
            maximumImagesCount: 1
        };
        return this.imagePicker.getPictures(options).then(function (val) {
            return val[0];
        });
    };
    //裁剪图片
    ModAvatarPage.prototype.cropImg = function (fileURI) {
        return this.crop.crop(fileURI, { quality: 100 });
    };
    ModAvatarPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-mod-avatar-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\mod-avatar\mod-avatar.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>个人头像</ion-title>\n    <ion-buttons end >\n      <button ion-button icon-only (click)="presentActionSheet()">\n          <ion-icon name="more"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n	<div class="img-box">\n		<img [src]="avatarSrc | avatarSrc:500"/>\n	</div>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\mod-avatar\mod-avatar.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_image_picker__["a" /* ImagePicker */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_crop__["a" /* Crop */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_7__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_8__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_9__providers_my_http__["a" /* MyHttp */]])
    ], ModAvatarPage);
    return ModAvatarPage;
}());

//# sourceMappingURL=mod-avatar.js.map

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackEnd; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_MyRelaySubject__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





// var io = require('../assets/js/socket.io-1.4.5');
var SIP = __webpack_require__(374);
var BackEnd = /** @class */ (function () {
    function BackEnd(myhttp) {
        this.myhttp = myhttp;
        //连接完触发
        // private onStatusChangedSubject = new ReplaySubject(1);
        // public onStatusChanged = this.onStatusChangedSubject.asObservable();
        this.onForceQuitSubject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this.onForceQuit = this.onForceQuitSubject.asObservable();
        this.stateSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"](0); //0-未连接  1-正在连接  //2-已连接
        this.state$ = this.stateSubject.asObservable();
        this.pushMsgSubject = new __WEBPACK_IMPORTED_MODULE_3__utils_MyRelaySubject__["a" /* MyReplaySubject */]();
        this.pushMsg$ = this.pushMsgSubject.asObservable();
        this.pushUserModedSubject = new __WEBPACK_IMPORTED_MODULE_3__utils_MyRelaySubject__["a" /* MyReplaySubject */]();
        this.pushUserModed$ = this.pushUserModedSubject.asObservable();
        this.client = null;
        this.session = null;
        this.livechatSessionId = '';
    }
    //连接
    BackEnd.prototype.connect = function (token, ownId, tenantId, username) {
        this.token = token;
        this.ownId = ownId;
        this.tenantId = tenantId;
        this.username = username;
        this.myhttp.setToken(token);
        this.connectSocket(token);
    };
    //断开连接
    BackEnd.prototype.disconnect = function () {
        this.token = null;
        this.ownId = null;
        this.username = null;
        this.myhttp.removeToken();
        this.disconnectSocket();
    };
    // getSource(){
    //     this.userService.getSource();
    //     this.msgService.getSource();
    // }
    BackEnd.prototype.clearSource = function () {
        //清除上一个用户的数据
        this.pushMsgSubject.clearBuffer();
        this.pushUserModedSubject.clearBuffer();
    };
    BackEnd.prototype.getToken = function () {
        return this.token;
    };
    BackEnd.prototype.getOwnId = function () {
        return this.ownId;
    };
    BackEnd.prototype.getTenantId = function () {
        return this.tenantId;
    };
    BackEnd.prototype.connectSocket = function (token) {
        // return new Promise((resolve, reject) => {
        //     this.socket = io.connect(HOST, {
        //         query: {
        //             token: this.token
        //         }
        //     });
        //     let init = () => {
        //         this.socket.on('connect', msg => {
        //             this.stateSubject.next(2);
        //             console.log('connect:连接成功');
        //         });
        //         this.socket.on('connect_error', msg => {
        //             this.stateSubject.next(0);
        //             console.log('connect_error:连接失败');
        //         });
        //         this.socket.on('connect_timeout', msg => {
        //             this.stateSubject.next(0);
        //             console.log('connect_timeout:连接超时');
        //         });
        //         this.socket.on('disconnect', msg => {
        //             this.stateSubject.next(0);
        //             console.log('disconnect:断开连接');
        //         });
        //         this.socket.on('reconnect_attempt', msg => {
        //             this.stateSubject.next(1);
        //             console.log('reconnect_attempt:尝试重连');
        //         });
        //         this.socket.on('reconnecting', msg => {
        //             this.stateSubject.next(1);
        //             console.log('reconnecting:重连中');
        //         });
        //         this.socket.on('reconnect', msg => {
        //             this.stateSubject.next(2);
        //             console.log('reconnect:重连成功');
        //         });
        //         this.socket.on('reconnect_error', msg => {
        //             this.stateSubject.next(0);
        //             console.log('reconnect_error:重连失败');
        //         });
        //         //推送消息
        //         this.socket.on('pushMsg', (msgs, ask) => {
        //             //如果是多条消息
        //             msgs.forEach(msg => {
        //                 this.pushMsgSubject.next(msg);
        //             });
        //             //传回服务器，删除存储记录
        //             var msgIds = msgs.map(msg => {
        //                 return msg._id;
        //             });
        //             ask(msgIds);
        //         });
        //         //推送修改过的user
        //         this.socket.on('pushUserModed', user => {
        //             this.pushUserModedSubject.next(user);
        //         });
        //         //强迫下线
        //         this.socket.on('forceQuit', msg => {
        //             this.onForceQuitSubject.next();
        //             this.socket.close();
        //         });
        //     }
        //     init();
        //     // this.socket.open();
        //     //登录
        //     this.socket.emit('login', token, (isOK) => {
        //         this.stateSubject.next(2);
        //         resolve();
        //     });
        // });
        return this.init({ exten: this.username, domain: this.tenantId, password: '123456' });
    };
    BackEnd.prototype.disconnectSocket = function () {
        if (this.socket) {
            this.socket.close();
            this.socket.off();
        }
    };
    BackEnd.prototype.init = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.client = new SIP.UA({
                                    // Replace this IP address with your FreeSWITCH IP address
                                    uri: options.exten + "@" + options.domain,
                                    // Replace this IP address with your FreeSWITCH IP address
                                    // and replace the port with your FreeSWITCH ws port
                                    transportOptions: {
                                        wsServers: 'ws://192.168.2.230:5066',
                                    },
                                    // FreeSWITCH Default Username
                                    authorizationUser: options.exten,
                                    // FreeSWITCH Default Password
                                    password: options.password,
                                    register: true,
                                    // sessionDescriptionHandlerFactory: (session, options) => {
                                    //     return new SessionDescriptionHandler(session, options);
                                    // },
                                    sessionDescriptionHandlerFactoryOptions: {
                                        constraints: {
                                            audio: true,
                                            video: false
                                        }
                                    }
                                });
                                var registered = false;
                                var onRegistionFailed = function (response, cause) {
                                    console.error('registrationFailed:', response, cause);
                                    // this.client.removeListener();
                                    _this.stateSubject.next(0);
                                    reject(cause);
                                };
                                var onRegistered = function () {
                                    console.info('registered');
                                    registered = true;
                                    _this.stateSubject.next(2);
                                    resolve();
                                };
                                _this.client.setMaxListeners(1000);
                                _this.client.once('registered', onRegistered);
                                _this.client.once('registrationFailed', onRegistionFailed);
                                _this.client.start();
                            })];
                    case 1:
                        _a.sent();
                        this.client.on('invite', this.acceptACall.bind(this));
                        this.client.on('message', this.handleChatMsg.bind(this));
                        return [2 /*return*/, Promise.resolve()];
                    case 2:
                        ex_1 = _a.sent();
                        console.error('SIP INIT ERROR:', ex_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BackEnd.prototype.makeACall = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.session = this.client.invite('1001', {
                        sessionDescriptionHandlerOptions: {
                            constraints: {
                                audio: true,
                                video: false
                            }
                        },
                    });
                }
                catch (ex) {
                    console.error('Make a Call Error:', ex);
                }
                return [2 /*return*/];
            });
        });
    };
    BackEnd.prototype.acceptACall = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var remoteVideo, localVideo;
            return __generator(this, function (_a) {
                try {
                    this.session = session;
                    console.debug('Accept a Aclling');
                    remoteVideo = document.getElementById('remoteVideo');
                    localVideo = document.getElementById('localVideo');
                    this.session.once('trackAdded', function () {
                        // We need to check the peer connection to determine which track was added
                        // this.session.sessionDescriptionHandler.setDescription('Liny', {
                        //     constraints: {
                        //         audio: true,
                        //         video: false
                        //     }
                        // });
                        var pc = _this.session.sessionDescriptionHandler.peerConnection;
                        // // Gets remote tracks
                        // const remoteStream = new MediaStream();
                        // pc.getReceivers().forEach(function (receiver) {
                        //     remoteStream.addTrack(receiver.track);
                        // });
                        // remoteVideo.srcObject = remoteStream;
                        // const playPromise = remoteVideo.play();
                        // if (playPromise !== undefined) {
                        //     playPromise.then(_ => {
                        //         // Automatic playback started!
                        //         // Show playing UI.
                        //         // We can now safely pause video...
                        //         // remoteVideo.pause();
                        //     })
                        //         .catch(error => {
                        //             // Auto-play was prevented
                        //             // Show paused UI.
                        //         });
                        // }
                        // // Gets local tracks
                        // const localStream = new MediaStream();
                        // pc.getSenders().forEach(function (sender) {
                        //     localStream.addTrack(sender.track);
                        // });
                        // localVideo.srcObject = localStream;
                        // const localeplayPromise = localVideo.play();
                        // if (localeplayPromise !== undefined) {
                        //     localeplayPromise.then(_ => {
                        //         // Automatic playback started!
                        //         // Show playing UI.
                        //         // We can now safely pause video...
                        //         // localeplayPromise.pause();
                        //     })
                        //         .catch(error => {
                        //             // Auto-play was prevented
                        //             // Show paused UI.
                        //         });
                        // }
                    });
                    this.session.accept();
                }
                catch (ex) {
                    console.error('Accept A Call Error:', ex);
                }
                return [2 /*return*/];
            });
        });
    };
    BackEnd.prototype.sendMsg = function (relationId, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var remsg, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                msg = msg.replace(/(^\s+)|(\s+$)/g, '');
                                if (!msg) {
                                    msg = '无言以对(^_^)';
                                }
                                _this.session = _this.client.message('livecat', msg, {
                                    contentType: 'text/plain',
                                    extraHeaders: [
                                        "X-Session-Id:" + _this.livechatSessionId,
                                        "X-Visitor-Id:" + _this.ownId,
                                    ]
                                });
                                _this.session.once('progress', function (response, cause) {
                                    console.debug('send msg progress', cause);
                                });
                                _this.session.once('accepted', function (response, cause) {
                                    console.debug('send msg accepted', cause);
                                    resolve(msg);
                                });
                                _this.session.once('rejected', function (response, cause) {
                                    console.debug('send msg rejected', cause);
                                    reject(cause);
                                });
                                _this.session.once('failed', function (response, cause) {
                                    console.debug('send msg failed', cause);
                                });
                            })];
                    case 1:
                        remsg = _a.sent();
                        return [2 /*return*/, remsg];
                    case 2:
                        ex_2 = _a.sent();
                        console.error('Send A Message Error:', ex_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BackEnd.prototype.handleChatMsg = function (msg) {
        var ua = msg.ua, method = msg.method, body = msg.body, request = msg.request, localIdentity = msg.localIdentity, remoteIdentity = msg.remoteIdentity;
        var uri = remoteIdentity.uri, displayName = remoteIdentity.displayName;
        var scheme = uri.scheme, user = uri.user;
        this.livechatSessionId = request.getHeader('X-Session-Id') || '';
        console.log('handler msg', { scheme: scheme, user: user, displayName: displayName, uri: uri, localIdentity: localIdentity });
        this.pushMsgSubject.next({
            _id: new Date().getTime(),
            _fromUser: {
                _id: user,
                avatarSrc: ''
            },
            fromUserId: user,
            relationId: this.tenantId,
            timediff: new Date().getTime(),
            type: 0,
            content: "" + msg.body
        });
    };
    BackEnd.prototype.getChatMessage = function () {
        return this.pushMsg$;
    };
    BackEnd = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__my_http__["a" /* MyHttp */]])
    ], BackEnd);
    return BackEnd;
}());

//# sourceMappingURL=backend.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModNicknamePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ModNicknamePage = /** @class */ (function () {
    function ModNicknamePage(navCtrl, navParams, builder, userService, systemService, myHttp) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.builder = builder;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        var nickname = navParams.data['nickname'];
        this.form = builder.group({
            nickname: nickname
        });
    }
    ModNicknamePage.prototype.ngOnInit = function () {
    };
    //提交
    ModNicknamePage.prototype.submit = function () {
        var _this = this;
        var nickname = this.form.value.nickname;
        var obser = this.userService.modNickname(nickname);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.navCtrl.pop();
        }, function (err) { return _this.myHttp.handleError(err, '修改失败'); });
    };
    ModNicknamePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-mod-nickname-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\mod-nickname\mod-nickname.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>昵称</ion-title>\n\n    <ion-buttons end >\n      <button ion-button icon-only [disabled]="form.invalid || !form.dirty" (click)="submit()">\n          完成\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n	<form [formGroup]="form" (ngSubmit)="submit()">\n		<ion-list>\n			<ion-item>\n				<ion-input #input type="text" placeholder="昵称" formControlName="nickname"></ion-input>\n			</ion-item>\n		</ion-list>\n	</form>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\mod-nickname\mod-nickname.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_4__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_my_http__["a" /* MyHttp */]])
    ], ModNicknamePage);
    return ModNicknamePage;
}());

//# sourceMappingURL=mod-nickname.js.map

/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModGenderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ModGenderPage = /** @class */ (function () {
    function ModGenderPage(navCtrl, navParams, builder, userService, systemService, myHttp) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.builder = builder;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        var gender = navParams.data['gender'];
        this.form = builder.group({
            gender: [gender],
        });
    }
    ModGenderPage.prototype.ngOnInit = function () {
    };
    //提交
    ModGenderPage.prototype.submit = function () {
        var _this = this;
        var gender = this.form.value.gender;
        var obser = this.userService.modGender(gender);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.navCtrl.pop();
        }, function (err) { return _this.myHttp.handleError(err, '修改失败'); });
    };
    ModGenderPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-mod-gender-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\mod-gender\mod-gender.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>性别</ion-title>\n\n    <ion-buttons end >\n      <button ion-button icon-only  (click)="submit()">\n          完成\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n	<form [formGroup]="form" (ngSubmit)="submit()">\n		<ion-list radio-group formControlName="gender">\n		  <ion-item>\n		    <ion-label>男</ion-label>\n		    <ion-radio value="0"></ion-radio>\n		  </ion-item>\n\n		  <ion-item>\n		    <ion-label>女</ion-label>\n		    <ion-radio value="1"></ion-radio>\n		  </ion-item>\n\n		</ion-list>\n\n		<!-- <ion-list radio-group formArrayName="genders">\n		  <ion-item *ngFor="let gender of genders.controls;let i= index">\n		    	<ion-label>{{gender.value}}</ion-label>\n		    	<ion-radio [value]="gender.value"></ion-radio>\n		  </ion-item>\n		</ion-list> -->\n	</form>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\mod-gender\mod-gender.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_4__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_my_http__["a" /* MyHttp */]])
    ], ModGenderPage);
    return ModGenderPage;
}());

//# sourceMappingURL=mod-gender.js.map

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModMottoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ModMottoPage = /** @class */ (function () {
    function ModMottoPage(navCtrl, navParams, builder, userService, systemService, myHttp) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.builder = builder;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        var motto = navParams.data['motto'];
        this.form = builder.group({
            motto: motto
        });
    }
    ModMottoPage.prototype.ngOnInit = function () {
    };
    //提交
    ModMottoPage.prototype.submit = function () {
        var _this = this;
        var motto = this.form.value.motto;
        var obser = this.userService.modMotto(motto);
        obser = this.systemService.linkLoading(obser);
        obser.subscribe(function (res) {
            _this.navCtrl.pop();
        }, function (err) { return _this.myHttp.handleError(err, '修改失败'); });
    };
    ModMottoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-mod-motto-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\mod-motto\mod-motto.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>个性签名</ion-title>\n\n    <ion-buttons end >\n      <button ion-button icon-only [disabled]="form.invalid || !form.dirty" (click)="submit()">\n          完成\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n	<form [formGroup]="form" (ngSubmit)="submit()">\n		<ion-list>\n			<ion-item>\n				<ion-textarea type="text" placeholder="个性签名" formControlName="motto"></ion-textarea>\n			</ion-item>\n		</ion-list>\n	</form>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\mod-motto\mod-motto.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_4__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_5__providers_my_http__["a" /* MyHttp */]])
    ], ModMottoPage);
    return ModMottoPage;
}());

//# sourceMappingURL=mod-motto.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QRcodePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_config__ = __webpack_require__(40);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var QRcodePage = /** @class */ (function () {
    function QRcodePage() {
        this.qrcodeText = __WEBPACK_IMPORTED_MODULE_1__config_config__["b" /* API_HOST */] + '/qrcode?userId=111&&action=markfriend';
    }
    QRcodePage.prototype.ngOnInit = function () {
    };
    QRcodePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-qrcode-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\qrcode\qrcode.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>我的二维码</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n<ion-content>\n  <cy-qrcode [text]="qrcodeText"></cy-qrcode>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\qrcode\qrcode.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], QRcodePage);
    return QRcodePage;
}());

//# sourceMappingURL=qrcode.js.map

/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_module__ = __webpack_require__(319);



Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_21" /* enableProdMode */])();
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_media__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_contacts__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_vibration__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_local_notifications__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_barcode_scanner__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_image_picker__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_camera__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_crop__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_keyboard__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_file_transfer__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_file__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__app_component__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_index_index__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_chat_popover_chat_popover__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_chat_chat__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_chat_content_chat_content__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_daily_daily__ = __webpack_require__(628);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_discover_discover__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_me_me__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_me_detail_me_detail__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_mod_avatar_mod_avatar__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_mod_nickname_mod_nickname__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_mod_gender_mod_gender__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_mod_motto_mod_motto__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_shop_shop__ = __webpack_require__(629);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_friend_add_friend_add__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_user_detail_user_detail__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_verifymobile_verifymobile__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_signup_signup__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_set_info_set_info__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_login_login__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_friend_list_friend_list__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_friend_new_friend_new__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_friend_request_friend_request__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_friend_by_contact_friend_by_contact__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_reorder_reorder__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_download_download__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_setting_setting__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__pages_timeline_list_timeline_list__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_timeline_add_timeline_add__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_joke_list_joke_list__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_joke_add_joke_add__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_qrcode_qrcode__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__factorys__ = __webpack_require__(630);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__components_components_module__ = __webpack_require__(631);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pipes_pipes_module__ = __webpack_require__(638);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__services_msg__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__services_timeline__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__services_joke__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__providers_backend__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__validators_user__ = __webpack_require__(157);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















/*pages*/
































/*components*/

/* pipes */

/*services*/







/*validators*/

//import { IndexPageModule } from '../pages/index/index.module'
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_18__app_component__["a" /* MyApp */],
                /*pages*/
                __WEBPACK_IMPORTED_MODULE_19__pages_index_index__["a" /* IndexPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_chat_chat__["a" /* ChatPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_chat_content_chat_content__["a" /* ChatContentPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_chat_popover_chat_popover__["a" /* ChatPopoverPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_daily_daily__["a" /* DailyPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_discover_discover__["a" /* DiscoverPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_me_me__["a" /* MePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_me_detail_me_detail__["a" /* MeDetailPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_mod_avatar_mod_avatar__["a" /* ModAvatarPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_mod_nickname_mod_nickname__["a" /* ModNicknamePage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_mod_gender_mod_gender__["a" /* ModGenderPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_mod_motto_mod_motto__["a" /* ModMottoPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_shop_shop__["a" /* ShopPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_friend_add_friend_add__["a" /* FriendAddPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_friend_request_friend_request__["a" /* FriendRequestPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_friend_by_contact_friend_by_contact__["a" /* FriendByContactPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_user_detail_user_detail__["a" /* UserDetailPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_set_info_set_info__["a" /* SetInfoPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_verifymobile_verifymobile__["a" /* VerifyMobilePage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_friend_list_friend_list__["a" /* FriendListPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_friend_new_friend_new__["a" /* FriendNewPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_reorder_reorder__["a" /* ReorderPage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_download_download__["a" /* DownloadPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_setting_setting__["a" /* SettingPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_timeline_list_timeline_list__["a" /* TimelineListPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_timeline_add_timeline_add__["a" /* TimelineAddPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_joke_list_joke_list__["a" /* JokeListPage */],
                __WEBPACK_IMPORTED_MODULE_48__pages_joke_add_joke_add__["a" /* JokeAddPage */],
                __WEBPACK_IMPORTED_MODULE_49__pages_qrcode_qrcode__["a" /* QRcodePage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_18__app_component__["a" /* MyApp */], {
                    // activator:"highlight",     //activator:"ripple",
                    // tabsHideOnSubPages : true,
                    // tabsHighlight:true,
                    backButtonText: '返回',
                    mode: 'ios'
                }, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_52__pipes_pipes_module__["a" /* PipesModule */],
                __WEBPACK_IMPORTED_MODULE_51__components_components_module__["a" /* ComponentsModule */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_18__app_component__["a" /* MyApp */],
                /*pages*/
                __WEBPACK_IMPORTED_MODULE_19__pages_index_index__["a" /* IndexPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_chat_popover_chat_popover__["a" /* ChatPopoverPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_chat_chat__["a" /* ChatPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_chat_content_chat_content__["a" /* ChatContentPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_daily_daily__["a" /* DailyPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_discover_discover__["a" /* DiscoverPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_me_me__["a" /* MePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_me_detail_me_detail__["a" /* MeDetailPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_mod_avatar_mod_avatar__["a" /* ModAvatarPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_mod_nickname_mod_nickname__["a" /* ModNicknamePage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_mod_motto_mod_motto__["a" /* ModMottoPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_mod_gender_mod_gender__["a" /* ModGenderPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_shop_shop__["a" /* ShopPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_friend_add_friend_add__["a" /* FriendAddPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_friend_request_friend_request__["a" /* FriendRequestPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_friend_by_contact_friend_by_contact__["a" /* FriendByContactPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_user_detail_user_detail__["a" /* UserDetailPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_set_info_set_info__["a" /* SetInfoPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_verifymobile_verifymobile__["a" /* VerifyMobilePage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_friend_list_friend_list__["a" /* FriendListPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_friend_new_friend_new__["a" /* FriendNewPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_reorder_reorder__["a" /* ReorderPage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_download_download__["a" /* DownloadPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_setting_setting__["a" /* SettingPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_timeline_list_timeline_list__["a" /* TimelineListPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_timeline_add_timeline_add__["a" /* TimelineAddPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_joke_list_joke_list__["a" /* JokeListPage */],
                __WEBPACK_IMPORTED_MODULE_48__pages_joke_add_joke_add__["a" /* JokeAddPage */],
                __WEBPACK_IMPORTED_MODULE_49__pages_qrcode_qrcode__["a" /* QRcodePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_media__["a" /* Media */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_contacts__["a" /* Contacts */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_vibration__["a" /* Vibration */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_local_notifications__["a" /* LocalNotifications */],
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
                __WEBPACK_IMPORTED_MODULE_12__ionic_native_image_picker__["a" /* ImagePicker */],
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_crop__["a" /* Crop */],
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_keyboard__["a" /* Keyboard */],
                __WEBPACK_IMPORTED_MODULE_16__ionic_native_file_transfer__["a" /* FileTransfer */],
                __WEBPACK_IMPORTED_MODULE_17__ionic_native_file__["a" /* File */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_57__services_system__["a" /* SystemService */],
                __WEBPACK_IMPORTED_MODULE_54__services_msg__["a" /* MsgService */],
                __WEBPACK_IMPORTED_MODULE_53__services_user__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_55__services_timeline__["a" /* TimelineService */],
                __WEBPACK_IMPORTED_MODULE_56__services_joke__["a" /* JokeService */],
                __WEBPACK_IMPORTED_MODULE_59__providers_backend__["a" /* BackEnd */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_58__providers_my_http__["a" /* MyHttp */],
                    useFactory: __WEBPACK_IMPORTED_MODULE_50__factorys__["a" /* myHttpFactory */],
                    deps: [__WEBPACK_IMPORTED_MODULE_2__angular_http__["g" /* XHRBackend */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["e" /* RequestOptions */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["h" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_57__services_system__["a" /* SystemService */], __WEBPACK_IMPORTED_MODULE_16__ionic_native_file_transfer__["a" /* FileTransfer */]]
                },
                __WEBPACK_IMPORTED_MODULE_60__validators_user__["a" /* UserValidator */],
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_index_index__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_chat_content_chat_content__ = __webpack_require__(62);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/*test*/
// import { SignupPage } from '../pages/signup/signup';
// import { SetInfoPage } from '../pages/set-info/set-info';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, storage, alertCtrl) {
        var _this = this;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        if (window) {
            this.apikey = this.getParameterByName('apikey', window.location.href);
        }
        if (this.apikey) {
            // this.rootPage = ChatContentPage;
            this.storage.set('apikey', this.apikey)
                .then(function () {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_chat_content_chat_content__["a" /* ChatContentPage */];
            });
        }
        else {
            //通过token判断是否登录过
            storage.get('token').then(function (token) {
                if (token) {
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_5__pages_index_index__["a" /* IndexPage */];
                }
                else {
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */];
                }
                // this.rootPage = SignupPage;
                // this.rootPage = TimelineAddPage;
                // this.rootPage = SetInfoPage;
            });
        }
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp.prototype.ngOnInit = function () {
    };
    MyApp.prototype.getParameterByName = function (name, url) {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\app\app.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], MyApp);
    return MyApp;
}());

// window.onerror = function (msg, url, line) {
// 	var idx = url.lastIndexOf("/");
// 	if (idx > -1) {
// 		url = url.substring(idx + 1);
// 	}
// 	alert("ERROR in " + url + " (line #" + line + "): " + msg);
// 	return false;
// };
document.addEventListener("resume", function () {
    console.log("应用回到前台运行！");
}, false);
document.addEventListener("resize", function () {
    console.log("resize");
}, false);
document.addEventListener("pause", function () {
    console.log("应用进入到后台！");
}, false);
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 373:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

/*!
 * 
 *  SIP version 0.11.0
 *  Copyright (c) 2014-2018 Junction Networks, Inc <http://www.onsip.com>
 *  Homepage: https://sipjs.com
 *  License: https://sipjs.com/license/
 * 
 * 
 *  ~~~SIP.js contains substantial portions of JsSIP under the following license~~~
 *  Homepage: http://jssip.net
 *  Copyright (c) 2012-2013 José Luis Millán - Versatica <http://www.versatica.com>
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining
 *  a copy of this software and associated documentation files (the
 *  "Software"), to deal in the Software without restriction, including
 *  without limitation the rights to use, copy, modify, merge, publish,
 *  distribute, sublicense, and/or sell copies of the Software, and to
 *  permit persons to whom the Software is furnished to do so, subject to
 *  the following conditions:
 * 
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 *  ~~~ end JsSIP license ~~~
 * 
 * 
 * 
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SIP"] = factory();
	else
		root["SIP"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/crypto-js/core.js":
/*!****************************************!*\
  !*** ./node_modules/crypto-js/core.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval(";(function (root, factory) {\n\tif (true) {\n\t\t// CommonJS\n\t\tmodule.exports = exports = factory();\n\t}\n\telse {}\n}(this, function () {\n\n\t/**\n\t * CryptoJS core components.\n\t */\n\tvar CryptoJS = CryptoJS || (function (Math, undefined) {\n\t    /*\n\t     * Local polyfil of Object.create\n\t     */\n\t    var create = Object.create || (function () {\n\t        function F() {};\n\n\t        return function (obj) {\n\t            var subtype;\n\n\t            F.prototype = obj;\n\n\t            subtype = new F();\n\n\t            F.prototype = null;\n\n\t            return subtype;\n\t        };\n\t    }())\n\n\t    /**\n\t     * CryptoJS namespace.\n\t     */\n\t    var C = {};\n\n\t    /**\n\t     * Library namespace.\n\t     */\n\t    var C_lib = C.lib = {};\n\n\t    /**\n\t     * Base object for prototypal inheritance.\n\t     */\n\t    var Base = C_lib.Base = (function () {\n\n\n\t        return {\n\t            /**\n\t             * Creates a new object that inherits from this object.\n\t             *\n\t             * @param {Object} overrides Properties to copy into the new object.\n\t             *\n\t             * @return {Object} The new object.\n\t             *\n\t             * @static\n\t             *\n\t             * @example\n\t             *\n\t             *     var MyType = CryptoJS.lib.Base.extend({\n\t             *         field: 'value',\n\t             *\n\t             *         method: function () {\n\t             *         }\n\t             *     });\n\t             */\n\t            extend: function (overrides) {\n\t                // Spawn\n\t                var subtype = create(this);\n\n\t                // Augment\n\t                if (overrides) {\n\t                    subtype.mixIn(overrides);\n\t                }\n\n\t                // Create default initializer\n\t                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {\n\t                    subtype.init = function () {\n\t                        subtype.$super.init.apply(this, arguments);\n\t                    };\n\t                }\n\n\t                // Initializer's prototype is the subtype object\n\t                subtype.init.prototype = subtype;\n\n\t                // Reference supertype\n\t                subtype.$super = this;\n\n\t                return subtype;\n\t            },\n\n\t            /**\n\t             * Extends this object and runs the init method.\n\t             * Arguments to create() will be passed to init().\n\t             *\n\t             * @return {Object} The new object.\n\t             *\n\t             * @static\n\t             *\n\t             * @example\n\t             *\n\t             *     var instance = MyType.create();\n\t             */\n\t            create: function () {\n\t                var instance = this.extend();\n\t                instance.init.apply(instance, arguments);\n\n\t                return instance;\n\t            },\n\n\t            /**\n\t             * Initializes a newly created object.\n\t             * Override this method to add some logic when your objects are created.\n\t             *\n\t             * @example\n\t             *\n\t             *     var MyType = CryptoJS.lib.Base.extend({\n\t             *         init: function () {\n\t             *             // ...\n\t             *         }\n\t             *     });\n\t             */\n\t            init: function () {\n\t            },\n\n\t            /**\n\t             * Copies properties into this object.\n\t             *\n\t             * @param {Object} properties The properties to mix in.\n\t             *\n\t             * @example\n\t             *\n\t             *     MyType.mixIn({\n\t             *         field: 'value'\n\t             *     });\n\t             */\n\t            mixIn: function (properties) {\n\t                for (var propertyName in properties) {\n\t                    if (properties.hasOwnProperty(propertyName)) {\n\t                        this[propertyName] = properties[propertyName];\n\t                    }\n\t                }\n\n\t                // IE won't copy toString using the loop above\n\t                if (properties.hasOwnProperty('toString')) {\n\t                    this.toString = properties.toString;\n\t                }\n\t            },\n\n\t            /**\n\t             * Creates a copy of this object.\n\t             *\n\t             * @return {Object} The clone.\n\t             *\n\t             * @example\n\t             *\n\t             *     var clone = instance.clone();\n\t             */\n\t            clone: function () {\n\t                return this.init.prototype.extend(this);\n\t            }\n\t        };\n\t    }());\n\n\t    /**\n\t     * An array of 32-bit words.\n\t     *\n\t     * @property {Array} words The array of 32-bit words.\n\t     * @property {number} sigBytes The number of significant bytes in this word array.\n\t     */\n\t    var WordArray = C_lib.WordArray = Base.extend({\n\t        /**\n\t         * Initializes a newly created word array.\n\t         *\n\t         * @param {Array} words (Optional) An array of 32-bit words.\n\t         * @param {number} sigBytes (Optional) The number of significant bytes in the words.\n\t         *\n\t         * @example\n\t         *\n\t         *     var wordArray = CryptoJS.lib.WordArray.create();\n\t         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);\n\t         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);\n\t         */\n\t        init: function (words, sigBytes) {\n\t            words = this.words = words || [];\n\n\t            if (sigBytes != undefined) {\n\t                this.sigBytes = sigBytes;\n\t            } else {\n\t                this.sigBytes = words.length * 4;\n\t            }\n\t        },\n\n\t        /**\n\t         * Converts this word array to a string.\n\t         *\n\t         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex\n\t         *\n\t         * @return {string} The stringified word array.\n\t         *\n\t         * @example\n\t         *\n\t         *     var string = wordArray + '';\n\t         *     var string = wordArray.toString();\n\t         *     var string = wordArray.toString(CryptoJS.enc.Utf8);\n\t         */\n\t        toString: function (encoder) {\n\t            return (encoder || Hex).stringify(this);\n\t        },\n\n\t        /**\n\t         * Concatenates a word array to this word array.\n\t         *\n\t         * @param {WordArray} wordArray The word array to append.\n\t         *\n\t         * @return {WordArray} This word array.\n\t         *\n\t         * @example\n\t         *\n\t         *     wordArray1.concat(wordArray2);\n\t         */\n\t        concat: function (wordArray) {\n\t            // Shortcuts\n\t            var thisWords = this.words;\n\t            var thatWords = wordArray.words;\n\t            var thisSigBytes = this.sigBytes;\n\t            var thatSigBytes = wordArray.sigBytes;\n\n\t            // Clamp excess bits\n\t            this.clamp();\n\n\t            // Concat\n\t            if (thisSigBytes % 4) {\n\t                // Copy one byte at a time\n\t                for (var i = 0; i < thatSigBytes; i++) {\n\t                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;\n\t                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);\n\t                }\n\t            } else {\n\t                // Copy one word at a time\n\t                for (var i = 0; i < thatSigBytes; i += 4) {\n\t                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];\n\t                }\n\t            }\n\t            this.sigBytes += thatSigBytes;\n\n\t            // Chainable\n\t            return this;\n\t        },\n\n\t        /**\n\t         * Removes insignificant bits.\n\t         *\n\t         * @example\n\t         *\n\t         *     wordArray.clamp();\n\t         */\n\t        clamp: function () {\n\t            // Shortcuts\n\t            var words = this.words;\n\t            var sigBytes = this.sigBytes;\n\n\t            // Clamp\n\t            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);\n\t            words.length = Math.ceil(sigBytes / 4);\n\t        },\n\n\t        /**\n\t         * Creates a copy of this word array.\n\t         *\n\t         * @return {WordArray} The clone.\n\t         *\n\t         * @example\n\t         *\n\t         *     var clone = wordArray.clone();\n\t         */\n\t        clone: function () {\n\t            var clone = Base.clone.call(this);\n\t            clone.words = this.words.slice(0);\n\n\t            return clone;\n\t        },\n\n\t        /**\n\t         * Creates a word array filled with random bytes.\n\t         *\n\t         * @param {number} nBytes The number of random bytes to generate.\n\t         *\n\t         * @return {WordArray} The random word array.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var wordArray = CryptoJS.lib.WordArray.random(16);\n\t         */\n\t        random: function (nBytes) {\n\t            var words = [];\n\n\t            var r = (function (m_w) {\n\t                var m_w = m_w;\n\t                var m_z = 0x3ade68b1;\n\t                var mask = 0xffffffff;\n\n\t                return function () {\n\t                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;\n\t                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;\n\t                    var result = ((m_z << 0x10) + m_w) & mask;\n\t                    result /= 0x100000000;\n\t                    result += 0.5;\n\t                    return result * (Math.random() > .5 ? 1 : -1);\n\t                }\n\t            });\n\n\t            for (var i = 0, rcache; i < nBytes; i += 4) {\n\t                var _r = r((rcache || Math.random()) * 0x100000000);\n\n\t                rcache = _r() * 0x3ade67b7;\n\t                words.push((_r() * 0x100000000) | 0);\n\t            }\n\n\t            return new WordArray.init(words, nBytes);\n\t        }\n\t    });\n\n\t    /**\n\t     * Encoder namespace.\n\t     */\n\t    var C_enc = C.enc = {};\n\n\t    /**\n\t     * Hex encoding strategy.\n\t     */\n\t    var Hex = C_enc.Hex = {\n\t        /**\n\t         * Converts a word array to a hex string.\n\t         *\n\t         * @param {WordArray} wordArray The word array.\n\t         *\n\t         * @return {string} The hex string.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);\n\t         */\n\t        stringify: function (wordArray) {\n\t            // Shortcuts\n\t            var words = wordArray.words;\n\t            var sigBytes = wordArray.sigBytes;\n\n\t            // Convert\n\t            var hexChars = [];\n\t            for (var i = 0; i < sigBytes; i++) {\n\t                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;\n\t                hexChars.push((bite >>> 4).toString(16));\n\t                hexChars.push((bite & 0x0f).toString(16));\n\t            }\n\n\t            return hexChars.join('');\n\t        },\n\n\t        /**\n\t         * Converts a hex string to a word array.\n\t         *\n\t         * @param {string} hexStr The hex string.\n\t         *\n\t         * @return {WordArray} The word array.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);\n\t         */\n\t        parse: function (hexStr) {\n\t            // Shortcut\n\t            var hexStrLength = hexStr.length;\n\n\t            // Convert\n\t            var words = [];\n\t            for (var i = 0; i < hexStrLength; i += 2) {\n\t                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);\n\t            }\n\n\t            return new WordArray.init(words, hexStrLength / 2);\n\t        }\n\t    };\n\n\t    /**\n\t     * Latin1 encoding strategy.\n\t     */\n\t    var Latin1 = C_enc.Latin1 = {\n\t        /**\n\t         * Converts a word array to a Latin1 string.\n\t         *\n\t         * @param {WordArray} wordArray The word array.\n\t         *\n\t         * @return {string} The Latin1 string.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);\n\t         */\n\t        stringify: function (wordArray) {\n\t            // Shortcuts\n\t            var words = wordArray.words;\n\t            var sigBytes = wordArray.sigBytes;\n\n\t            // Convert\n\t            var latin1Chars = [];\n\t            for (var i = 0; i < sigBytes; i++) {\n\t                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;\n\t                latin1Chars.push(String.fromCharCode(bite));\n\t            }\n\n\t            return latin1Chars.join('');\n\t        },\n\n\t        /**\n\t         * Converts a Latin1 string to a word array.\n\t         *\n\t         * @param {string} latin1Str The Latin1 string.\n\t         *\n\t         * @return {WordArray} The word array.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);\n\t         */\n\t        parse: function (latin1Str) {\n\t            // Shortcut\n\t            var latin1StrLength = latin1Str.length;\n\n\t            // Convert\n\t            var words = [];\n\t            for (var i = 0; i < latin1StrLength; i++) {\n\t                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);\n\t            }\n\n\t            return new WordArray.init(words, latin1StrLength);\n\t        }\n\t    };\n\n\t    /**\n\t     * UTF-8 encoding strategy.\n\t     */\n\t    var Utf8 = C_enc.Utf8 = {\n\t        /**\n\t         * Converts a word array to a UTF-8 string.\n\t         *\n\t         * @param {WordArray} wordArray The word array.\n\t         *\n\t         * @return {string} The UTF-8 string.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);\n\t         */\n\t        stringify: function (wordArray) {\n\t            try {\n\t                return decodeURIComponent(escape(Latin1.stringify(wordArray)));\n\t            } catch (e) {\n\t                throw new Error('Malformed UTF-8 data');\n\t            }\n\t        },\n\n\t        /**\n\t         * Converts a UTF-8 string to a word array.\n\t         *\n\t         * @param {string} utf8Str The UTF-8 string.\n\t         *\n\t         * @return {WordArray} The word array.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);\n\t         */\n\t        parse: function (utf8Str) {\n\t            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));\n\t        }\n\t    };\n\n\t    /**\n\t     * Abstract buffered block algorithm template.\n\t     *\n\t     * The property blockSize must be implemented in a concrete subtype.\n\t     *\n\t     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0\n\t     */\n\t    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({\n\t        /**\n\t         * Resets this block algorithm's data buffer to its initial state.\n\t         *\n\t         * @example\n\t         *\n\t         *     bufferedBlockAlgorithm.reset();\n\t         */\n\t        reset: function () {\n\t            // Initial values\n\t            this._data = new WordArray.init();\n\t            this._nDataBytes = 0;\n\t        },\n\n\t        /**\n\t         * Adds new data to this block algorithm's buffer.\n\t         *\n\t         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.\n\t         *\n\t         * @example\n\t         *\n\t         *     bufferedBlockAlgorithm._append('data');\n\t         *     bufferedBlockAlgorithm._append(wordArray);\n\t         */\n\t        _append: function (data) {\n\t            // Convert string to WordArray, else assume WordArray already\n\t            if (typeof data == 'string') {\n\t                data = Utf8.parse(data);\n\t            }\n\n\t            // Append\n\t            this._data.concat(data);\n\t            this._nDataBytes += data.sigBytes;\n\t        },\n\n\t        /**\n\t         * Processes available data blocks.\n\t         *\n\t         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.\n\t         *\n\t         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.\n\t         *\n\t         * @return {WordArray} The processed data.\n\t         *\n\t         * @example\n\t         *\n\t         *     var processedData = bufferedBlockAlgorithm._process();\n\t         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');\n\t         */\n\t        _process: function (doFlush) {\n\t            // Shortcuts\n\t            var data = this._data;\n\t            var dataWords = data.words;\n\t            var dataSigBytes = data.sigBytes;\n\t            var blockSize = this.blockSize;\n\t            var blockSizeBytes = blockSize * 4;\n\n\t            // Count blocks ready\n\t            var nBlocksReady = dataSigBytes / blockSizeBytes;\n\t            if (doFlush) {\n\t                // Round up to include partial blocks\n\t                nBlocksReady = Math.ceil(nBlocksReady);\n\t            } else {\n\t                // Round down to include only full blocks,\n\t                // less the number of blocks that must remain in the buffer\n\t                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);\n\t            }\n\n\t            // Count words ready\n\t            var nWordsReady = nBlocksReady * blockSize;\n\n\t            // Count bytes ready\n\t            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);\n\n\t            // Process blocks\n\t            if (nWordsReady) {\n\t                for (var offset = 0; offset < nWordsReady; offset += blockSize) {\n\t                    // Perform concrete-algorithm logic\n\t                    this._doProcessBlock(dataWords, offset);\n\t                }\n\n\t                // Remove processed words\n\t                var processedWords = dataWords.splice(0, nWordsReady);\n\t                data.sigBytes -= nBytesReady;\n\t            }\n\n\t            // Return processed words\n\t            return new WordArray.init(processedWords, nBytesReady);\n\t        },\n\n\t        /**\n\t         * Creates a copy of this object.\n\t         *\n\t         * @return {Object} The clone.\n\t         *\n\t         * @example\n\t         *\n\t         *     var clone = bufferedBlockAlgorithm.clone();\n\t         */\n\t        clone: function () {\n\t            var clone = Base.clone.call(this);\n\t            clone._data = this._data.clone();\n\n\t            return clone;\n\t        },\n\n\t        _minBufferSize: 0\n\t    });\n\n\t    /**\n\t     * Abstract hasher template.\n\t     *\n\t     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)\n\t     */\n\t    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({\n\t        /**\n\t         * Configuration options.\n\t         */\n\t        cfg: Base.extend(),\n\n\t        /**\n\t         * Initializes a newly created hasher.\n\t         *\n\t         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.\n\t         *\n\t         * @example\n\t         *\n\t         *     var hasher = CryptoJS.algo.SHA256.create();\n\t         */\n\t        init: function (cfg) {\n\t            // Apply config defaults\n\t            this.cfg = this.cfg.extend(cfg);\n\n\t            // Set initial values\n\t            this.reset();\n\t        },\n\n\t        /**\n\t         * Resets this hasher to its initial state.\n\t         *\n\t         * @example\n\t         *\n\t         *     hasher.reset();\n\t         */\n\t        reset: function () {\n\t            // Reset data buffer\n\t            BufferedBlockAlgorithm.reset.call(this);\n\n\t            // Perform concrete-hasher logic\n\t            this._doReset();\n\t        },\n\n\t        /**\n\t         * Updates this hasher with a message.\n\t         *\n\t         * @param {WordArray|string} messageUpdate The message to append.\n\t         *\n\t         * @return {Hasher} This hasher.\n\t         *\n\t         * @example\n\t         *\n\t         *     hasher.update('message');\n\t         *     hasher.update(wordArray);\n\t         */\n\t        update: function (messageUpdate) {\n\t            // Append\n\t            this._append(messageUpdate);\n\n\t            // Update the hash\n\t            this._process();\n\n\t            // Chainable\n\t            return this;\n\t        },\n\n\t        /**\n\t         * Finalizes the hash computation.\n\t         * Note that the finalize operation is effectively a destructive, read-once operation.\n\t         *\n\t         * @param {WordArray|string} messageUpdate (Optional) A final message update.\n\t         *\n\t         * @return {WordArray} The hash.\n\t         *\n\t         * @example\n\t         *\n\t         *     var hash = hasher.finalize();\n\t         *     var hash = hasher.finalize('message');\n\t         *     var hash = hasher.finalize(wordArray);\n\t         */\n\t        finalize: function (messageUpdate) {\n\t            // Final message update\n\t            if (messageUpdate) {\n\t                this._append(messageUpdate);\n\t            }\n\n\t            // Perform concrete-hasher logic\n\t            var hash = this._doFinalize();\n\n\t            return hash;\n\t        },\n\n\t        blockSize: 512/32,\n\n\t        /**\n\t         * Creates a shortcut function to a hasher's object interface.\n\t         *\n\t         * @param {Hasher} hasher The hasher to create a helper for.\n\t         *\n\t         * @return {Function} The shortcut function.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);\n\t         */\n\t        _createHelper: function (hasher) {\n\t            return function (message, cfg) {\n\t                return new hasher.init(cfg).finalize(message);\n\t            };\n\t        },\n\n\t        /**\n\t         * Creates a shortcut function to the HMAC's object interface.\n\t         *\n\t         * @param {Hasher} hasher The hasher to use in this HMAC helper.\n\t         *\n\t         * @return {Function} The shortcut function.\n\t         *\n\t         * @static\n\t         *\n\t         * @example\n\t         *\n\t         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);\n\t         */\n\t        _createHmacHelper: function (hasher) {\n\t            return function (message, key) {\n\t                return new C_algo.HMAC.init(hasher, key).finalize(message);\n\t            };\n\t        }\n\t    });\n\n\t    /**\n\t     * Algorithm namespace.\n\t     */\n\t    var C_algo = C.algo = {};\n\n\t    return C;\n\t}(Math));\n\n\n\treturn CryptoJS;\n\n}));\n\n//# sourceURL=webpack://SIP/./node_modules/crypto-js/core.js?");

/***/ }),

/***/ "./node_modules/crypto-js/md5.js":
/*!***************************************!*\
  !*** ./node_modules/crypto-js/md5.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval(";(function (root, factory) {\n\tif (true) {\n\t\t// CommonJS\n\t\tmodule.exports = exports = factory(__webpack_require__(/*! ./core */ \"./node_modules/crypto-js/core.js\"));\n\t}\n\telse {}\n}(this, function (CryptoJS) {\n\n\t(function (Math) {\n\t    // Shortcuts\n\t    var C = CryptoJS;\n\t    var C_lib = C.lib;\n\t    var WordArray = C_lib.WordArray;\n\t    var Hasher = C_lib.Hasher;\n\t    var C_algo = C.algo;\n\n\t    // Constants table\n\t    var T = [];\n\n\t    // Compute constants\n\t    (function () {\n\t        for (var i = 0; i < 64; i++) {\n\t            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;\n\t        }\n\t    }());\n\n\t    /**\n\t     * MD5 hash algorithm.\n\t     */\n\t    var MD5 = C_algo.MD5 = Hasher.extend({\n\t        _doReset: function () {\n\t            this._hash = new WordArray.init([\n\t                0x67452301, 0xefcdab89,\n\t                0x98badcfe, 0x10325476\n\t            ]);\n\t        },\n\n\t        _doProcessBlock: function (M, offset) {\n\t            // Swap endian\n\t            for (var i = 0; i < 16; i++) {\n\t                // Shortcuts\n\t                var offset_i = offset + i;\n\t                var M_offset_i = M[offset_i];\n\n\t                M[offset_i] = (\n\t                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |\n\t                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)\n\t                );\n\t            }\n\n\t            // Shortcuts\n\t            var H = this._hash.words;\n\n\t            var M_offset_0  = M[offset + 0];\n\t            var M_offset_1  = M[offset + 1];\n\t            var M_offset_2  = M[offset + 2];\n\t            var M_offset_3  = M[offset + 3];\n\t            var M_offset_4  = M[offset + 4];\n\t            var M_offset_5  = M[offset + 5];\n\t            var M_offset_6  = M[offset + 6];\n\t            var M_offset_7  = M[offset + 7];\n\t            var M_offset_8  = M[offset + 8];\n\t            var M_offset_9  = M[offset + 9];\n\t            var M_offset_10 = M[offset + 10];\n\t            var M_offset_11 = M[offset + 11];\n\t            var M_offset_12 = M[offset + 12];\n\t            var M_offset_13 = M[offset + 13];\n\t            var M_offset_14 = M[offset + 14];\n\t            var M_offset_15 = M[offset + 15];\n\n\t            // Working varialbes\n\t            var a = H[0];\n\t            var b = H[1];\n\t            var c = H[2];\n\t            var d = H[3];\n\n\t            // Computation\n\t            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);\n\t            d = FF(d, a, b, c, M_offset_1,  12, T[1]);\n\t            c = FF(c, d, a, b, M_offset_2,  17, T[2]);\n\t            b = FF(b, c, d, a, M_offset_3,  22, T[3]);\n\t            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);\n\t            d = FF(d, a, b, c, M_offset_5,  12, T[5]);\n\t            c = FF(c, d, a, b, M_offset_6,  17, T[6]);\n\t            b = FF(b, c, d, a, M_offset_7,  22, T[7]);\n\t            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);\n\t            d = FF(d, a, b, c, M_offset_9,  12, T[9]);\n\t            c = FF(c, d, a, b, M_offset_10, 17, T[10]);\n\t            b = FF(b, c, d, a, M_offset_11, 22, T[11]);\n\t            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);\n\t            d = FF(d, a, b, c, M_offset_13, 12, T[13]);\n\t            c = FF(c, d, a, b, M_offset_14, 17, T[14]);\n\t            b = FF(b, c, d, a, M_offset_15, 22, T[15]);\n\n\t            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);\n\t            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);\n\t            c = GG(c, d, a, b, M_offset_11, 14, T[18]);\n\t            b = GG(b, c, d, a, M_offset_0,  20, T[19]);\n\t            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);\n\t            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);\n\t            c = GG(c, d, a, b, M_offset_15, 14, T[22]);\n\t            b = GG(b, c, d, a, M_offset_4,  20, T[23]);\n\t            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);\n\t            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);\n\t            c = GG(c, d, a, b, M_offset_3,  14, T[26]);\n\t            b = GG(b, c, d, a, M_offset_8,  20, T[27]);\n\t            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);\n\t            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);\n\t            c = GG(c, d, a, b, M_offset_7,  14, T[30]);\n\t            b = GG(b, c, d, a, M_offset_12, 20, T[31]);\n\n\t            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);\n\t            d = HH(d, a, b, c, M_offset_8,  11, T[33]);\n\t            c = HH(c, d, a, b, M_offset_11, 16, T[34]);\n\t            b = HH(b, c, d, a, M_offset_14, 23, T[35]);\n\t            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);\n\t            d = HH(d, a, b, c, M_offset_4,  11, T[37]);\n\t            c = HH(c, d, a, b, M_offset_7,  16, T[38]);\n\t            b = HH(b, c, d, a, M_offset_10, 23, T[39]);\n\t            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);\n\t            d = HH(d, a, b, c, M_offset_0,  11, T[41]);\n\t            c = HH(c, d, a, b, M_offset_3,  16, T[42]);\n\t            b = HH(b, c, d, a, M_offset_6,  23, T[43]);\n\t            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);\n\t            d = HH(d, a, b, c, M_offset_12, 11, T[45]);\n\t            c = HH(c, d, a, b, M_offset_15, 16, T[46]);\n\t            b = HH(b, c, d, a, M_offset_2,  23, T[47]);\n\n\t            a = II(a, b, c, d, M_offset_0,  6,  T[48]);\n\t            d = II(d, a, b, c, M_offset_7,  10, T[49]);\n\t            c = II(c, d, a, b, M_offset_14, 15, T[50]);\n\t            b = II(b, c, d, a, M_offset_5,  21, T[51]);\n\t            a = II(a, b, c, d, M_offset_12, 6,  T[52]);\n\t            d = II(d, a, b, c, M_offset_3,  10, T[53]);\n\t            c = II(c, d, a, b, M_offset_10, 15, T[54]);\n\t            b = II(b, c, d, a, M_offset_1,  21, T[55]);\n\t            a = II(a, b, c, d, M_offset_8,  6,  T[56]);\n\t            d = II(d, a, b, c, M_offset_15, 10, T[57]);\n\t            c = II(c, d, a, b, M_offset_6,  15, T[58]);\n\t            b = II(b, c, d, a, M_offset_13, 21, T[59]);\n\t            a = II(a, b, c, d, M_offset_4,  6,  T[60]);\n\t            d = II(d, a, b, c, M_offset_11, 10, T[61]);\n\t            c = II(c, d, a, b, M_offset_2,  15, T[62]);\n\t            b = II(b, c, d, a, M_offset_9,  21, T[63]);\n\n\t            // Intermediate hash value\n\t            H[0] = (H[0] + a) | 0;\n\t            H[1] = (H[1] + b) | 0;\n\t            H[2] = (H[2] + c) | 0;\n\t            H[3] = (H[3] + d) | 0;\n\t        },\n\n\t        _doFinalize: function () {\n\t            // Shortcuts\n\t            var data = this._data;\n\t            var dataWords = data.words;\n\n\t            var nBitsTotal = this._nDataBytes * 8;\n\t            var nBitsLeft = data.sigBytes * 8;\n\n\t            // Add padding\n\t            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);\n\n\t            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);\n\t            var nBitsTotalL = nBitsTotal;\n\t            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (\n\t                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |\n\t                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)\n\t            );\n\t            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (\n\t                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |\n\t                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)\n\t            );\n\n\t            data.sigBytes = (dataWords.length + 1) * 4;\n\n\t            // Hash final blocks\n\t            this._process();\n\n\t            // Shortcuts\n\t            var hash = this._hash;\n\t            var H = hash.words;\n\n\t            // Swap endian\n\t            for (var i = 0; i < 4; i++) {\n\t                // Shortcut\n\t                var H_i = H[i];\n\n\t                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |\n\t                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);\n\t            }\n\n\t            // Return final computed hash\n\t            return hash;\n\t        },\n\n\t        clone: function () {\n\t            var clone = Hasher.clone.call(this);\n\t            clone._hash = this._hash.clone();\n\n\t            return clone;\n\t        }\n\t    });\n\n\t    function FF(a, b, c, d, x, s, t) {\n\t        var n = a + ((b & c) | (~b & d)) + x + t;\n\t        return ((n << s) | (n >>> (32 - s))) + b;\n\t    }\n\n\t    function GG(a, b, c, d, x, s, t) {\n\t        var n = a + ((b & d) | (c & ~d)) + x + t;\n\t        return ((n << s) | (n >>> (32 - s))) + b;\n\t    }\n\n\t    function HH(a, b, c, d, x, s, t) {\n\t        var n = a + (b ^ c ^ d) + x + t;\n\t        return ((n << s) | (n >>> (32 - s))) + b;\n\t    }\n\n\t    function II(a, b, c, d, x, s, t) {\n\t        var n = a + (c ^ (b | ~d)) + x + t;\n\t        return ((n << s) | (n >>> (32 - s))) + b;\n\t    }\n\n\t    /**\n\t     * Shortcut function to the hasher's object interface.\n\t     *\n\t     * @param {WordArray|string} message The message to hash.\n\t     *\n\t     * @return {WordArray} The hash.\n\t     *\n\t     * @static\n\t     *\n\t     * @example\n\t     *\n\t     *     var hash = CryptoJS.MD5('message');\n\t     *     var hash = CryptoJS.MD5(wordArray);\n\t     */\n\t    C.MD5 = Hasher._createHelper(MD5);\n\n\t    /**\n\t     * Shortcut function to the HMAC's object interface.\n\t     *\n\t     * @param {WordArray|string} message The message to hash.\n\t     * @param {WordArray|string} key The secret key.\n\t     *\n\t     * @return {WordArray} The HMAC.\n\t     *\n\t     * @static\n\t     *\n\t     * @example\n\t     *\n\t     *     var hmac = CryptoJS.HmacMD5(message, key);\n\t     */\n\t    C.HmacMD5 = Hasher._createHmacHelper(MD5);\n\t}(Math));\n\n\n\treturn CryptoJS.MD5;\n\n}));\n\n//# sourceURL=webpack://SIP/./node_modules/crypto-js/md5.js?");

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nfunction EventEmitter() {\n  this._events = this._events || {};\n  this._maxListeners = this._maxListeners || undefined;\n}\nmodule.exports = EventEmitter;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nEventEmitter.defaultMaxListeners = 10;\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function(n) {\n  if (!isNumber(n) || n < 0 || isNaN(n))\n    throw TypeError('n must be a positive number');\n  this._maxListeners = n;\n  return this;\n};\n\nEventEmitter.prototype.emit = function(type) {\n  var er, handler, len, args, i, listeners;\n\n  if (!this._events)\n    this._events = {};\n\n  // If there is no 'error' event listener then throw.\n  if (type === 'error') {\n    if (!this._events.error ||\n        (isObject(this._events.error) && !this._events.error.length)) {\n      er = arguments[1];\n      if (er instanceof Error) {\n        throw er; // Unhandled 'error' event\n      } else {\n        // At least give some kind of context to the user\n        var err = new Error('Uncaught, unspecified \"error\" event. (' + er + ')');\n        err.context = er;\n        throw err;\n      }\n    }\n  }\n\n  handler = this._events[type];\n\n  if (isUndefined(handler))\n    return false;\n\n  if (isFunction(handler)) {\n    switch (arguments.length) {\n      // fast cases\n      case 1:\n        handler.call(this);\n        break;\n      case 2:\n        handler.call(this, arguments[1]);\n        break;\n      case 3:\n        handler.call(this, arguments[1], arguments[2]);\n        break;\n      // slower\n      default:\n        args = Array.prototype.slice.call(arguments, 1);\n        handler.apply(this, args);\n    }\n  } else if (isObject(handler)) {\n    args = Array.prototype.slice.call(arguments, 1);\n    listeners = handler.slice();\n    len = listeners.length;\n    for (i = 0; i < len; i++)\n      listeners[i].apply(this, args);\n  }\n\n  return true;\n};\n\nEventEmitter.prototype.addListener = function(type, listener) {\n  var m;\n\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  if (!this._events)\n    this._events = {};\n\n  // To avoid recursion in the case that type === \"newListener\"! Before\n  // adding it to the listeners, first emit \"newListener\".\n  if (this._events.newListener)\n    this.emit('newListener', type,\n              isFunction(listener.listener) ?\n              listener.listener : listener);\n\n  if (!this._events[type])\n    // Optimize the case of one listener. Don't need the extra array object.\n    this._events[type] = listener;\n  else if (isObject(this._events[type]))\n    // If we've already got an array, just append.\n    this._events[type].push(listener);\n  else\n    // Adding the second element, need to change to array.\n    this._events[type] = [this._events[type], listener];\n\n  // Check for listener leak\n  if (isObject(this._events[type]) && !this._events[type].warned) {\n    if (!isUndefined(this._maxListeners)) {\n      m = this._maxListeners;\n    } else {\n      m = EventEmitter.defaultMaxListeners;\n    }\n\n    if (m && m > 0 && this._events[type].length > m) {\n      this._events[type].warned = true;\n      console.error('(node) warning: possible EventEmitter memory ' +\n                    'leak detected. %d listeners added. ' +\n                    'Use emitter.setMaxListeners() to increase limit.',\n                    this._events[type].length);\n      if (typeof console.trace === 'function') {\n        // not supported in IE 10\n        console.trace();\n      }\n    }\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.once = function(type, listener) {\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  var fired = false;\n\n  function g() {\n    this.removeListener(type, g);\n\n    if (!fired) {\n      fired = true;\n      listener.apply(this, arguments);\n    }\n  }\n\n  g.listener = listener;\n  this.on(type, g);\n\n  return this;\n};\n\n// emits a 'removeListener' event iff the listener was removed\nEventEmitter.prototype.removeListener = function(type, listener) {\n  var list, position, length, i;\n\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  if (!this._events || !this._events[type])\n    return this;\n\n  list = this._events[type];\n  length = list.length;\n  position = -1;\n\n  if (list === listener ||\n      (isFunction(list.listener) && list.listener === listener)) {\n    delete this._events[type];\n    if (this._events.removeListener)\n      this.emit('removeListener', type, listener);\n\n  } else if (isObject(list)) {\n    for (i = length; i-- > 0;) {\n      if (list[i] === listener ||\n          (list[i].listener && list[i].listener === listener)) {\n        position = i;\n        break;\n      }\n    }\n\n    if (position < 0)\n      return this;\n\n    if (list.length === 1) {\n      list.length = 0;\n      delete this._events[type];\n    } else {\n      list.splice(position, 1);\n    }\n\n    if (this._events.removeListener)\n      this.emit('removeListener', type, listener);\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.removeAllListeners = function(type) {\n  var key, listeners;\n\n  if (!this._events)\n    return this;\n\n  // not listening for removeListener, no need to emit\n  if (!this._events.removeListener) {\n    if (arguments.length === 0)\n      this._events = {};\n    else if (this._events[type])\n      delete this._events[type];\n    return this;\n  }\n\n  // emit removeListener for all listeners on all events\n  if (arguments.length === 0) {\n    for (key in this._events) {\n      if (key === 'removeListener') continue;\n      this.removeAllListeners(key);\n    }\n    this.removeAllListeners('removeListener');\n    this._events = {};\n    return this;\n  }\n\n  listeners = this._events[type];\n\n  if (isFunction(listeners)) {\n    this.removeListener(type, listeners);\n  } else if (listeners) {\n    // LIFO order\n    while (listeners.length)\n      this.removeListener(type, listeners[listeners.length - 1]);\n  }\n  delete this._events[type];\n\n  return this;\n};\n\nEventEmitter.prototype.listeners = function(type) {\n  var ret;\n  if (!this._events || !this._events[type])\n    ret = [];\n  else if (isFunction(this._events[type]))\n    ret = [this._events[type]];\n  else\n    ret = this._events[type].slice();\n  return ret;\n};\n\nEventEmitter.prototype.listenerCount = function(type) {\n  if (this._events) {\n    var evlistener = this._events[type];\n\n    if (isFunction(evlistener))\n      return 1;\n    else if (evlistener)\n      return evlistener.length;\n  }\n  return 0;\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  return emitter.listenerCount(type);\n};\n\nfunction isFunction(arg) {\n  return typeof arg === 'function';\n}\n\nfunction isNumber(arg) {\n  return typeof arg === 'number';\n}\n\nfunction isObject(arg) {\n  return typeof arg === 'object' && arg !== null;\n}\n\nfunction isUndefined(arg) {\n  return arg === void 0;\n}\n\n\n//# sourceURL=webpack://SIP/./node_modules/events/events.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || Function(\"return this\")() || (1, eval)(\"this\");\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack://SIP/(webpack)/buildin/global.js?");

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, title, description, version, main, browser, homepage, author, contributors, repository, keywords, devDependencies, engines, license, scripts, dependencies, optionalDependencies, default */
/***/ (function(module) {

eval("module.exports = {\"name\":\"sip.js\",\"title\":\"SIP.js\",\"description\":\"A simple, intuitive, and powerful JavaScript signaling library\",\"version\":\"0.11.0\",\"main\":\"dist/sip.min.js\",\"browser\":{\"./src/environment.js\":\"./src/environment_browser.js\"},\"homepage\":\"https://sipjs.com\",\"author\":\"OnSIP <developer@onsip.com> (https://sipjs.com/aboutus/)\",\"contributors\":[{\"url\":\"https://github.com/onsip/SIP.js/blob/master/THANKS.md\"}],\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/onsip/SIP.js.git\"},\"keywords\":[\"sip\",\"websocket\",\"webrtc\",\"library\",\"javascript\"],\"devDependencies\":{\"babel-core\":\"^6.26.0\",\"babel-loader\":\"^7.1.2\",\"babel-preset-env\":\"^1.6.1\",\"eslint\":\"^4.9.0\",\"jasmine\":\"^3.1.0\",\"jasmine-core\":\"^3.1.0\",\"karma\":\"^2.0.2\",\"karma-cli\":\"^1.0.1\",\"karma-jasmine\":\"^1.1.0\",\"karma-jasmine-html-reporter\":\"^1.1.0\",\"karma-mocha-reporter\":\"^2.2.5\",\"karma-phantomjs-launcher\":\"^1.0.4\",\"karma-webpack\":\"^3.0.0\",\"pegjs\":\"^0.10.0\",\"pegjs-loader\":\"^0.5.4\",\"phantomjs-polyfill-object-assign\":\"0.0.2\",\"uglifyjs-webpack-plugin\":\"^1.2.5\",\"webpack\":\"^4.8.3\",\"webpack-cli\":\"^2.1.3\"},\"engines\":{\"node\":\">=6.0\"},\"license\":\"MIT\",\"scripts\":{\"prebuild\":\"eslint src/*.js src/**/*.js\",\"build-dev\":\"webpack --progress --env.buildType dev\",\"build-prod\":\"webpack --progress --env.buildType prod\",\"copy-dist-files\":\"cp dist/sip.js dist/sip-$npm_package_version.js && cp dist/sip.min.js  dist/sip-$npm_package_version.min.js\",\"build\":\"npm run build-dev && npm run build-prod && npm run copy-dist-files\",\"browserTest\":\"sleep 2 && open http://0.0.0.0:9876/debug.html & karma start --reporters kjhtml --no-single-run\",\"commandLineTest\":\"karma start --reporters mocha --browsers PhantomJS --single-run\",\"buildAndTest\":\"npm run build && npm run commandLineTest\",\"buildAndBrowserTest\":\"npm run build && npm run browserTest\"},\"dependencies\":{\"crypto-js\":\"^3.1.9-1\"},\"optionalDependencies\":{\"promiscuous\":\"^0.6.0\"}};\n\n//# sourceURL=webpack://SIP/./package.json?");

/***/ }),

/***/ "./src/ClientContext.js":
/*!******************************!*\
  !*** ./src/ClientContext.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (SIP) {\n  var ClientContext;\n\n  ClientContext = function ClientContext(ua, method, target, options) {\n    var originalTarget = target;\n\n    // Validate arguments\n    if (target === undefined) {\n      throw new TypeError('Not enough arguments');\n    }\n\n    this.ua = ua;\n    this.logger = ua.getLogger('sip.clientcontext');\n    this.method = method;\n    target = ua.normalizeTarget(target);\n    if (!target) {\n      throw new TypeError('Invalid target: ' + originalTarget);\n    }\n\n    /* Options\n     * - extraHeaders\n     * - params\n     * - contentType\n     * - body\n     */\n    options = Object.create(options || Object.prototype);\n    options.extraHeaders = (options.extraHeaders || []).slice();\n\n    // Build the request\n    this.request = new SIP.OutgoingRequest(this.method, target, this.ua, options.params, options.extraHeaders);\n    if (options.body) {\n      this.body = {};\n      this.body.body = options.body;\n      if (options.contentType) {\n        this.body.contentType = options.contentType;\n      }\n      this.request.body = this.body;\n    }\n\n    /* Set other properties from the request */\n    this.localIdentity = this.request.from;\n    this.remoteIdentity = this.request.to;\n\n    this.data = {};\n  };\n  ClientContext.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  ClientContext.prototype.send = function () {\n    new SIP.RequestSender(this, this.ua).send();\n    return this;\n  };\n\n  ClientContext.prototype.cancel = function (options) {\n    options = options || {};\n\n    options.extraHeaders = (options.extraHeaders || []).slice();\n\n    var cancel_reason = SIP.Utils.getCancelReason(options.status_code, options.reason_phrase);\n    this.request.cancel(cancel_reason, options.extraHeaders);\n\n    this.emit('cancel');\n  };\n\n  ClientContext.prototype.receiveResponse = function (response) {\n    var cause = SIP.Utils.getReasonPhrase(response.status_code);\n\n    switch (true) {\n      case /^1[0-9]{2}$/.test(response.status_code):\n        this.emit('progress', response, cause);\n        break;\n\n      case /^2[0-9]{2}$/.test(response.status_code):\n        if (this.ua.applicants[this]) {\n          delete this.ua.applicants[this];\n        }\n        this.emit('accepted', response, cause);\n        break;\n\n      default:\n        if (this.ua.applicants[this]) {\n          delete this.ua.applicants[this];\n        }\n        this.emit('rejected', response, cause);\n        this.emit('failed', response, cause);\n        break;\n    }\n  };\n\n  ClientContext.prototype.onRequestTimeout = function () {\n    this.emit('failed', null, SIP.C.causes.REQUEST_TIMEOUT);\n  };\n\n  ClientContext.prototype.onTransportError = function () {\n    this.emit('failed', null, SIP.C.causes.CONNECTION_ERROR);\n  };\n\n  SIP.ClientContext = ClientContext;\n};\n\n//# sourceURL=webpack://SIP/./src/ClientContext.js?");

/***/ }),

/***/ "./src/Constants.js":
/*!**************************!*\
  !*** ./src/Constants.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP Constants\n */\n\n/**\n * SIP Constants.\n * @augments SIP\n */\n\nmodule.exports = function (name, version) {\n  return {\n    USER_AGENT: name + '/' + version,\n\n    // SIP scheme\n    SIP: 'sip',\n    SIPS: 'sips',\n\n    // End and Failure causes\n    causes: {\n      // Generic error causes\n      CONNECTION_ERROR: 'Connection Error',\n      REQUEST_TIMEOUT: 'Request Timeout',\n      SIP_FAILURE_CODE: 'SIP Failure Code',\n      INTERNAL_ERROR: 'Internal Error',\n\n      // SIP error causes\n      BUSY: 'Busy',\n      REJECTED: 'Rejected',\n      REDIRECTED: 'Redirected',\n      UNAVAILABLE: 'Unavailable',\n      NOT_FOUND: 'Not Found',\n      ADDRESS_INCOMPLETE: 'Address Incomplete',\n      INCOMPATIBLE_SDP: 'Incompatible SDP',\n      AUTHENTICATION_ERROR: 'Authentication Error',\n      DIALOG_ERROR: 'Dialog Error',\n\n      // Session error causes\n      WEBRTC_NOT_SUPPORTED: 'WebRTC Not Supported',\n      WEBRTC_ERROR: 'WebRTC Error',\n      CANCELED: 'Canceled',\n      NO_ANSWER: 'No Answer',\n      EXPIRES: 'Expires',\n      NO_ACK: 'No ACK',\n      NO_PRACK: 'No PRACK',\n      USER_DENIED_MEDIA_ACCESS: 'User Denied Media Access',\n      BAD_MEDIA_DESCRIPTION: 'Bad Media Description',\n      RTP_TIMEOUT: 'RTP Timeout'\n    },\n\n    supported: {\n      UNSUPPORTED: 'none',\n      SUPPORTED: 'supported',\n      REQUIRED: 'required'\n    },\n\n    SIP_ERROR_CAUSES: {\n      REDIRECTED: [300, 301, 302, 305, 380],\n      BUSY: [486, 600],\n      REJECTED: [403, 603],\n      NOT_FOUND: [404, 604],\n      UNAVAILABLE: [480, 410, 408, 430],\n      ADDRESS_INCOMPLETE: [484],\n      INCOMPATIBLE_SDP: [488, 606],\n      AUTHENTICATION_ERROR: [401, 407]\n    },\n\n    // SIP Methods\n    ACK: 'ACK',\n    BYE: 'BYE',\n    CANCEL: 'CANCEL',\n    INFO: 'INFO',\n    INVITE: 'INVITE',\n    MESSAGE: 'MESSAGE',\n    NOTIFY: 'NOTIFY',\n    OPTIONS: 'OPTIONS',\n    REGISTER: 'REGISTER',\n    UPDATE: 'UPDATE',\n    SUBSCRIBE: 'SUBSCRIBE',\n    PUBLISH: 'PUBLISH',\n    REFER: 'REFER',\n    PRACK: 'PRACK',\n\n    /* SIP Response Reasons\n     * DOC: http://www.iana.org/assignments/sip-parameters\n     * Copied from https://github.com/versatica/OverSIP/blob/master/lib/oversip/sip/constants.rb#L7\n     */\n    REASON_PHRASE: {\n      100: 'Trying',\n      180: 'Ringing',\n      181: 'Call Is Being Forwarded',\n      182: 'Queued',\n      183: 'Session Progress',\n      199: 'Early Dialog Terminated', // draft-ietf-sipcore-199\n      200: 'OK',\n      202: 'Accepted', // RFC 3265\n      204: 'No Notification', //RFC 5839\n      300: 'Multiple Choices',\n      301: 'Moved Permanently',\n      302: 'Moved Temporarily',\n      305: 'Use Proxy',\n      380: 'Alternative Service',\n      400: 'Bad Request',\n      401: 'Unauthorized',\n      402: 'Payment Required',\n      403: 'Forbidden',\n      404: 'Not Found',\n      405: 'Method Not Allowed',\n      406: 'Not Acceptable',\n      407: 'Proxy Authentication Required',\n      408: 'Request Timeout',\n      410: 'Gone',\n      412: 'Conditional Request Failed', // RFC 3903\n      413: 'Request Entity Too Large',\n      414: 'Request-URI Too Long',\n      415: 'Unsupported Media Type',\n      416: 'Unsupported URI Scheme',\n      417: 'Unknown Resource-Priority', // RFC 4412\n      420: 'Bad Extension',\n      421: 'Extension Required',\n      422: 'Session Interval Too Small', // RFC 4028\n      423: 'Interval Too Brief',\n      428: 'Use Identity Header', // RFC 4474\n      429: 'Provide Referrer Identity', // RFC 3892\n      430: 'Flow Failed', // RFC 5626\n      433: 'Anonymity Disallowed', // RFC 5079\n      436: 'Bad Identity-Info', // RFC 4474\n      437: 'Unsupported Certificate', // RFC 4744\n      438: 'Invalid Identity Header', // RFC 4744\n      439: 'First Hop Lacks Outbound Support', // RFC 5626\n      440: 'Max-Breadth Exceeded', // RFC 5393\n      469: 'Bad Info Package', // draft-ietf-sipcore-info-events\n      470: 'Consent Needed', // RFC 5360\n      478: 'Unresolvable Destination', // Custom code copied from Kamailio.\n      480: 'Temporarily Unavailable',\n      481: 'Call/Transaction Does Not Exist',\n      482: 'Loop Detected',\n      483: 'Too Many Hops',\n      484: 'Address Incomplete',\n      485: 'Ambiguous',\n      486: 'Busy Here',\n      487: 'Request Terminated',\n      488: 'Not Acceptable Here',\n      489: 'Bad Event', // RFC 3265\n      491: 'Request Pending',\n      493: 'Undecipherable',\n      494: 'Security Agreement Required', // RFC 3329\n      500: 'Internal Server Error',\n      501: 'Not Implemented',\n      502: 'Bad Gateway',\n      503: 'Service Unavailable',\n      504: 'Server Time-out',\n      505: 'Version Not Supported',\n      513: 'Message Too Large',\n      580: 'Precondition Failure', // RFC 3312\n      600: 'Busy Everywhere',\n      603: 'Decline',\n      604: 'Does Not Exist Anywhere',\n      606: 'Not Acceptable'\n    },\n\n    /* SIP Option Tags\n     * DOC: http://www.iana.org/assignments/sip-parameters/sip-parameters.xhtml#sip-parameters-4\n     */\n    OPTION_TAGS: {\n      '100rel': true, // RFC 3262\n      199: true, // RFC 6228\n      answermode: true, // RFC 5373\n      'early-session': true, // RFC 3959\n      eventlist: true, // RFC 4662\n      explicitsub: true, // RFC-ietf-sipcore-refer-explicit-subscription-03\n      'from-change': true, // RFC 4916\n      'geolocation-http': true, // RFC 6442\n      'geolocation-sip': true, // RFC 6442\n      gin: true, // RFC 6140\n      gruu: true, // RFC 5627\n      histinfo: true, // RFC 7044\n      ice: true, // RFC 5768\n      join: true, // RFC 3911\n      'multiple-refer': true, // RFC 5368\n      norefersub: true, // RFC 4488\n      nosub: true, // RFC-ietf-sipcore-refer-explicit-subscription-03\n      outbound: true, // RFC 5626\n      path: true, // RFC 3327\n      policy: true, // RFC 6794\n      precondition: true, // RFC 3312\n      pref: true, // RFC 3840\n      privacy: true, // RFC 3323\n      'recipient-list-invite': true, // RFC 5366\n      'recipient-list-message': true, // RFC 5365\n      'recipient-list-subscribe': true, // RFC 5367\n      replaces: true, // RFC 3891\n      'resource-priority': true, // RFC 4412\n      'sdp-anat': true, // RFC 4092\n      'sec-agree': true, // RFC 3329\n      tdialog: true, // RFC 4538\n      timer: true, // RFC 4028\n      uui: true // RFC 7433\n    },\n\n    dtmfType: {\n      INFO: 'info',\n      RTP: 'rtp'\n    }\n  };\n};\n\n//# sourceURL=webpack://SIP/./src/Constants.js?");

/***/ }),

/***/ "./src/Dialog/RequestSender.js":
/*!*************************************!*\
  !*** ./src/Dialog/RequestSender.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * @fileoverview In-Dialog Request Sender\n */\n\n/**\n * @augments SIP.Dialog\n * @class Class creating an In-dialog request sender.\n * @param {SIP.Dialog} dialog\n * @param {Object} applicant\n * @param {SIP.OutgoingRequest} request\n */\n/**\n * @fileoverview in-Dialog Request Sender\n */\n\nmodule.exports = function (SIP) {\n  var RequestSender;\n\n  RequestSender = function RequestSender(dialog, applicant, request) {\n\n    this.dialog = dialog;\n    this.applicant = applicant;\n    this.request = request;\n\n    // RFC3261 14.1 Modifying an Existing Session. UAC Behavior.\n    this.reattempt = false;\n    this.reattemptTimer = null;\n  };\n\n  RequestSender.prototype = {\n    send: function send() {\n      var self = this,\n          request_sender = new SIP.RequestSender(this, this.dialog.owner.ua);\n\n      request_sender.send();\n\n      // RFC3261 14.2 Modifying an Existing Session -UAC BEHAVIOR-\n      if (this.request.method === SIP.C.INVITE && request_sender.clientTransaction.state !== SIP.Transactions.C.STATUS_TERMINATED) {\n        this.dialog.uac_pending_reply = true;\n        request_sender.clientTransaction.on('stateChanged', function stateChanged() {\n          if (this.state === SIP.Transactions.C.STATUS_ACCEPTED || this.state === SIP.Transactions.C.STATUS_COMPLETED || this.state === SIP.Transactions.C.STATUS_TERMINATED) {\n\n            this.removeListener('stateChanged', stateChanged);\n            self.dialog.uac_pending_reply = false;\n          }\n        });\n      }\n    },\n\n    onRequestTimeout: function onRequestTimeout() {\n      this.applicant.onRequestTimeout();\n    },\n\n    onTransportError: function onTransportError() {\n      this.applicant.onTransportError();\n    },\n\n    receiveResponse: function receiveResponse(response) {\n      var self = this;\n\n      // RFC3261 12.2.1.2 408 or 481 is received for a request within a dialog.\n      if (response.status_code === 408 || response.status_code === 481) {\n        this.applicant.onDialogError(response);\n      } else if (response.method === SIP.C.INVITE && response.status_code === 491) {\n        if (this.reattempt) {\n          this.applicant.receiveResponse(response);\n        } else {\n          this.request.cseq.value = this.dialog.local_seqnum += 1;\n          this.reattemptTimer = SIP.Timers.setTimeout(function () {\n            if (self.applicant.owner.status !== SIP.Session.C.STATUS_TERMINATED) {\n              self.reattempt = true;\n              self.request_sender.send();\n            }\n          }, this.getReattemptTimeout());\n        }\n      } else {\n        this.applicant.receiveResponse(response);\n      }\n    }\n  };\n\n  return RequestSender;\n};\n\n//# sourceURL=webpack://SIP/./src/Dialog/RequestSender.js?");

/***/ }),

/***/ "./src/Dialogs.js":
/*!************************!*\
  !*** ./src/Dialogs.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP Dialog\n */\n\n/**\n * @augments SIP\n * @class Class creating a SIP dialog.\n * @param {SIP.RTCSession} owner\n * @param {SIP.IncomingRequest|SIP.IncomingResponse} message\n * @param {Enum} type UAC / UAS\n * @param {Enum} state SIP.Dialog.C.STATUS_EARLY / SIP.Dialog.C.STATUS_CONFIRMED\n */\n\nmodule.exports = function (SIP) {\n\n  var RequestSender = __webpack_require__(/*! ./Dialog/RequestSender */ \"./src/Dialog/RequestSender.js\")(SIP);\n\n  var Dialog,\n      C = {\n    // Dialog states\n    STATUS_EARLY: 1,\n    STATUS_CONFIRMED: 2\n  };\n\n  // RFC 3261 12.1\n  Dialog = function Dialog(owner, message, type, state) {\n    var contact;\n\n    this.uac_pending_reply = false;\n    this.uas_pending_reply = false;\n\n    if (!message.hasHeader('contact')) {\n      return {\n        error: 'unable to create a Dialog without Contact header field'\n      };\n    }\n\n    if (message instanceof SIP.IncomingResponse) {\n      state = message.status_code < 200 ? C.STATUS_EARLY : C.STATUS_CONFIRMED;\n    } else {\n      // Create confirmed dialog if state is not defined\n      state = state || C.STATUS_CONFIRMED;\n    }\n\n    contact = message.parseHeader('contact');\n\n    // RFC 3261 12.1.1\n    if (type === 'UAS') {\n      this.id = {\n        call_id: message.call_id,\n        local_tag: message.to_tag,\n        remote_tag: message.from_tag,\n        toString: function toString() {\n          return this.call_id + this.local_tag + this.remote_tag;\n        }\n      };\n      this.state = state;\n      this.remote_seqnum = message.cseq;\n      this.local_uri = message.parseHeader('to').uri;\n      this.remote_uri = message.parseHeader('from').uri;\n      this.remote_target = contact.uri;\n      this.route_set = message.getHeaders('record-route');\n      this.invite_seqnum = message.cseq;\n      this.local_seqnum = message.cseq;\n    }\n    // RFC 3261 12.1.2\n    else if (type === 'UAC') {\n        this.id = {\n          call_id: message.call_id,\n          local_tag: message.from_tag,\n          remote_tag: message.to_tag,\n          toString: function toString() {\n            return this.call_id + this.local_tag + this.remote_tag;\n          }\n        };\n        this.state = state;\n        this.invite_seqnum = message.cseq;\n        this.local_seqnum = message.cseq;\n        this.local_uri = message.parseHeader('from').uri;\n        this.pracked = [];\n        this.remote_uri = message.parseHeader('to').uri;\n        this.remote_target = contact.uri;\n        this.route_set = message.getHeaders('record-route').reverse();\n      }\n\n    this.logger = owner.ua.getLogger('sip.dialog', this.id.toString());\n    this.owner = owner;\n    owner.ua.dialogs[this.id.toString()] = this;\n    this.logger.log('new ' + type + ' dialog created with status ' + (this.state === C.STATUS_EARLY ? 'EARLY' : 'CONFIRMED'));\n    owner.emit('dialog', this);\n  };\n\n  Dialog.prototype = {\n    /**\n     * @param {SIP.IncomingMessage} message\n     * @param {Enum} UAC/UAS\n     */\n    update: function update(message, type) {\n      this.state = C.STATUS_CONFIRMED;\n\n      this.logger.log('dialog ' + this.id.toString() + '  changed to CONFIRMED state');\n\n      if (type === 'UAC') {\n        // RFC 3261 13.2.2.4\n        this.route_set = message.getHeaders('record-route').reverse();\n      }\n    },\n\n    terminate: function terminate() {\n      this.logger.log('dialog ' + this.id.toString() + ' deleted');\n      if (this.sessionDescriptionHandler && this.state !== C.STATUS_CONFIRMED) {\n        // TODO: This should call .close() on the handler when implemented\n        this.sessionDescriptionHandler.close();\n      }\n      delete this.owner.ua.dialogs[this.id.toString()];\n    },\n\n    /**\n    * @param {String} method request method\n    * @param {Object} extraHeaders extra headers\n    * @returns {SIP.OutgoingRequest}\n    */\n\n    // RFC 3261 12.2.1.1\n    createRequest: function createRequest(method, extraHeaders, body) {\n      var cseq, request;\n      extraHeaders = (extraHeaders || []).slice();\n\n      if (!this.local_seqnum) {\n        this.local_seqnum = Math.floor(Math.random() * 10000);\n      }\n\n      cseq = method === SIP.C.CANCEL || method === SIP.C.ACK ? this.invite_seqnum : this.local_seqnum += 1;\n\n      request = new SIP.OutgoingRequest(method, this.remote_target, this.owner.ua, {\n        'cseq': cseq,\n        'call_id': this.id.call_id,\n        'from_uri': this.local_uri,\n        'from_tag': this.id.local_tag,\n        'to_uri': this.remote_uri,\n        'to_tag': this.id.remote_tag,\n        'route_set': this.route_set\n      }, extraHeaders, body);\n\n      request.dialog = this;\n\n      return request;\n    },\n\n    /**\n    * @param {SIP.IncomingRequest} request\n    * @returns {Boolean}\n    */\n\n    // RFC 3261 12.2.2\n    checkInDialogRequest: function checkInDialogRequest(request) {\n      var self = this;\n\n      if (!this.remote_seqnum) {\n        this.remote_seqnum = request.cseq;\n      } else if (request.cseq < this.remote_seqnum) {\n        //Do not try to reply to an ACK request.\n        if (request.method !== SIP.C.ACK) {\n          request.reply(500);\n        }\n        if (request.cseq === this.invite_seqnum) {\n          return true;\n        }\n        return false;\n      }\n\n      switch (request.method) {\n        // RFC3261 14.2 Modifying an Existing Session -UAS BEHAVIOR-\n        case SIP.C.INVITE:\n          if (this.uac_pending_reply === true) {\n            request.reply(491);\n          } else if (this.uas_pending_reply === true && request.cseq > this.remote_seqnum) {\n            var retryAfter = (Math.random() * 10 | 0) + 1;\n            request.reply(500, null, ['Retry-After:' + retryAfter]);\n            this.remote_seqnum = request.cseq;\n            return false;\n          } else {\n            this.uas_pending_reply = true;\n            request.server_transaction.on('stateChanged', function stateChanged() {\n              if (this.state === SIP.Transactions.C.STATUS_ACCEPTED || this.state === SIP.Transactions.C.STATUS_COMPLETED || this.state === SIP.Transactions.C.STATUS_TERMINATED) {\n\n                this.removeListener('stateChanged', stateChanged);\n                self.uas_pending_reply = false;\n              }\n            });\n          }\n\n          // RFC3261 12.2.2 Replace the dialog`s remote target URI if the request is accepted\n          if (request.hasHeader('contact')) {\n            request.server_transaction.on('stateChanged', function () {\n              if (this.state === SIP.Transactions.C.STATUS_ACCEPTED) {\n                self.remote_target = request.parseHeader('contact').uri;\n              }\n            });\n          }\n          break;\n        case SIP.C.NOTIFY:\n          // RFC6665 3.2 Replace the dialog`s remote target URI if the request is accepted\n          if (request.hasHeader('contact')) {\n            request.server_transaction.on('stateChanged', function () {\n              if (this.state === SIP.Transactions.C.STATUS_COMPLETED) {\n                self.remote_target = request.parseHeader('contact').uri;\n              }\n            });\n          }\n          break;\n      }\n\n      if (request.cseq > this.remote_seqnum) {\n        this.remote_seqnum = request.cseq;\n      }\n\n      return true;\n    },\n\n    sendRequest: function sendRequest(applicant, method, options) {\n      options = options || {};\n\n      var extraHeaders = (options.extraHeaders || []).slice();\n\n      var body = null;\n      if (options.body) {\n        if (options.body.body) {\n          body = options.body;\n        } else {\n          body = {};\n          body.body = options.body;\n          if (options.contentType) {\n            body.contentType = options.contentType;\n          }\n        }\n      }\n\n      var request = this.createRequest(method, extraHeaders, body),\n          request_sender = new RequestSender(this, applicant, request);\n\n      request_sender.send();\n\n      return request;\n    },\n\n    /**\n    * @param {SIP.IncomingRequest} request\n    */\n    receiveRequest: function receiveRequest(request) {\n      //Check in-dialog request\n      if (!this.checkInDialogRequest(request)) {\n        return;\n      }\n\n      this.owner.receiveRequest(request);\n    }\n  };\n\n  Dialog.C = C;\n  SIP.Dialog = Dialog;\n};\n\n//# sourceURL=webpack://SIP/./src/Dialogs.js?");

/***/ }),

/***/ "./src/DigestAuthentication.js":
/*!*************************************!*\
  !*** ./src/DigestAuthentication.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar md5 = __webpack_require__(/*! crypto-js/md5 */ \"./node_modules/crypto-js/md5.js\");\n\n/**\n * @fileoverview SIP Digest Authentication\n */\n\n/**\n * SIP Digest Authentication.\n * @augments SIP.\n * @function Digest Authentication\n * @param {SIP.UA} ua\n */\nmodule.exports = function (Utils) {\n  var DigestAuthentication;\n\n  DigestAuthentication = function DigestAuthentication(ua) {\n    this.logger = ua.getLogger('sipjs.digestauthentication');\n    this.username = ua.configuration.authorizationUser;\n    this.password = ua.configuration.password;\n    this.cnonce = null;\n    this.nc = 0;\n    this.ncHex = '00000000';\n    this.response = null;\n  };\n\n  /**\n  * Performs Digest authentication given a SIP request and the challenge\n  * received in a response to that request.\n  * Returns true if credentials were successfully generated, false otherwise.\n  *\n  * @param {SIP.OutgoingRequest} request\n  * @param {Object} challenge\n  */\n  DigestAuthentication.prototype.authenticate = function (request, challenge) {\n    // Inspect and validate the challenge.\n\n    this.algorithm = challenge.algorithm;\n    this.realm = challenge.realm;\n    this.nonce = challenge.nonce;\n    this.opaque = challenge.opaque;\n    this.stale = challenge.stale;\n\n    if (this.algorithm) {\n      if (this.algorithm !== 'MD5') {\n        this.logger.warn('challenge with Digest algorithm different than \"MD5\", authentication aborted');\n        return false;\n      }\n    } else {\n      this.algorithm = 'MD5';\n    }\n\n    if (!this.realm) {\n      this.logger.warn('challenge without Digest realm, authentication aborted');\n      return false;\n    }\n\n    if (!this.nonce) {\n      this.logger.warn('challenge without Digest nonce, authentication aborted');\n      return false;\n    }\n\n    // 'qop' can contain a list of values (Array). Let's choose just one.\n    if (challenge.qop) {\n      if (challenge.qop.indexOf('auth') > -1) {\n        this.qop = 'auth';\n      } else if (challenge.qop.indexOf('auth-int') > -1) {\n        this.qop = 'auth-int';\n      } else {\n        // Otherwise 'qop' is present but does not contain 'auth' or 'auth-int', so abort here.\n        this.logger.warn('challenge without Digest qop different than \"auth\" or \"auth-int\", authentication aborted');\n        return false;\n      }\n    } else {\n      this.qop = null;\n    }\n\n    // Fill other attributes.\n\n    this.method = request.method;\n    this.uri = request.ruri;\n    this.cnonce = Utils.createRandomToken(12);\n    this.nc += 1;\n    this.updateNcHex();\n\n    // nc-value = 8LHEX. Max value = 'FFFFFFFF'.\n    if (this.nc === 4294967296) {\n      this.nc = 1;\n      this.ncHex = '00000001';\n    }\n\n    // Calculate the Digest \"response\" value.\n    this.calculateResponse();\n\n    return true;\n  };\n\n  /**\n  * Generate Digest 'response' value.\n  * @private\n  */\n  DigestAuthentication.prototype.calculateResponse = function () {\n    var ha1, ha2;\n\n    // HA1 = MD5(A1) = MD5(username:realm:password)\n    ha1 = md5(this.username + \":\" + this.realm + \":\" + this.password);\n\n    if (this.qop === 'auth') {\n      // HA2 = MD5(A2) = MD5(method:digestURI)\n      ha2 = md5(this.method + \":\" + this.uri);\n      // response = MD5(HA1:nonce:nonceCount:credentialsNonce:qop:HA2)\n      this.response = md5(ha1 + \":\" + this.nonce + \":\" + this.ncHex + \":\" + this.cnonce + \":auth:\" + ha2);\n    } else if (this.qop === 'auth-int') {\n      // HA2 = MD5(A2) = MD5(method:digestURI:MD5(entityBody))\n      ha2 = md5(this.method + \":\" + this.uri + \":\" + md5(this.body ? this.body : \"\"));\n      // response = MD5(HA1:nonce:nonceCount:credentialsNonce:qop:HA2)\n      this.response = md5(ha1 + \":\" + this.nonce + \":\" + this.ncHex + \":\" + this.cnonce + \":auth-int:\" + ha2);\n    } else if (this.qop === null) {\n      // HA2 = MD5(A2) = MD5(method:digestURI)\n      ha2 = md5(this.method + \":\" + this.uri);\n      // response = MD5(HA1:nonce:HA2)\n      this.response = md5(ha1 + \":\" + this.nonce + \":\" + ha2);\n    }\n  };\n\n  /**\n  * Return the Proxy-Authorization or WWW-Authorization header value.\n  */\n  DigestAuthentication.prototype.toString = function () {\n    var auth_params = [];\n\n    if (!this.response) {\n      throw new Error('response field does not exist, cannot generate Authorization header');\n    }\n\n    auth_params.push('algorithm=' + this.algorithm);\n    auth_params.push('username=\"' + this.username + '\"');\n    auth_params.push('realm=\"' + this.realm + '\"');\n    auth_params.push('nonce=\"' + this.nonce + '\"');\n    auth_params.push('uri=\"' + this.uri + '\"');\n    auth_params.push('response=\"' + this.response + '\"');\n    if (this.opaque) {\n      auth_params.push('opaque=\"' + this.opaque + '\"');\n    }\n    if (this.qop) {\n      auth_params.push('qop=' + this.qop);\n      auth_params.push('cnonce=\"' + this.cnonce + '\"');\n      auth_params.push('nc=' + this.ncHex);\n    }\n\n    return 'Digest ' + auth_params.join(', ');\n  };\n\n  /**\n  * Generate the 'nc' value as required by Digest in this.ncHex by reading this.nc.\n  * @private\n  */\n  DigestAuthentication.prototype.updateNcHex = function () {\n    var hex = Number(this.nc).toString(16);\n    this.ncHex = '00000000'.substr(0, 8 - hex.length) + hex;\n  };\n\n  return DigestAuthentication;\n};\n\n//# sourceURL=webpack://SIP/./src/DigestAuthentication.js?");

/***/ }),

/***/ "./src/EventEmitter.js":
/*!*****************************!*\
  !*** ./src/EventEmitter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar NodeEventEmitter = __webpack_require__(/*! events */ \"./node_modules/events/events.js\").EventEmitter;\n\nmodule.exports = function () {\n\n  // Don't use `new SIP.EventEmitter()` for inheriting.\n  // Use Object.create(SIP.EventEmitter.prototoype);\n  function EventEmitter() {\n    NodeEventEmitter.call(this);\n  }\n\n  EventEmitter.prototype = Object.create(NodeEventEmitter.prototype, {\n    constructor: {\n      value: EventEmitter,\n      enumerable: false,\n      writable: true,\n      configurable: true\n    }\n  });\n\n  return EventEmitter;\n};\n\n//# sourceURL=webpack://SIP/./src/EventEmitter.js?");

/***/ }),

/***/ "./src/Exceptions.js":
/*!***************************!*\
  !*** ./src/Exceptions.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview Exceptions\n */\n\n/**\n * SIP Exceptions.\n * @augments SIP\n */\n\nmodule.exports = {\n  ConfigurationError: function () {\n    var exception = function exception(parameter, value) {\n      this.code = 1;\n      this.name = 'CONFIGURATION_ERROR';\n      this.parameter = parameter;\n      this.value = value;\n      this.message = !this.value ? 'Missing parameter: ' + this.parameter : 'Invalid value ' + JSON.stringify(this.value) + ' for parameter \"' + this.parameter + '\"';\n    };\n    exception.prototype = new Error();\n    return exception;\n  }(),\n\n  InvalidStateError: function () {\n    var exception = function exception(status) {\n      this.code = 2;\n      this.name = 'INVALID_STATE_ERROR';\n      this.status = status;\n      this.message = 'Invalid status: ' + status;\n    };\n    exception.prototype = new Error();\n    return exception;\n  }(),\n\n  NotSupportedError: function () {\n    var exception = function exception(message) {\n      this.code = 3;\n      this.name = 'NOT_SUPPORTED_ERROR';\n      this.message = message;\n    };\n    exception.prototype = new Error();\n    return exception;\n  }(),\n\n  GetDescriptionError: function () {\n    var exception = function exception(message) {\n      this.code = 4;\n      this.name = 'GET_DESCRIPTION_ERROR';\n      this.message = message;\n    };\n    exception.prototype = new Error();\n    return exception;\n  }(),\n\n  RenegotiationError: function () {\n    var exception = function exception(message) {\n      this.code = 5;\n      this.name = 'RENEGOTIATION_ERROR';\n      this.message = message;\n    };\n    exception.prototype = new Error();\n    return exception;\n  }(),\n\n  MethodParameterError: function () {\n    var exception = function exception(method, parameter, value) {\n      this.code = 6;\n      this.name = 'METHOD_PARAMETER_ERROR';\n      this.method = method;\n      this.parameter = parameter;\n      this.value = value;\n      this.message = !this.value ? 'Missing parameter: ' + this.parameter : 'Invalid value ' + JSON.stringify(this.value) + ' for parameter \"' + this.parameter + '\"';\n    };\n    exception.prototype = new Error();\n    return exception;\n  }(),\n\n  TransportError: function () {\n    var exception = function exception(message) {\n      this.code = 7;\n      this.name = 'TRANSPORT_ERROR';\n      this.message = message;\n    };\n    exception.prototype = new Error();\n    return exception;\n  }()\n};\n\n//# sourceURL=webpack://SIP/./src/Exceptions.js?");

/***/ }),

/***/ "./src/Grammar.js":
/*!************************!*\
  !*** ./src/Grammar.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar Grammar = __webpack_require__(/*! ./Grammar/src/Grammar.pegjs */ \"./src/Grammar/src/Grammar.pegjs\");\n\nmodule.exports = function (SIP) {\n\n  return {\n    parse: function parseCustom(input, startRule) {\n      var options = { startRule: startRule, SIP: SIP };\n      try {\n        Grammar.parse(input, options);\n      } catch (e) {\n        options.data = -1;\n      }\n      return options.data;\n    }\n  };\n};\n\n//# sourceURL=webpack://SIP/./src/Grammar.js?");

/***/ }),

/***/ "./src/Grammar/src/Grammar.pegjs":
/*!***************************************!*\
  !*** ./src/Grammar/src/Grammar.pegjs ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Generated by PEG.js 0.10.0.\n *\n * http://pegjs.org/\n */\n\n\n\nfunction peg$subclass(child, parent) {\n  function ctor() { this.constructor = child; }\n  ctor.prototype = parent.prototype;\n  child.prototype = new ctor();\n}\n\nfunction peg$SyntaxError(message, expected, found, location) {\n  this.message  = message;\n  this.expected = expected;\n  this.found    = found;\n  this.location = location;\n  this.name     = \"SyntaxError\";\n\n  if (typeof Error.captureStackTrace === \"function\") {\n    Error.captureStackTrace(this, peg$SyntaxError);\n  }\n}\n\npeg$subclass(peg$SyntaxError, Error);\n\npeg$SyntaxError.buildMessage = function(expected, found) {\n  var DESCRIBE_EXPECTATION_FNS = {\n        literal: function(expectation) {\n          return \"\\\"\" + literalEscape(expectation.text) + \"\\\"\";\n        },\n\n        \"class\": function(expectation) {\n          var escapedParts = \"\",\n              i;\n\n          for (i = 0; i < expectation.parts.length; i++) {\n            escapedParts += expectation.parts[i] instanceof Array\n              ? classEscape(expectation.parts[i][0]) + \"-\" + classEscape(expectation.parts[i][1])\n              : classEscape(expectation.parts[i]);\n          }\n\n          return \"[\" + (expectation.inverted ? \"^\" : \"\") + escapedParts + \"]\";\n        },\n\n        any: function(expectation) {\n          return \"any character\";\n        },\n\n        end: function(expectation) {\n          return \"end of input\";\n        },\n\n        other: function(expectation) {\n          return expectation.description;\n        }\n      };\n\n  function hex(ch) {\n    return ch.charCodeAt(0).toString(16).toUpperCase();\n  }\n\n  function literalEscape(s) {\n    return s\n      .replace(/\\\\/g, '\\\\\\\\')\n      .replace(/\"/g,  '\\\\\"')\n      .replace(/\\0/g, '\\\\0')\n      .replace(/\\t/g, '\\\\t')\n      .replace(/\\n/g, '\\\\n')\n      .replace(/\\r/g, '\\\\r')\n      .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })\n      .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });\n  }\n\n  function classEscape(s) {\n    return s\n      .replace(/\\\\/g, '\\\\\\\\')\n      .replace(/\\]/g, '\\\\]')\n      .replace(/\\^/g, '\\\\^')\n      .replace(/-/g,  '\\\\-')\n      .replace(/\\0/g, '\\\\0')\n      .replace(/\\t/g, '\\\\t')\n      .replace(/\\n/g, '\\\\n')\n      .replace(/\\r/g, '\\\\r')\n      .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })\n      .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });\n  }\n\n  function describeExpectation(expectation) {\n    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);\n  }\n\n  function describeExpected(expected) {\n    var descriptions = new Array(expected.length),\n        i, j;\n\n    for (i = 0; i < expected.length; i++) {\n      descriptions[i] = describeExpectation(expected[i]);\n    }\n\n    descriptions.sort();\n\n    if (descriptions.length > 0) {\n      for (i = 1, j = 1; i < descriptions.length; i++) {\n        if (descriptions[i - 1] !== descriptions[i]) {\n          descriptions[j] = descriptions[i];\n          j++;\n        }\n      }\n      descriptions.length = j;\n    }\n\n    switch (descriptions.length) {\n      case 1:\n        return descriptions[0];\n\n      case 2:\n        return descriptions[0] + \" or \" + descriptions[1];\n\n      default:\n        return descriptions.slice(0, -1).join(\", \")\n          + \", or \"\n          + descriptions[descriptions.length - 1];\n    }\n  }\n\n  function describeFound(found) {\n    return found ? \"\\\"\" + literalEscape(found) + \"\\\"\" : \"end of input\";\n  }\n\n  return \"Expected \" + describeExpected(expected) + \" but \" + describeFound(found) + \" found.\";\n};\n\nfunction peg$parse(input, options) {\n  options = options !== void 0 ? options : {};\n\n  var peg$FAILED = {},\n\n      peg$startRuleIndices = { Contact: 119, Name_Addr_Header: 156, Record_Route: 176, Request_Response: 81, SIP_URI: 45, Subscription_State: 186, Supported: 191, Require: 182, Via: 194, absoluteURI: 84, Call_ID: 118, Content_Disposition: 130, Content_Length: 135, Content_Type: 136, CSeq: 146, displayName: 122, Event: 149, From: 151, host: 52, Max_Forwards: 154, Min_SE: 213, Proxy_Authenticate: 157, quoted_string: 40, Refer_To: 178, Replaces: 179, Session_Expires: 210, stun_URI: 217, To: 192, turn_URI: 223, uuid: 226, WWW_Authenticate: 209, challenge: 158, sipfrag: 230, Referred_By: 231 },\n      peg$startRuleIndex   = 119,\n\n      peg$consts = [\n        \"\\r\\n\",\n        peg$literalExpectation(\"\\r\\n\", false),\n        /^[0-9]/,\n        peg$classExpectation([[\"0\", \"9\"]], false, false),\n        /^[a-zA-Z]/,\n        peg$classExpectation([[\"a\", \"z\"], [\"A\", \"Z\"]], false, false),\n        /^[0-9a-fA-F]/,\n        peg$classExpectation([[\"0\", \"9\"], [\"a\", \"f\"], [\"A\", \"F\"]], false, false),\n        /^[\\0-\\xFF]/,\n        peg$classExpectation([[\"\\0\", \"\\xFF\"]], false, false),\n        /^[\"]/,\n        peg$classExpectation([\"\\\"\"], false, false),\n        \" \",\n        peg$literalExpectation(\" \", false),\n        \"\\t\",\n        peg$literalExpectation(\"\\t\", false),\n        /^[a-zA-Z0-9]/,\n        peg$classExpectation([[\"a\", \"z\"], [\"A\", \"Z\"], [\"0\", \"9\"]], false, false),\n        \";\",\n        peg$literalExpectation(\";\", false),\n        \"/\",\n        peg$literalExpectation(\"/\", false),\n        \"?\",\n        peg$literalExpectation(\"?\", false),\n        \":\",\n        peg$literalExpectation(\":\", false),\n        \"@\",\n        peg$literalExpectation(\"@\", false),\n        \"&\",\n        peg$literalExpectation(\"&\", false),\n        \"=\",\n        peg$literalExpectation(\"=\", false),\n        \"+\",\n        peg$literalExpectation(\"+\", false),\n        \"$\",\n        peg$literalExpectation(\"$\", false),\n        \",\",\n        peg$literalExpectation(\",\", false),\n        \"-\",\n        peg$literalExpectation(\"-\", false),\n        \"_\",\n        peg$literalExpectation(\"_\", false),\n        \".\",\n        peg$literalExpectation(\".\", false),\n        \"!\",\n        peg$literalExpectation(\"!\", false),\n        \"~\",\n        peg$literalExpectation(\"~\", false),\n        \"*\",\n        peg$literalExpectation(\"*\", false),\n        \"'\",\n        peg$literalExpectation(\"'\", false),\n        \"(\",\n        peg$literalExpectation(\"(\", false),\n        \")\",\n        peg$literalExpectation(\")\", false),\n        \"%\",\n        peg$literalExpectation(\"%\", false),\n        function() {return \" \"; },\n        function() {return ':'; },\n        /^[!-~]/,\n        peg$classExpectation([[\"!\", \"~\"]], false, false),\n        /^[\\x80-\\uFFFF]/,\n        peg$classExpectation([[\"\\x80\", \"\\uFFFF\"]], false, false),\n        /^[\\x80-\\xBF]/,\n        peg$classExpectation([[\"\\x80\", \"\\xBF\"]], false, false),\n        /^[a-f]/,\n        peg$classExpectation([[\"a\", \"f\"]], false, false),\n        \"`\",\n        peg$literalExpectation(\"`\", false),\n        \"<\",\n        peg$literalExpectation(\"<\", false),\n        \">\",\n        peg$literalExpectation(\">\", false),\n        \"\\\\\",\n        peg$literalExpectation(\"\\\\\", false),\n        \"[\",\n        peg$literalExpectation(\"[\", false),\n        \"]\",\n        peg$literalExpectation(\"]\", false),\n        \"{\",\n        peg$literalExpectation(\"{\", false),\n        \"}\",\n        peg$literalExpectation(\"}\", false),\n        function() {return \"*\"; },\n        function() {return \"/\"; },\n        function() {return \"=\"; },\n        function() {return \"(\"; },\n        function() {return \")\"; },\n        function() {return \">\"; },\n        function() {return \"<\"; },\n        function() {return \",\"; },\n        function() {return \";\"; },\n        function() {return \":\"; },\n        function() {return \"\\\"\"; },\n        /^[!-']/,\n        peg$classExpectation([[\"!\", \"'\"]], false, false),\n        /^[*-[]/,\n        peg$classExpectation([[\"*\", \"[\"]], false, false),\n        /^[\\]-~]/,\n        peg$classExpectation([[\"]\", \"~\"]], false, false),\n        function(contents) {\n                                return contents; },\n        /^[#-[]/,\n        peg$classExpectation([[\"#\", \"[\"]], false, false),\n        /^[\\0-\\t]/,\n        peg$classExpectation([[\"\\0\", \"\\t\"]], false, false),\n        /^[\\x0B-\\f]/,\n        peg$classExpectation([[\"\\x0B\", \"\\f\"]], false, false),\n        /^[\\x0E-\\x7F]/,\n        peg$classExpectation([[\"\\x0E\", \"\\x7F\"]], false, false),\n        function() {\n                                options.data.uri = new options.SIP.URI(options.data.scheme, options.data.user, options.data.host, options.data.port);\n                                delete options.data.scheme;\n                                delete options.data.user;\n                                delete options.data.host;\n                                delete options.data.host_type;\n                                delete options.data.port;\n                              },\n        function() {\n                                options.data.uri = new options.SIP.URI(options.data.scheme, options.data.user, options.data.host, options.data.port, options.data.uri_params, options.data.uri_headers);\n                                delete options.data.scheme;\n                                delete options.data.user;\n                                delete options.data.host;\n                                delete options.data.host_type;\n                                delete options.data.port;\n                                delete options.data.uri_params;\n\n                                if (options.startRule === 'SIP_URI') { options.data = options.data.uri;}\n                              },\n        \"sips\",\n        peg$literalExpectation(\"sips\", true),\n        \"sip\",\n        peg$literalExpectation(\"sip\", true),\n        function(uri_scheme) {\n                            options.data.scheme = uri_scheme; },\n        function() {\n                            options.data.user = decodeURIComponent(text().slice(0, -1));},\n        function() {\n                            options.data.password = text(); },\n        function() {\n                            options.data.host = text();\n                            return options.data.host; },\n        function() {\n                          options.data.host_type = 'domain';\n                          return text(); },\n        /^[a-zA-Z0-9_\\-]/,\n        peg$classExpectation([[\"a\", \"z\"], [\"A\", \"Z\"], [\"0\", \"9\"], \"_\", \"-\"], false, false),\n        /^[a-zA-Z0-9\\-]/,\n        peg$classExpectation([[\"a\", \"z\"], [\"A\", \"Z\"], [\"0\", \"9\"], \"-\"], false, false),\n        function() {\n                            options.data.host_type = 'IPv6';\n                            return text(); },\n        \"::\",\n        peg$literalExpectation(\"::\", false),\n        function() {\n                          options.data.host_type = 'IPv6';\n                          return text(); },\n        function() {\n                            options.data.host_type = 'IPv4';\n                            return text(); },\n        \"25\",\n        peg$literalExpectation(\"25\", false),\n        /^[0-5]/,\n        peg$classExpectation([[\"0\", \"5\"]], false, false),\n        \"2\",\n        peg$literalExpectation(\"2\", false),\n        /^[0-4]/,\n        peg$classExpectation([[\"0\", \"4\"]], false, false),\n        \"1\",\n        peg$literalExpectation(\"1\", false),\n        /^[1-9]/,\n        peg$classExpectation([[\"1\", \"9\"]], false, false),\n        function(port) {\n                            port = parseInt(port.join(''));\n                            options.data.port = port;\n                            return port; },\n        \"transport=\",\n        peg$literalExpectation(\"transport=\", true),\n        \"udp\",\n        peg$literalExpectation(\"udp\", true),\n        \"tcp\",\n        peg$literalExpectation(\"tcp\", true),\n        \"sctp\",\n        peg$literalExpectation(\"sctp\", true),\n        \"tls\",\n        peg$literalExpectation(\"tls\", true),\n        function(transport) {\n                              if(!options.data.uri_params) options.data.uri_params={};\n                              options.data.uri_params['transport'] = transport.toLowerCase(); },\n        \"user=\",\n        peg$literalExpectation(\"user=\", true),\n        \"phone\",\n        peg$literalExpectation(\"phone\", true),\n        \"ip\",\n        peg$literalExpectation(\"ip\", true),\n        function(user) {\n                              if(!options.data.uri_params) options.data.uri_params={};\n                              options.data.uri_params['user'] = user.toLowerCase(); },\n        \"method=\",\n        peg$literalExpectation(\"method=\", true),\n        function(method) {\n                              if(!options.data.uri_params) options.data.uri_params={};\n                              options.data.uri_params['method'] = method; },\n        \"ttl=\",\n        peg$literalExpectation(\"ttl=\", true),\n        function(ttl) {\n                              if(!options.data.params) options.data.params={};\n                              options.data.params['ttl'] = ttl; },\n        \"maddr=\",\n        peg$literalExpectation(\"maddr=\", true),\n        function(maddr) {\n                              if(!options.data.uri_params) options.data.uri_params={};\n                              options.data.uri_params['maddr'] = maddr; },\n        \"lr\",\n        peg$literalExpectation(\"lr\", true),\n        function() {\n                              if(!options.data.uri_params) options.data.uri_params={};\n                              options.data.uri_params['lr'] = undefined; },\n        function(param, value) {\n                              if(!options.data.uri_params) options.data.uri_params = {};\n                              if (value === null){\n                                value = undefined;\n                              }\n                              else {\n                                value = value[1];\n                              }\n                              options.data.uri_params[param.toLowerCase()] = value && value.toLowerCase();},\n        function(hname, hvalue) {\n                              hname = hname.join('').toLowerCase();\n                              hvalue = hvalue.join('');\n                              if(!options.data.uri_headers) options.data.uri_headers = {};\n                              if (!options.data.uri_headers[hname]) {\n                                options.data.uri_headers[hname] = [hvalue];\n                              } else {\n                                options.data.uri_headers[hname].push(hvalue);\n                              }},\n        function() {\n                              // lots of tests fail if this isn't guarded...\n                              if (options.startRule === 'Refer_To') {\n                                options.data.uri = new options.SIP.URI(options.data.scheme, options.data.user, options.data.host, options.data.port, options.data.uri_params, options.data.uri_headers);\n                                delete options.data.scheme;\n                                delete options.data.user;\n                                delete options.data.host;\n                                delete options.data.host_type;\n                                delete options.data.port;\n                                delete options.data.uri_params;\n                              }\n                            },\n        \"//\",\n        peg$literalExpectation(\"//\", false),\n        function() {\n                            options.data.scheme= text(); },\n        peg$literalExpectation(\"SIP\", true),\n        function() {\n                            options.data.sip_version = text(); },\n        \"INVITE\",\n        peg$literalExpectation(\"INVITE\", false),\n        \"ACK\",\n        peg$literalExpectation(\"ACK\", false),\n        \"VXACH\",\n        peg$literalExpectation(\"VXACH\", false),\n        \"OPTIONS\",\n        peg$literalExpectation(\"OPTIONS\", false),\n        \"BYE\",\n        peg$literalExpectation(\"BYE\", false),\n        \"CANCEL\",\n        peg$literalExpectation(\"CANCEL\", false),\n        \"REGISTER\",\n        peg$literalExpectation(\"REGISTER\", false),\n        \"SUBSCRIBE\",\n        peg$literalExpectation(\"SUBSCRIBE\", false),\n        \"NOTIFY\",\n        peg$literalExpectation(\"NOTIFY\", false),\n        \"REFER\",\n        peg$literalExpectation(\"REFER\", false),\n        \"PUBLISH\",\n        peg$literalExpectation(\"PUBLISH\", false),\n        function() {\n\n                            options.data.method = text();\n                            return options.data.method; },\n        function(status_code) {\n                          options.data.status_code = parseInt(status_code.join('')); },\n        function() {\n                          options.data.reason_phrase = text(); },\n        function() {\n                      options.data = text(); },\n        function() {\n                                var idx, length;\n                                length = options.data.multi_header.length;\n                                for (idx = 0; idx < length; idx++) {\n                                  if (options.data.multi_header[idx].parsed === null) {\n                                    options.data = null;\n                                    break;\n                                  }\n                                }\n                                if (options.data !== null) {\n                                  options.data = options.data.multi_header;\n                                } else {\n                                  options.data = -1;\n                                }},\n        function() {\n                                var header;\n                                if(!options.data.multi_header) options.data.multi_header = [];\n                                try {\n                                  header = new options.SIP.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);\n                                  delete options.data.uri;\n                                  delete options.data.displayName;\n                                  delete options.data.params;\n                                } catch(e) {\n                                  header = null;\n                                }\n                                options.data.multi_header.push( { 'position': peg$currPos,\n                                                          'offset': location().start.offset,\n                                                          'parsed': header\n                                                        });},\n        function(displayName) {\n                                displayName = text().trim();\n                                if (displayName[0] === '\\\"') {\n                                  displayName = displayName.substring(1, displayName.length-1);\n                                }\n                                options.data.displayName = displayName; },\n        \"q\",\n        peg$literalExpectation(\"q\", true),\n        function(q) {\n                                if(!options.data.params) options.data.params = {};\n                                options.data.params['q'] = q; },\n        \"expires\",\n        peg$literalExpectation(\"expires\", true),\n        function(expires) {\n                                if(!options.data.params) options.data.params = {};\n                                options.data.params['expires'] = expires; },\n        function(delta_seconds) {\n                                return parseInt(delta_seconds.join('')); },\n        \"0\",\n        peg$literalExpectation(\"0\", false),\n        function() {\n                                return parseFloat(text()); },\n        function(param, value) {\n                                if(!options.data.params) options.data.params = {};\n                                if (value === null){\n                                  value = undefined;\n                                }\n                                else {\n                                  value = value[1];\n                                }\n                                options.data.params[param.toLowerCase()] = value;},\n        \"render\",\n        peg$literalExpectation(\"render\", true),\n        \"session\",\n        peg$literalExpectation(\"session\", true),\n        \"icon\",\n        peg$literalExpectation(\"icon\", true),\n        \"alert\",\n        peg$literalExpectation(\"alert\", true),\n        function() {\n                                    if (options.startRule === 'Content_Disposition') {\n                                      options.data.type = text().toLowerCase();\n                                    }\n                                  },\n        \"handling\",\n        peg$literalExpectation(\"handling\", true),\n        \"optional\",\n        peg$literalExpectation(\"optional\", true),\n        \"required\",\n        peg$literalExpectation(\"required\", true),\n        function(length) {\n                                options.data = parseInt(length.join('')); },\n        function() {\n                                options.data = text(); },\n        \"text\",\n        peg$literalExpectation(\"text\", true),\n        \"image\",\n        peg$literalExpectation(\"image\", true),\n        \"audio\",\n        peg$literalExpectation(\"audio\", true),\n        \"video\",\n        peg$literalExpectation(\"video\", true),\n        \"application\",\n        peg$literalExpectation(\"application\", true),\n        \"message\",\n        peg$literalExpectation(\"message\", true),\n        \"multipart\",\n        peg$literalExpectation(\"multipart\", true),\n        \"x-\",\n        peg$literalExpectation(\"x-\", true),\n        function(cseq_value) {\n                          options.data.value=parseInt(cseq_value.join('')); },\n        function(expires) {options.data = expires; },\n        function(event_type) {\n                               options.data.event = event_type.toLowerCase(); },\n        function() {\n                        var tag = options.data.tag;\n                          options.data = new options.SIP.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);\n                          if (tag) {options.data.setParam('tag',tag)}\n                        },\n        \"tag\",\n        peg$literalExpectation(\"tag\", true),\n        function(tag) {options.data.tag = tag; },\n        function(forwards) {\n                          options.data = parseInt(forwards.join('')); },\n        function(min_expires) {options.data = min_expires; },\n        function() {\n                                options.data = new options.SIP.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);\n                              },\n        \"digest\",\n        peg$literalExpectation(\"Digest\", true),\n        \"realm\",\n        peg$literalExpectation(\"realm\", true),\n        function(realm) { options.data.realm = realm; },\n        \"domain\",\n        peg$literalExpectation(\"domain\", true),\n        \"nonce\",\n        peg$literalExpectation(\"nonce\", true),\n        function(nonce) { options.data.nonce=nonce; },\n        \"opaque\",\n        peg$literalExpectation(\"opaque\", true),\n        function(opaque) { options.data.opaque=opaque; },\n        \"stale\",\n        peg$literalExpectation(\"stale\", true),\n        \"true\",\n        peg$literalExpectation(\"true\", true),\n        function() { options.data.stale=true; },\n        \"false\",\n        peg$literalExpectation(\"false\", true),\n        function() { options.data.stale=false; },\n        \"algorithm\",\n        peg$literalExpectation(\"algorithm\", true),\n        \"md5\",\n        peg$literalExpectation(\"MD5\", true),\n        \"md5-sess\",\n        peg$literalExpectation(\"MD5-sess\", true),\n        function(algorithm) {\n                              options.data.algorithm=algorithm.toUpperCase(); },\n        \"qop\",\n        peg$literalExpectation(\"qop\", true),\n        \"auth-int\",\n        peg$literalExpectation(\"auth-int\", true),\n        \"auth\",\n        peg$literalExpectation(\"auth\", true),\n        function(qop_value) {\n                                options.data.qop || (options.data.qop=[]);\n                                options.data.qop.push(qop_value.toLowerCase()); },\n        function(rack_value) {\n                          options.data.value=parseInt(rack_value.join('')); },\n        function() {\n                          var idx, length;\n                          length = options.data.multi_header.length;\n                          for (idx = 0; idx < length; idx++) {\n                            if (options.data.multi_header[idx].parsed === null) {\n                              options.data = null;\n                              break;\n                            }\n                          }\n                          if (options.data !== null) {\n                            options.data = options.data.multi_header;\n                          } else {\n                            options.data = -1;\n                          }},\n        function() {\n                          var header;\n                          if(!options.data.multi_header) options.data.multi_header = [];\n                          try {\n                            header = new options.SIP.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);\n                            delete options.data.uri;\n                            delete options.data.displayName;\n                            delete options.data.params;\n                          } catch(e) {\n                            header = null;\n                          }\n                          options.data.multi_header.push( { 'position': peg$currPos,\n                                                    'offset': location().start.offset,\n                                                    'parsed': header\n                                                  });},\n        function() {\n                      options.data = new options.SIP.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);\n                    },\n        function() {\n                              if (!(options.data.replaces_from_tag && options.data.replaces_to_tag)) {\n                                options.data = -1;\n                              }\n                            },\n        function() {\n                              options.data = {\n                                call_id: options.data\n                              };\n                            },\n        \"from-tag\",\n        peg$literalExpectation(\"from-tag\", true),\n        function(from_tag) {\n                              options.data.replaces_from_tag = from_tag;\n                            },\n        \"to-tag\",\n        peg$literalExpectation(\"to-tag\", true),\n        function(to_tag) {\n                              options.data.replaces_to_tag = to_tag;\n                            },\n        \"early-only\",\n        peg$literalExpectation(\"early-only\", true),\n        function() {\n                              options.data.early_only = true;\n                            },\n        function(head, r) {return r;},\n        function(head, tail) { return list(head, tail); },\n        function(value) {\n                        if (options.startRule === 'Require') {\n                          options.data = value || [];\n                        }\n                      },\n        function(rseq_value) {\n                          options.data.value=parseInt(rseq_value.join('')); },\n        \"active\",\n        peg$literalExpectation(\"active\", true),\n        \"pending\",\n        peg$literalExpectation(\"pending\", true),\n        \"terminated\",\n        peg$literalExpectation(\"terminated\", true),\n        function() {\n                                options.data.state = text(); },\n        \"reason\",\n        peg$literalExpectation(\"reason\", true),\n        function(reason) {\n                                if (typeof reason !== 'undefined') options.data.reason = reason; },\n        function(expires) {\n                                if (typeof expires !== 'undefined') options.data.expires = expires; },\n        \"retry_after\",\n        peg$literalExpectation(\"retry_after\", true),\n        function(retry_after) {\n                                if (typeof retry_after !== 'undefined') options.data.retry_after = retry_after; },\n        \"deactivated\",\n        peg$literalExpectation(\"deactivated\", true),\n        \"probation\",\n        peg$literalExpectation(\"probation\", true),\n        \"rejected\",\n        peg$literalExpectation(\"rejected\", true),\n        \"timeout\",\n        peg$literalExpectation(\"timeout\", true),\n        \"giveup\",\n        peg$literalExpectation(\"giveup\", true),\n        \"noresource\",\n        peg$literalExpectation(\"noresource\", true),\n        \"invariant\",\n        peg$literalExpectation(\"invariant\", true),\n        function(value) {\n                        if (options.startRule === 'Supported') {\n                          options.data = value || [];\n                        }\n                      },\n        function() {\n                      var tag = options.data.tag;\n                        options.data = new options.SIP.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);\n                        if (tag) {options.data.setParam('tag',tag)}\n                      },\n        \"ttl\",\n        peg$literalExpectation(\"ttl\", true),\n        function(via_ttl_value) {\n                              options.data.ttl = via_ttl_value; },\n        \"maddr\",\n        peg$literalExpectation(\"maddr\", true),\n        function(via_maddr) {\n                              options.data.maddr = via_maddr; },\n        \"received\",\n        peg$literalExpectation(\"received\", true),\n        function(via_received) {\n                              options.data.received = via_received; },\n        \"branch\",\n        peg$literalExpectation(\"branch\", true),\n        function(via_branch) {\n                              options.data.branch = via_branch; },\n        \"rport\",\n        peg$literalExpectation(\"rport\", true),\n        function() {\n                              if(typeof response_port !== 'undefined')\n                                options.data.rport = response_port.join(''); },\n        function(via_protocol) {\n                              options.data.protocol = via_protocol; },\n        peg$literalExpectation(\"UDP\", true),\n        peg$literalExpectation(\"TCP\", true),\n        peg$literalExpectation(\"TLS\", true),\n        peg$literalExpectation(\"SCTP\", true),\n        function(via_transport) {\n                              options.data.transport = via_transport; },\n        function() {\n                              options.data.host = text(); },\n        function(via_sent_by_port) {\n                              options.data.port = parseInt(via_sent_by_port.join('')); },\n        function(ttl) {\n                              return parseInt(ttl.join('')); },\n        function(deltaSeconds) {\n                              if (options.startRule === 'Session_Expires') {\n                                options.data.deltaSeconds = deltaSeconds;\n                              }\n                            },\n        \"refresher\",\n        peg$literalExpectation(\"refresher\", false),\n        \"uas\",\n        peg$literalExpectation(\"uas\", false),\n        \"uac\",\n        peg$literalExpectation(\"uac\", false),\n        function(endpoint) {\n                              if (options.startRule === 'Session_Expires') {\n                                options.data.refresher = endpoint;\n                              }\n                            },\n        function(deltaSeconds) {\n                              if (options.startRule === 'Min_SE') {\n                                options.data = deltaSeconds;\n                              }\n                            },\n        \"stuns\",\n        peg$literalExpectation(\"stuns\", true),\n        \"stun\",\n        peg$literalExpectation(\"stun\", true),\n        function(scheme) {\n                              options.data.scheme = scheme; },\n        function(host) {\n                              options.data.host = host; },\n        \"?transport=\",\n        peg$literalExpectation(\"?transport=\", false),\n        \"turns\",\n        peg$literalExpectation(\"turns\", true),\n        \"turn\",\n        peg$literalExpectation(\"turn\", true),\n        function() {\n                              options.data.transport = transport; },\n        function() {\n                          options.data = text(); },\n        \"Referred-By\",\n        peg$literalExpectation(\"Referred-By\", false),\n        \"b\",\n        peg$literalExpectation(\"b\", false),\n        \"cid\",\n        peg$literalExpectation(\"cid\", false)\n      ],\n\n      peg$bytecode = [\n        peg$decode(\"2 \\\"\\\"6 7!\"),\n        peg$decode(\"4\\\"\\\"\\\"5!7#\"),\n        peg$decode(\"4$\\\"\\\"5!7%\"),\n        peg$decode(\"4&\\\"\\\"5!7'\"),\n        peg$decode(\";'.# &;(\"),\n        peg$decode(\"4(\\\"\\\"5!7)\"),\n        peg$decode(\"4*\\\"\\\"5!7+\"),\n        peg$decode(\"2,\\\"\\\"6,7-\"),\n        peg$decode(\"2.\\\"\\\"6.7/\"),\n        peg$decode(\"40\\\"\\\"5!71\"),\n        peg$decode(\"22\\\"\\\"6273.\\x89 &24\\\"\\\"6475.} &26\\\"\\\"6677.q &28\\\"\\\"6879.e &2:\\\"\\\"6:7;.Y &2<\\\"\\\"6<7=.M &2>\\\"\\\"6>7?.A &2@\\\"\\\"6@7A.5 &2B\\\"\\\"6B7C.) &2D\\\"\\\"6D7E\"),\n        peg$decode(\";).# &;,\"),\n        peg$decode(\"2F\\\"\\\"6F7G.} &2H\\\"\\\"6H7I.q &2J\\\"\\\"6J7K.e &2L\\\"\\\"6L7M.Y &2N\\\"\\\"6N7O.M &2P\\\"\\\"6P7Q.A &2R\\\"\\\"6R7S.5 &2T\\\"\\\"6T7U.) &2V\\\"\\\"6V7W\"),\n        peg$decode(\"%%2X\\\"\\\"6X7Y/5#;#/,$;#/#$+#)(#'#(\\\"'#&'#/\\\"!&,)\"),\n        peg$decode(\"%%$;$0#*;$&/,#; /#$+\\\")(\\\"'#&'#.\\\" &\\\"/=#$;$/&#0#*;$&&&#/'$8\\\":Z\\\" )(\\\"'#&'#\"),\n        peg$decode(\";..\\\" &\\\"\"),\n        peg$decode(\"%$;'.# &;(0)*;'.# &;(&/?#28\\\"\\\"6879/0$;//'$8#:[# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%%$;2/&#0#*;2&&&#/g#$%$;.0#*;.&/,#;2/#$+\\\")(\\\"'#&'#0=*%$;.0#*;.&/,#;2/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#/\\\"!&,)\"),\n        peg$decode(\"4\\\\\\\"\\\"5!7].# &;3\"),\n        peg$decode(\"4^\\\"\\\"5!7_\"),\n        peg$decode(\"4`\\\"\\\"5!7a\"),\n        peg$decode(\";!.) &4b\\\"\\\"5!7c\"),\n        peg$decode(\"%$;).\\x95 &2F\\\"\\\"6F7G.\\x89 &2J\\\"\\\"6J7K.} &2L\\\"\\\"6L7M.q &2X\\\"\\\"6X7Y.e &2P\\\"\\\"6P7Q.Y &2H\\\"\\\"6H7I.M &2@\\\"\\\"6@7A.A &2d\\\"\\\"6d7e.5 &2R\\\"\\\"6R7S.) &2N\\\"\\\"6N7O/\\x9E#0\\x9B*;).\\x95 &2F\\\"\\\"6F7G.\\x89 &2J\\\"\\\"6J7K.} &2L\\\"\\\"6L7M.q &2X\\\"\\\"6X7Y.e &2P\\\"\\\"6P7Q.Y &2H\\\"\\\"6H7I.M &2@\\\"\\\"6@7A.A &2d\\\"\\\"6d7e.5 &2R\\\"\\\"6R7S.) &2N\\\"\\\"6N7O&&&#/\\\"!&,)\"),\n        peg$decode(\"%$;).\\x89 &2F\\\"\\\"6F7G.} &2L\\\"\\\"6L7M.q &2X\\\"\\\"6X7Y.e &2P\\\"\\\"6P7Q.Y &2H\\\"\\\"6H7I.M &2@\\\"\\\"6@7A.A &2d\\\"\\\"6d7e.5 &2R\\\"\\\"6R7S.) &2N\\\"\\\"6N7O/\\x92#0\\x8F*;).\\x89 &2F\\\"\\\"6F7G.} &2L\\\"\\\"6L7M.q &2X\\\"\\\"6X7Y.e &2P\\\"\\\"6P7Q.Y &2H\\\"\\\"6H7I.M &2@\\\"\\\"6@7A.A &2d\\\"\\\"6d7e.5 &2R\\\"\\\"6R7S.) &2N\\\"\\\"6N7O&&&#/\\\"!&,)\"),\n        peg$decode(\"2T\\\"\\\"6T7U.\\xE3 &2V\\\"\\\"6V7W.\\xD7 &2f\\\"\\\"6f7g.\\xCB &2h\\\"\\\"6h7i.\\xBF &2:\\\"\\\"6:7;.\\xB3 &2D\\\"\\\"6D7E.\\xA7 &22\\\"\\\"6273.\\x9B &28\\\"\\\"6879.\\x8F &2j\\\"\\\"6j7k.\\x83 &;&.} &24\\\"\\\"6475.q &2l\\\"\\\"6l7m.e &2n\\\"\\\"6n7o.Y &26\\\"\\\"6677.M &2>\\\"\\\"6>7?.A &2p\\\"\\\"6p7q.5 &2r\\\"\\\"6r7s.) &;'.# &;(\"),\n        peg$decode(\"%$;).\\u012B &2F\\\"\\\"6F7G.\\u011F &2J\\\"\\\"6J7K.\\u0113 &2L\\\"\\\"6L7M.\\u0107 &2X\\\"\\\"6X7Y.\\xFB &2P\\\"\\\"6P7Q.\\xEF &2H\\\"\\\"6H7I.\\xE3 &2@\\\"\\\"6@7A.\\xD7 &2d\\\"\\\"6d7e.\\xCB &2R\\\"\\\"6R7S.\\xBF &2N\\\"\\\"6N7O.\\xB3 &2T\\\"\\\"6T7U.\\xA7 &2V\\\"\\\"6V7W.\\x9B &2f\\\"\\\"6f7g.\\x8F &2h\\\"\\\"6h7i.\\x83 &28\\\"\\\"6879.w &2j\\\"\\\"6j7k.k &;&.e &24\\\"\\\"6475.Y &2l\\\"\\\"6l7m.M &2n\\\"\\\"6n7o.A &26\\\"\\\"6677.5 &2p\\\"\\\"6p7q.) &2r\\\"\\\"6r7s/\\u0134#0\\u0131*;).\\u012B &2F\\\"\\\"6F7G.\\u011F &2J\\\"\\\"6J7K.\\u0113 &2L\\\"\\\"6L7M.\\u0107 &2X\\\"\\\"6X7Y.\\xFB &2P\\\"\\\"6P7Q.\\xEF &2H\\\"\\\"6H7I.\\xE3 &2@\\\"\\\"6@7A.\\xD7 &2d\\\"\\\"6d7e.\\xCB &2R\\\"\\\"6R7S.\\xBF &2N\\\"\\\"6N7O.\\xB3 &2T\\\"\\\"6T7U.\\xA7 &2V\\\"\\\"6V7W.\\x9B &2f\\\"\\\"6f7g.\\x8F &2h\\\"\\\"6h7i.\\x83 &28\\\"\\\"6879.w &2j\\\"\\\"6j7k.k &;&.e &24\\\"\\\"6475.Y &2l\\\"\\\"6l7m.M &2n\\\"\\\"6n7o.A &26\\\"\\\"6677.5 &2p\\\"\\\"6p7q.) &2r\\\"\\\"6r7s&&&#/\\\"!&,)\"),\n        peg$decode(\"%;//?#2P\\\"\\\"6P7Q/0$;//'$8#:t# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;//?#24\\\"\\\"6475/0$;//'$8#:u# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;//?#2>\\\"\\\"6>7?/0$;//'$8#:v# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;//?#2T\\\"\\\"6T7U/0$;//'$8#:w# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;//?#2V\\\"\\\"6V7W/0$;//'$8#:x# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%2h\\\"\\\"6h7i/0#;//'$8\\\":y\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;//6#2f\\\"\\\"6f7g/'$8\\\":z\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;//?#2D\\\"\\\"6D7E/0$;//'$8#:{# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;//?#22\\\"\\\"6273/0$;//'$8#:|# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;//?#28\\\"\\\"6879/0$;//'$8#:}# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;//0#;&/'$8\\\":~\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;&/0#;//'$8\\\":~\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;=/T#$;G.) &;K.# &;F0/*;G.) &;K.# &;F&/,$;>/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"4\\x7F\\\"\\\"5!7\\x80.A &4\\x81\\\"\\\"5!7\\x82.5 &4\\x83\\\"\\\"5!7\\x84.) &;3.# &;.\"),\n        peg$decode(\"%%;//Q#;&/H$$;J.# &;K0)*;J.# &;K&/,$;&/#$+$)($'#(#'#(\\\"'#&'#/\\\"!&,)\"),\n        peg$decode(\"%;//]#;&/T$%$;J.# &;K0)*;J.# &;K&/\\\"!&,)/1$;&/($8$:\\x85$!!)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\";..G &2L\\\"\\\"6L7M.; &4\\x86\\\"\\\"5!7\\x87./ &4\\x83\\\"\\\"5!7\\x84.# &;3\"),\n        peg$decode(\"%2j\\\"\\\"6j7k/J#4\\x88\\\"\\\"5!7\\x89.5 &4\\x8A\\\"\\\"5!7\\x8B.) &4\\x8C\\\"\\\"5!7\\x8D/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;N/M#28\\\"\\\"6879/>$;O.\\\" &\\\"/0$;S/'$8$:\\x8E$ )($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;N/d#28\\\"\\\"6879/U$;O.\\\" &\\\"/G$;S/>$;_/5$;l.\\\" &\\\"/'$8&:\\x8F& )(&'#(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\x90\\\"\\\"5$7\\x91.) &3\\x92\\\"\\\"5#7\\x93/' 8!:\\x94!! )\"),\n        peg$decode(\"%;P/]#%28\\\"\\\"6879/,#;R/#$+\\\")(\\\"'#&'#.\\\" &\\\"/6$2:\\\"\\\"6:7;/'$8#:\\x95# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"$;+.) &;-.# &;Q/2#0/*;+.) &;-.# &;Q&&&#\"),\n        peg$decode(\"2<\\\"\\\"6<7=.q &2>\\\"\\\"6>7?.e &2@\\\"\\\"6@7A.Y &2B\\\"\\\"6B7C.M &2D\\\"\\\"6D7E.A &22\\\"\\\"6273.5 &26\\\"\\\"6677.) &24\\\"\\\"6475\"),\n        peg$decode(\"%$;+._ &;-.Y &2<\\\"\\\"6<7=.M &2>\\\"\\\"6>7?.A &2@\\\"\\\"6@7A.5 &2B\\\"\\\"6B7C.) &2D\\\"\\\"6D7E0e*;+._ &;-.Y &2<\\\"\\\"6<7=.M &2>\\\"\\\"6>7?.A &2@\\\"\\\"6@7A.5 &2B\\\"\\\"6B7C.) &2D\\\"\\\"6D7E&/& 8!:\\x96! )\"),\n        peg$decode(\"%;T/J#%28\\\"\\\"6879/,#;^/#$+\\\")(\\\"'#&'#.\\\" &\\\"/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;U.) &;\\\\.# &;X/& 8!:\\x97! )\"),\n        peg$decode(\"%$%;V/2#2J\\\"\\\"6J7K/#$+\\\")(\\\"'#&'#0<*%;V/2#2J\\\"\\\"6J7K/#$+\\\")(\\\"'#&'#&/D#;W/;$2J\\\"\\\"6J7K.\\\" &\\\"/'$8#:\\x98# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"$4\\x99\\\"\\\"5!7\\x9A/,#0)*4\\x99\\\"\\\"5!7\\x9A&&&#\"),\n        peg$decode(\"%4$\\\"\\\"5!7%/?#$4\\x9B\\\"\\\"5!7\\x9C0)*4\\x9B\\\"\\\"5!7\\x9C&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%2l\\\"\\\"6l7m/?#;Y/6$2n\\\"\\\"6n7o/'$8#:\\x9D# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%%;Z/\\xB3#28\\\"\\\"6879/\\xA4$;Z/\\x9B$28\\\"\\\"6879/\\x8C$;Z/\\x83$28\\\"\\\"6879/t$;Z/k$28\\\"\\\"6879/\\\\$;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$+-)(-'#(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u0790 &%2\\x9E\\\"\\\"6\\x9E7\\x9F/\\xA4#;Z/\\x9B$28\\\"\\\"6879/\\x8C$;Z/\\x83$28\\\"\\\"6879/t$;Z/k$28\\\"\\\"6879/\\\\$;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u06F9 &%2\\x9E\\\"\\\"6\\x9E7\\x9F/\\x8C#;Z/\\x83$28\\\"\\\"6879/t$;Z/k$28\\\"\\\"6879/\\\\$;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u067A &%2\\x9E\\\"\\\"6\\x9E7\\x9F/t#;Z/k$28\\\"\\\"6879/\\\\$;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u0613 &%2\\x9E\\\"\\\"6\\x9E7\\x9F/\\\\#;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$+&)(&'#(%'#($'#(#'#(\\\"'#&'#.\\u05C4 &%2\\x9E\\\"\\\"6\\x9E7\\x9F/D#;Z/;$28\\\"\\\"6879/,$;[/#$+$)($'#(#'#(\\\"'#&'#.\\u058D &%2\\x9E\\\"\\\"6\\x9E7\\x9F/,#;[/#$+\\\")(\\\"'#&'#.\\u056E &%2\\x9E\\\"\\\"6\\x9E7\\x9F/,#;Z/#$+\\\")(\\\"'#&'#.\\u054F &%;Z/\\x9B#2\\x9E\\\"\\\"6\\x9E7\\x9F/\\x8C$;Z/\\x83$28\\\"\\\"6879/t$;Z/k$28\\\"\\\"6879/\\\\$;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u04C7 &%;Z/\\xAA#%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\x83$2\\x9E\\\"\\\"6\\x9E7\\x9F/t$;Z/k$28\\\"\\\"6879/\\\\$;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u0430 &%;Z/\\xB9#%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\x92$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/k$2\\x9E\\\"\\\"6\\x9E7\\x9F/\\\\$;Z/S$28\\\"\\\"6879/D$;Z/;$28\\\"\\\"6879/,$;[/#$+))()'#(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u038A &%;Z/\\xC8#%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\xA1$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/z$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/S$2\\x9E\\\"\\\"6\\x9E7\\x9F/D$;Z/;$28\\\"\\\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u02D5 &%;Z/\\xD7#%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\xB0$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\x89$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/b$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/;$2\\x9E\\\"\\\"6\\x9E7\\x9F/,$;[/#$+')(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u0211 &%;Z/\\xFE#%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\xD7$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\xB0$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\x89$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/b$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/;$2\\x9E\\\"\\\"6\\x9E7\\x9F/,$;Z/#$+()(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#.\\u0126 &%;Z/\\u011C#%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\xF5$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\xCE$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\xA7$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/\\x80$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/Y$%28\\\"\\\"6879/,#;Z/#$+\\\")(\\\"'#&'#.\\\" &\\\"/2$2\\x9E\\\"\\\"6\\x9E7\\x9F/#$+()(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#/& 8!:\\xA0! )\"),\n        peg$decode(\"%;#/M#;#.\\\" &\\\"/?$;#.\\\" &\\\"/1$;#.\\\" &\\\"/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;Z/;#28\\\"\\\"6879/,$;Z/#$+#)(#'#(\\\"'#&'#.# &;\\\\\"),\n        peg$decode(\"%;]/o#2J\\\"\\\"6J7K/`$;]/W$2J\\\"\\\"6J7K/H$;]/?$2J\\\"\\\"6J7K/0$;]/'$8':\\xA1' )(''#(&'#(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%2\\xA2\\\"\\\"6\\xA27\\xA3/2#4\\xA4\\\"\\\"5!7\\xA5/#$+\\\")(\\\"'#&'#.\\x98 &%2\\xA6\\\"\\\"6\\xA67\\xA7/;#4\\xA8\\\"\\\"5!7\\xA9/,$;!/#$+#)(#'#(\\\"'#&'#.j &%2\\xAA\\\"\\\"6\\xAA7\\xAB/5#;!/,$;!/#$+#)(#'#(\\\"'#&'#.B &%4\\xAC\\\"\\\"5!7\\xAD/,#;!/#$+\\\")(\\\"'#&'#.# &;!\"),\n        peg$decode(\"%%;!.\\\" &\\\"/[#;!.\\\" &\\\"/M$;!.\\\" &\\\"/?$;!.\\\" &\\\"/1$;!.\\\" &\\\"/#$+%)(%'#($'#(#'#(\\\"'#&'#/' 8!:\\xAE!! )\"),\n        peg$decode(\"$%22\\\"\\\"6273/,#;`/#$+\\\")(\\\"'#&'#0<*%22\\\"\\\"6273/,#;`/#$+\\\")(\\\"'#&'#&\"),\n        peg$decode(\";a.A &;b.; &;c.5 &;d./ &;e.) &;f.# &;g\"),\n        peg$decode(\"%3\\xAF\\\"\\\"5*7\\xB0/a#3\\xB1\\\"\\\"5#7\\xB2.G &3\\xB3\\\"\\\"5#7\\xB4.; &3\\xB5\\\"\\\"5$7\\xB6./ &3\\xB7\\\"\\\"5#7\\xB8.# &;6/($8\\\":\\xB9\\\"! )(\\\"'#&'#\"),\n        peg$decode(\"%3\\xBA\\\"\\\"5%7\\xBB/I#3\\xBC\\\"\\\"5%7\\xBD./ &3\\xBE\\\"\\\"5\\\"7\\xBF.# &;6/($8\\\":\\xC0\\\"! )(\\\"'#&'#\"),\n        peg$decode(\"%3\\xC1\\\"\\\"5'7\\xC2/1#;\\x90/($8\\\":\\xC3\\\"! )(\\\"'#&'#\"),\n        peg$decode(\"%3\\xC4\\\"\\\"5$7\\xC5/1#;\\xF0/($8\\\":\\xC6\\\"! )(\\\"'#&'#\"),\n        peg$decode(\"%3\\xC7\\\"\\\"5&7\\xC8/1#;T/($8\\\":\\xC9\\\"! )(\\\"'#&'#\"),\n        peg$decode(\"%3\\xCA\\\"\\\"5\\\"7\\xCB/N#%2>\\\"\\\"6>7?/,#;6/#$+\\\")(\\\"'#&'#.\\\" &\\\"/'$8\\\":\\xCC\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;h/P#%2>\\\"\\\"6>7?/,#;i/#$+\\\")(\\\"'#&'#.\\\" &\\\"/)$8\\\":\\xCD\\\"\\\"! )(\\\"'#&'#\"),\n        peg$decode(\"%$;j/&#0#*;j&&&#/\\\"!&,)\"),\n        peg$decode(\"%$;j/&#0#*;j&&&#/\\\"!&,)\"),\n        peg$decode(\";k.) &;+.# &;-\"),\n        peg$decode(\"2l\\\"\\\"6l7m.e &2n\\\"\\\"6n7o.Y &24\\\"\\\"6475.M &28\\\"\\\"6879.A &2<\\\"\\\"6<7=.5 &2@\\\"\\\"6@7A.) &2B\\\"\\\"6B7C\"),\n        peg$decode(\"%26\\\"\\\"6677/n#;m/e$$%2<\\\"\\\"6<7=/,#;m/#$+\\\")(\\\"'#&'#0<*%2<\\\"\\\"6<7=/,#;m/#$+\\\")(\\\"'#&'#&/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;n/A#2>\\\"\\\"6>7?/2$;o/)$8#:\\xCE#\\\"\\\" )(#'#(\\\"'#&'#\"),\n        peg$decode(\"$;p.) &;+.# &;-/2#0/*;p.) &;+.# &;-&&&#\"),\n        peg$decode(\"$;p.) &;+.# &;-0/*;p.) &;+.# &;-&\"),\n        peg$decode(\"2l\\\"\\\"6l7m.e &2n\\\"\\\"6n7o.Y &24\\\"\\\"6475.M &26\\\"\\\"6677.A &28\\\"\\\"6879.5 &2@\\\"\\\"6@7A.) &2B\\\"\\\"6B7C\"),\n        peg$decode(\";\\x91.# &;r\"),\n        peg$decode(\"%;\\x90/G#;'/>$;s/5$;'/,$;\\x84/#$+%)(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\";M.# &;t\"),\n        peg$decode(\"%;\\x7F/E#28\\\"\\\"6879/6$;u.# &;x/'$8#:\\xCF# )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;v.# &;w/J#%26\\\"\\\"6677/,#;\\x83/#$+\\\")(\\\"'#&'#.\\\" &\\\"/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%2\\xD0\\\"\\\"6\\xD07\\xD1/:#;\\x80/1$;w.\\\" &\\\"/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%24\\\"\\\"6475/,#;{/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;z/3#$;y0#*;y&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\";*.) &;+.# &;-\"),\n        peg$decode(\";+.\\x8F &;-.\\x89 &22\\\"\\\"6273.} &26\\\"\\\"6677.q &28\\\"\\\"6879.e &2:\\\"\\\"6:7;.Y &2<\\\"\\\"6<7=.M &2>\\\"\\\"6>7?.A &2@\\\"\\\"6@7A.5 &2B\\\"\\\"6B7C.) &2D\\\"\\\"6D7E\"),\n        peg$decode(\"%;|/e#$%24\\\"\\\"6475/,#;|/#$+\\\")(\\\"'#&'#0<*%24\\\"\\\"6475/,#;|/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%$;~0#*;~&/e#$%22\\\"\\\"6273/,#;}/#$+\\\")(\\\"'#&'#0<*%22\\\"\\\"6273/,#;}/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"$;~0#*;~&\"),\n        peg$decode(\";+.w &;-.q &28\\\"\\\"6879.e &2:\\\"\\\"6:7;.Y &2<\\\"\\\"6<7=.M &2>\\\"\\\"6>7?.A &2@\\\"\\\"6@7A.5 &2B\\\"\\\"6B7C.) &2D\\\"\\\"6D7E\"),\n        peg$decode(\"%%;\\\"/\\x87#$;\\\".G &;!.A &2@\\\"\\\"6@7A.5 &2F\\\"\\\"6F7G.) &2J\\\"\\\"6J7K0M*;\\\".G &;!.A &2@\\\"\\\"6@7A.5 &2F\\\"\\\"6F7G.) &2J\\\"\\\"6J7K&/#$+\\\")(\\\"'#&'#/& 8!:\\xD2! )\"),\n        peg$decode(\";\\x81.# &;\\x82\"),\n        peg$decode(\"%%;O/2#2:\\\"\\\"6:7;/#$+\\\")(\\\"'#&'#.\\\" &\\\"/,#;S/#$+\\\")(\\\"'#&'#.\\\" &\\\"\"),\n        peg$decode(\"$;+.\\x83 &;-.} &2B\\\"\\\"6B7C.q &2D\\\"\\\"6D7E.e &22\\\"\\\"6273.Y &28\\\"\\\"6879.M &2:\\\"\\\"6:7;.A &2<\\\"\\\"6<7=.5 &2>\\\"\\\"6>7?.) &2@\\\"\\\"6@7A/\\x8C#0\\x89*;+.\\x83 &;-.} &2B\\\"\\\"6B7C.q &2D\\\"\\\"6D7E.e &22\\\"\\\"6273.Y &28\\\"\\\"6879.M &2:\\\"\\\"6:7;.A &2<\\\"\\\"6<7=.5 &2>\\\"\\\"6>7?.) &2@\\\"\\\"6@7A&&&#\"),\n        peg$decode(\"$;y0#*;y&\"),\n        peg$decode(\"%3\\x92\\\"\\\"5#7\\xD3/q#24\\\"\\\"6475/b$$;!/&#0#*;!&&&#/L$2J\\\"\\\"6J7K/=$$;!/&#0#*;!&&&#/'$8%:\\xD4% )(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"2\\xD5\\\"\\\"6\\xD57\\xD6\"),\n        peg$decode(\"2\\xD7\\\"\\\"6\\xD77\\xD8\"),\n        peg$decode(\"2\\xD9\\\"\\\"6\\xD97\\xDA\"),\n        peg$decode(\"2\\xDB\\\"\\\"6\\xDB7\\xDC\"),\n        peg$decode(\"2\\xDD\\\"\\\"6\\xDD7\\xDE\"),\n        peg$decode(\"2\\xDF\\\"\\\"6\\xDF7\\xE0\"),\n        peg$decode(\"2\\xE1\\\"\\\"6\\xE17\\xE2\"),\n        peg$decode(\"2\\xE3\\\"\\\"6\\xE37\\xE4\"),\n        peg$decode(\"2\\xE5\\\"\\\"6\\xE57\\xE6\"),\n        peg$decode(\"2\\xE7\\\"\\\"6\\xE77\\xE8\"),\n        peg$decode(\"2\\xE9\\\"\\\"6\\xE97\\xEA\"),\n        peg$decode(\"%;\\x85.Y &;\\x86.S &;\\x88.M &;\\x89.G &;\\x8A.A &;\\x8B.; &;\\x8C.5 &;\\x8F./ &;\\x8D.) &;\\x8E.# &;6/& 8!:\\xEB! )\"),\n        peg$decode(\"%;\\x84/G#;'/>$;\\x92/5$;'/,$;\\x94/#$+%)(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;\\x93/' 8!:\\xEC!! )\"),\n        peg$decode(\"%;!/5#;!/,$;!/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%$;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(0G*;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(&/& 8!:\\xED! )\"),\n        peg$decode(\"%;\\xB6/Y#$%;A/,#;\\xB6/#$+\\\")(\\\"'#&'#06*%;A/,#;\\xB6/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;9/N#%2:\\\"\\\"6:7;/,#;9/#$+\\\")(\\\"'#&'#.\\\" &\\\"/'$8\\\":\\xEE\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;:.c &%;\\x98/Y#$%;A/,#;\\x98/#$+\\\")(\\\"'#&'#06*%;A/,#;\\x98/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#/& 8!:\\xEF! )\"),\n        peg$decode(\"%;L.# &;\\x99/]#$%;B/,#;\\x9B/#$+\\\")(\\\"'#&'#06*%;B/,#;\\x9B/#$+\\\")(\\\"'#&'#&/'$8\\\":\\xF0\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;\\x9A.\\\" &\\\"/>#;@/5$;M/,$;?/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%%;6/Y#$%;./,#;6/#$+\\\")(\\\"'#&'#06*%;./,#;6/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#.# &;H/' 8!:\\xF1!! )\"),\n        peg$decode(\";\\x9C.) &;\\x9D.# &;\\xA0\"),\n        peg$decode(\"%3\\xF2\\\"\\\"5!7\\xF3/:#;</1$;\\x9F/($8#:\\xF4#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\xF5\\\"\\\"5'7\\xF6/:#;</1$;\\x9E/($8#:\\xF7#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%$;!/&#0#*;!&&&#/' 8!:\\xF8!! )\"),\n        peg$decode(\"%2\\xF9\\\"\\\"6\\xF97\\xFA/o#%2J\\\"\\\"6J7K/M#;!.\\\" &\\\"/?$;!.\\\" &\\\"/1$;!.\\\" &\\\"/#$+$)($'#(#'#(\\\"'#&'#.\\\" &\\\"/'$8\\\":\\xFB\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;6/J#%;</,#;\\xA1/#$+\\\")(\\\"'#&'#.\\\" &\\\"/)$8\\\":\\xFC\\\"\\\"! )(\\\"'#&'#\"),\n        peg$decode(\";6.) &;T.# &;H\"),\n        peg$decode(\"%;\\xA3/Y#$%;B/,#;\\xA4/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xA4/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%3\\xFD\\\"\\\"5&7\\xFE.G &3\\xFF\\\"\\\"5'7\\u0100.; &3\\u0101\\\"\\\"5$7\\u0102./ &3\\u0103\\\"\\\"5%7\\u0104.# &;6/& 8!:\\u0105! )\"),\n        peg$decode(\";\\xA5.# &;\\xA0\"),\n        peg$decode(\"%3\\u0106\\\"\\\"5(7\\u0107/M#;</D$3\\u0108\\\"\\\"5(7\\u0109./ &3\\u010A\\\"\\\"5(7\\u010B.# &;6/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;6/Y#$%;A/,#;6/#$+\\\")(\\\"'#&'#06*%;A/,#;6/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%$;!/&#0#*;!&&&#/' 8!:\\u010C!! )\"),\n        peg$decode(\"%;\\xA9/& 8!:\\u010D! )\"),\n        peg$decode(\"%;\\xAA/k#;;/b$;\\xAF/Y$$%;B/,#;\\xB0/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xB0/#$+\\\")(\\\"'#&'#&/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\";\\xAB.# &;\\xAC\"),\n        peg$decode(\"3\\u010E\\\"\\\"5$7\\u010F.S &3\\u0110\\\"\\\"5%7\\u0111.G &3\\u0112\\\"\\\"5%7\\u0113.; &3\\u0114\\\"\\\"5%7\\u0115./ &3\\u0116\\\"\\\"5+7\\u0117.# &;\\xAD\"),\n        peg$decode(\"3\\u0118\\\"\\\"5'7\\u0119./ &3\\u011A\\\"\\\"5)7\\u011B.# &;\\xAD\"),\n        peg$decode(\";6.# &;\\xAE\"),\n        peg$decode(\"%3\\u011C\\\"\\\"5\\\"7\\u011D/,#;6/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\";\\xAD.# &;6\"),\n        peg$decode(\"%;6/5#;</,$;\\xB1/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\";6.# &;H\"),\n        peg$decode(\"%;\\xB3/5#;./,$;\\x90/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%$;!/&#0#*;!&&&#/' 8!:\\u011E!! )\"),\n        peg$decode(\"%;\\x9E/' 8!:\\u011F!! )\"),\n        peg$decode(\"%;\\xB6/^#$%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#&/($8\\\":\\u0120\\\"!!)(\\\"'#&'#\"),\n        peg$decode(\"%%;7/e#$%2J\\\"\\\"6J7K/,#;7/#$+\\\")(\\\"'#&'#0<*%2J\\\"\\\"6J7K/,#;7/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#/\\\"!&,)\"),\n        peg$decode(\"%;L.# &;\\x99/]#$%;B/,#;\\xB8/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xB8/#$+\\\")(\\\"'#&'#&/'$8\\\":\\u0121\\\" )(\\\"'#&'#\"),\n        peg$decode(\";\\xB9.# &;\\xA0\"),\n        peg$decode(\"%3\\u0122\\\"\\\"5#7\\u0123/:#;</1$;6/($8#:\\u0124#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%$;!/&#0#*;!&&&#/' 8!:\\u0125!! )\"),\n        peg$decode(\"%;\\x9E/' 8!:\\u0126!! )\"),\n        peg$decode(\"%$;\\x9A0#*;\\x9A&/x#;@/o$;M/f$;?/]$$%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#&/'$8%:\\u0127% )(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\";\\xBE\"),\n        peg$decode(\"%3\\u0128\\\"\\\"5&7\\u0129/k#;./b$;\\xC1/Y$$%;A/,#;\\xC1/#$+\\\")(\\\"'#&'#06*%;A/,#;\\xC1/#$+\\\")(\\\"'#&'#&/#$+$)($'#(#'#(\\\"'#&'#.# &;\\xBF\"),\n        peg$decode(\"%;6/k#;./b$;\\xC0/Y$$%;A/,#;\\xC0/#$+\\\")(\\\"'#&'#06*%;A/,#;\\xC0/#$+\\\")(\\\"'#&'#&/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;6/;#;</2$;6.# &;H/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\";\\xC2.G &;\\xC4.A &;\\xC6.; &;\\xC8.5 &;\\xC9./ &;\\xCA.) &;\\xCB.# &;\\xC0\"),\n        peg$decode(\"%3\\u012A\\\"\\\"5%7\\u012B/5#;</,$;\\xC3/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;I/' 8!:\\u012C!! )\"),\n        peg$decode(\"%3\\u012D\\\"\\\"5&7\\u012E/\\x97#;</\\x8E$;D/\\x85$;\\xC5/|$$%$;'/&#0#*;'&&&#/,#;\\xC5/#$+\\\")(\\\"'#&'#0C*%$;'/&#0#*;'&&&#/,#;\\xC5/#$+\\\")(\\\"'#&'#&/,$;E/#$+&)(&'#(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\";t.# &;w\"),\n        peg$decode(\"%3\\u012F\\\"\\\"5%7\\u0130/5#;</,$;\\xC7/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;I/' 8!:\\u0131!! )\"),\n        peg$decode(\"%3\\u0132\\\"\\\"5&7\\u0133/:#;</1$;I/($8#:\\u0134#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u0135\\\"\\\"5%7\\u0136/]#;</T$%3\\u0137\\\"\\\"5$7\\u0138/& 8!:\\u0139! ).4 &%3\\u013A\\\"\\\"5%7\\u013B/& 8!:\\u013C! )/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u013D\\\"\\\"5)7\\u013E/R#;</I$3\\u013F\\\"\\\"5#7\\u0140./ &3\\u0141\\\"\\\"5(7\\u0142.# &;6/($8#:\\u0143#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u0144\\\"\\\"5#7\\u0145/\\x93#;</\\x8A$;D/\\x81$%;\\xCC/e#$%2D\\\"\\\"6D7E/,#;\\xCC/#$+\\\")(\\\"'#&'#0<*%2D\\\"\\\"6D7E/,#;\\xCC/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#/,$;E/#$+%)(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u0146\\\"\\\"5(7\\u0147./ &3\\u0148\\\"\\\"5$7\\u0149.# &;6/' 8!:\\u014A!! )\"),\n        peg$decode(\"%;6/Y#$%;A/,#;6/#$+\\\")(\\\"'#&'#06*%;A/,#;6/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;\\xCF/G#;./>$;\\xCF/5$;./,$;\\x90/#$+%)(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%$;!/&#0#*;!&&&#/' 8!:\\u014B!! )\"),\n        peg$decode(\"%;\\xD1/]#$%;A/,#;\\xD1/#$+\\\")(\\\"'#&'#06*%;A/,#;\\xD1/#$+\\\")(\\\"'#&'#&/'$8\\\":\\u014C\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;\\x99/]#$%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#&/'$8\\\":\\u014D\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;L.O &;\\x99.I &%;@.\\\" &\\\"/:#;t/1$;?.\\\" &\\\"/#$+#)(#'#(\\\"'#&'#/]#$%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#&/'$8\\\":\\u014E\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;\\xD4/]#$%;B/,#;\\xD5/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xD5/#$+\\\")(\\\"'#&'#&/'$8\\\":\\u014F\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;\\x96/& 8!:\\u0150! )\"),\n        peg$decode(\"%3\\u0151\\\"\\\"5(7\\u0152/:#;</1$;6/($8#:\\u0153#! )(#'#(\\\"'#&'#.g &%3\\u0154\\\"\\\"5&7\\u0155/:#;</1$;6/($8#:\\u0156#! )(#'#(\\\"'#&'#.: &%3\\u0157\\\"\\\"5*7\\u0158/& 8!:\\u0159! ).# &;\\xA0\"),\n        peg$decode(\"%%;6/k#$%;A/2#;6/)$8\\\":\\u015A\\\"\\\"$ )(\\\"'#&'#0<*%;A/2#;6/)$8\\\":\\u015A\\\"\\\"$ )(\\\"'#&'#&/)$8\\\":\\u015B\\\"\\\"! )(\\\"'#&'#.\\\" &\\\"/' 8!:\\u015C!! )\"),\n        peg$decode(\"%;\\xD8/Y#$%;A/,#;\\xD8/#$+\\\")(\\\"'#&'#06*%;A/,#;\\xD8/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;\\x99/Y#$%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%$;!/&#0#*;!&&&#/' 8!:\\u015D!! )\"),\n        peg$decode(\"%;\\xDB/Y#$%;B/,#;\\xDC/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xDC/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%3\\u015E\\\"\\\"5&7\\u015F.; &3\\u0160\\\"\\\"5'7\\u0161./ &3\\u0162\\\"\\\"5*7\\u0163.# &;6/& 8!:\\u0164! )\"),\n        peg$decode(\"%3\\u0165\\\"\\\"5&7\\u0166/:#;</1$;\\xDD/($8#:\\u0167#! )(#'#(\\\"'#&'#.} &%3\\xF5\\\"\\\"5'7\\xF6/:#;</1$;\\x9E/($8#:\\u0168#! )(#'#(\\\"'#&'#.P &%3\\u0169\\\"\\\"5+7\\u016A/:#;</1$;\\x9E/($8#:\\u016B#! )(#'#(\\\"'#&'#.# &;\\xA0\"),\n        peg$decode(\"3\\u016C\\\"\\\"5+7\\u016D.k &3\\u016E\\\"\\\"5)7\\u016F._ &3\\u0170\\\"\\\"5(7\\u0171.S &3\\u0172\\\"\\\"5'7\\u0173.G &3\\u0174\\\"\\\"5&7\\u0175.; &3\\u0176\\\"\\\"5*7\\u0177./ &3\\u0178\\\"\\\"5)7\\u0179.# &;6\"),\n        peg$decode(\";1.\\\" &\\\"\"),\n        peg$decode(\"%%;6/k#$%;A/2#;6/)$8\\\":\\u015A\\\"\\\"$ )(\\\"'#&'#0<*%;A/2#;6/)$8\\\":\\u015A\\\"\\\"$ )(\\\"'#&'#&/)$8\\\":\\u015B\\\"\\\"! )(\\\"'#&'#.\\\" &\\\"/' 8!:\\u017A!! )\"),\n        peg$decode(\"%;L.# &;\\x99/]#$%;B/,#;\\xE1/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xE1/#$+\\\")(\\\"'#&'#&/'$8\\\":\\u017B\\\" )(\\\"'#&'#\"),\n        peg$decode(\";\\xB9.# &;\\xA0\"),\n        peg$decode(\"%;\\xE3/Y#$%;A/,#;\\xE3/#$+\\\")(\\\"'#&'#06*%;A/,#;\\xE3/#$+\\\")(\\\"'#&'#&/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;\\xEA/k#;./b$;\\xED/Y$$%;B/,#;\\xE4/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xE4/#$+\\\")(\\\"'#&'#&/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\";\\xE5.; &;\\xE6.5 &;\\xE7./ &;\\xE8.) &;\\xE9.# &;\\xA0\"),\n        peg$decode(\"%3\\u017C\\\"\\\"5#7\\u017D/:#;</1$;\\xF0/($8#:\\u017E#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u017F\\\"\\\"5%7\\u0180/:#;</1$;T/($8#:\\u0181#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u0182\\\"\\\"5(7\\u0183/@#;</7$;\\\\.# &;Y/($8#:\\u0184#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u0185\\\"\\\"5&7\\u0186/:#;</1$;6/($8#:\\u0187#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u0188\\\"\\\"5%7\\u0189/O#%;</3#$;!0#*;!&/#$+\\\")(\\\"'#&'#.\\\" &\\\"/'$8\\\":\\u018A\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;\\xEB/G#;;/>$;6/5$;;/,$;\\xEC/#$+%)(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\x92\\\"\\\"5#7\\xD3.# &;6/' 8!:\\u018B!! )\"),\n        peg$decode(\"%3\\xB1\\\"\\\"5#7\\u018C.G &3\\xB3\\\"\\\"5#7\\u018D.; &3\\xB7\\\"\\\"5#7\\u018E./ &3\\xB5\\\"\\\"5$7\\u018F.# &;6/' 8!:\\u0190!! )\"),\n        peg$decode(\"%;\\xEE/D#%;C/,#;\\xEF/#$+\\\")(\\\"'#&'#.\\\" &\\\"/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;U.) &;\\\\.# &;X/& 8!:\\u0191! )\"),\n        peg$decode(\"%%;!.\\\" &\\\"/[#;!.\\\" &\\\"/M$;!.\\\" &\\\"/?$;!.\\\" &\\\"/1$;!.\\\" &\\\"/#$+%)(%'#($'#(#'#(\\\"'#&'#/' 8!:\\u0192!! )\"),\n        peg$decode(\"%%;!/?#;!.\\\" &\\\"/1$;!.\\\" &\\\"/#$+#)(#'#(\\\"'#&'#/' 8!:\\u0193!! )\"),\n        peg$decode(\";\\xBE\"),\n        peg$decode(\"%;\\x9E/^#$%;B/,#;\\xF3/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xF3/#$+\\\")(\\\"'#&'#&/($8\\\":\\u0194\\\"!!)(\\\"'#&'#\"),\n        peg$decode(\";\\xF4.# &;\\xA0\"),\n        peg$decode(\"%2\\u0195\\\"\\\"6\\u01957\\u0196/L#;</C$2\\u0197\\\"\\\"6\\u01977\\u0198.) &2\\u0199\\\"\\\"6\\u01997\\u019A/($8#:\\u019B#! )(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;\\x9E/^#$%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#06*%;B/,#;\\xA0/#$+\\\")(\\\"'#&'#&/($8\\\":\\u019C\\\"!!)(\\\"'#&'#\"),\n        peg$decode(\"%;6/5#;0/,$;\\xF7/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"$;2.) &;4.# &;.0/*;2.) &;4.# &;.&\"),\n        peg$decode(\"$;%0#*;%&\"),\n        peg$decode(\"%;\\xFA/;#28\\\"\\\"6879/,$;\\xFB/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u019D\\\"\\\"5%7\\u019E.) &3\\u019F\\\"\\\"5$7\\u01A0/' 8!:\\u01A1!! )\"),\n        peg$decode(\"%;\\xFC/J#%28\\\"\\\"6879/,#;^/#$+\\\")(\\\"'#&'#.\\\" &\\\"/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;\\\\.) &;X.# &;\\x82/' 8!:\\u01A2!! )\"),\n        peg$decode(\";\\\".S &;!.M &2F\\\"\\\"6F7G.A &2J\\\"\\\"6J7K.5 &2H\\\"\\\"6H7I.) &2N\\\"\\\"6N7O\"),\n        peg$decode(\"2L\\\"\\\"6L7M.\\x95 &2B\\\"\\\"6B7C.\\x89 &2<\\\"\\\"6<7=.} &2R\\\"\\\"6R7S.q &2T\\\"\\\"6T7U.e &2V\\\"\\\"6V7W.Y &2P\\\"\\\"6P7Q.M &2@\\\"\\\"6@7A.A &2D\\\"\\\"6D7E.5 &22\\\"\\\"6273.) &2>\\\"\\\"6>7?\"),\n        peg$decode(\"%;\\u0100/b#28\\\"\\\"6879/S$;\\xFB/J$%2\\u01A3\\\"\\\"6\\u01A37\\u01A4/,#;\\xEC/#$+\\\")(\\\"'#&'#.\\\" &\\\"/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%3\\u01A5\\\"\\\"5%7\\u01A6.) &3\\u01A7\\\"\\\"5$7\\u01A8/' 8!:\\u01A1!! )\"),\n        peg$decode(\"%;\\xEC/O#3\\xB1\\\"\\\"5#7\\xB2.6 &3\\xB3\\\"\\\"5#7\\xB4.* &$;+0#*;+&/'$8\\\":\\u01A9\\\" )(\\\"'#&'#\"),\n        peg$decode(\"%;\\u0104/\\x87#2F\\\"\\\"6F7G/x$;\\u0103/o$2F\\\"\\\"6F7G/`$;\\u0103/W$2F\\\"\\\"6F7G/H$;\\u0103/?$2F\\\"\\\"6F7G/0$;\\u0105/'$8):\\u01AA) )()'#(('#(''#(&'#(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;#/>#;#/5$;#/,$;#/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;\\u0103/,#;\\u0103/#$+\\\")(\\\"'#&'#\"),\n        peg$decode(\"%;\\u0103/5#;\\u0103/,$;\\u0103/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;\\x84/U#;'/L$;\\x92/C$;'/:$;\\x90/1$; .\\\" &\\\"/#$+&)(&'#(%'#($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\"%2\\u01AB\\\"\\\"6\\u01AB7\\u01AC.) &2\\u01AD\\\"\\\"6\\u01AD7\\u01AE/w#;0/n$;\\u0108/e$$%;B/2#;\\u0109.# &;\\xA0/#$+\\\")(\\\"'#&'#0<*%;B/2#;\\u0109.# &;\\xA0/#$+\\\")(\\\"'#&'#&/#$+$)($'#(#'#(\\\"'#&'#\"),\n        peg$decode(\";\\x99.# &;L\"),\n        peg$decode(\"%2\\u01AF\\\"\\\"6\\u01AF7\\u01B0/5#;</,$;\\u010A/#$+#)(#'#(\\\"'#&'#\"),\n        peg$decode(\"%;D/S#;,/J$2:\\\"\\\"6:7;/;$;,.# &;T/,$;E/#$+%)(%'#($'#(#'#(\\\"'#&'#\")\n      ],\n\n      peg$currPos          = 0,\n      peg$savedPos         = 0,\n      peg$posDetailsCache  = [{ line: 1, column: 1 }],\n      peg$maxFailPos       = 0,\n      peg$maxFailExpected  = [],\n      peg$silentFails      = 0,\n\n      peg$result;\n\n  if (\"startRule\" in options) {\n    if (!(options.startRule in peg$startRuleIndices)) {\n      throw new Error(\"Can't start parsing from rule \\\"\" + options.startRule + \"\\\".\");\n    }\n\n    peg$startRuleIndex = peg$startRuleIndices[options.startRule];\n  }\n\n  function text() {\n    return input.substring(peg$savedPos, peg$currPos);\n  }\n\n  function location() {\n    return peg$computeLocation(peg$savedPos, peg$currPos);\n  }\n\n  function expected(description, location) {\n    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)\n\n    throw peg$buildStructuredError(\n      [peg$otherExpectation(description)],\n      input.substring(peg$savedPos, peg$currPos),\n      location\n    );\n  }\n\n  function error(message, location) {\n    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)\n\n    throw peg$buildSimpleError(message, location);\n  }\n\n  function peg$literalExpectation(text, ignoreCase) {\n    return { type: \"literal\", text: text, ignoreCase: ignoreCase };\n  }\n\n  function peg$classExpectation(parts, inverted, ignoreCase) {\n    return { type: \"class\", parts: parts, inverted: inverted, ignoreCase: ignoreCase };\n  }\n\n  function peg$anyExpectation() {\n    return { type: \"any\" };\n  }\n\n  function peg$endExpectation() {\n    return { type: \"end\" };\n  }\n\n  function peg$otherExpectation(description) {\n    return { type: \"other\", description: description };\n  }\n\n  function peg$computePosDetails(pos) {\n    var details = peg$posDetailsCache[pos], p;\n\n    if (details) {\n      return details;\n    } else {\n      p = pos - 1;\n      while (!peg$posDetailsCache[p]) {\n        p--;\n      }\n\n      details = peg$posDetailsCache[p];\n      details = {\n        line:   details.line,\n        column: details.column\n      };\n\n      while (p < pos) {\n        if (input.charCodeAt(p) === 10) {\n          details.line++;\n          details.column = 1;\n        } else {\n          details.column++;\n        }\n\n        p++;\n      }\n\n      peg$posDetailsCache[pos] = details;\n      return details;\n    }\n  }\n\n  function peg$computeLocation(startPos, endPos) {\n    var startPosDetails = peg$computePosDetails(startPos),\n        endPosDetails   = peg$computePosDetails(endPos);\n\n    return {\n      start: {\n        offset: startPos,\n        line:   startPosDetails.line,\n        column: startPosDetails.column\n      },\n      end: {\n        offset: endPos,\n        line:   endPosDetails.line,\n        column: endPosDetails.column\n      }\n    };\n  }\n\n  function peg$fail(expected) {\n    if (peg$currPos < peg$maxFailPos) { return; }\n\n    if (peg$currPos > peg$maxFailPos) {\n      peg$maxFailPos = peg$currPos;\n      peg$maxFailExpected = [];\n    }\n\n    peg$maxFailExpected.push(expected);\n  }\n\n  function peg$buildSimpleError(message, location) {\n    return new peg$SyntaxError(message, null, null, location);\n  }\n\n  function peg$buildStructuredError(expected, found, location) {\n    return new peg$SyntaxError(\n      peg$SyntaxError.buildMessage(expected, found),\n      expected,\n      found,\n      location\n    );\n  }\n\n  function peg$decode(s) {\n    var bc = new Array(s.length), i;\n\n    for (i = 0; i < s.length; i++) {\n      bc[i] = s.charCodeAt(i) - 32;\n    }\n\n    return bc;\n  }\n\n  function peg$parseRule(index) {\n    var bc    = peg$bytecode[index],\n        ip    = 0,\n        ips   = [],\n        end   = bc.length,\n        ends  = [],\n        stack = [],\n        params, i;\n\n    while (true) {\n      while (ip < end) {\n        switch (bc[ip]) {\n          case 0:\n            stack.push(peg$consts[bc[ip + 1]]);\n            ip += 2;\n            break;\n\n          case 1:\n            stack.push(void 0);\n            ip++;\n            break;\n\n          case 2:\n            stack.push(null);\n            ip++;\n            break;\n\n          case 3:\n            stack.push(peg$FAILED);\n            ip++;\n            break;\n\n          case 4:\n            stack.push([]);\n            ip++;\n            break;\n\n          case 5:\n            stack.push(peg$currPos);\n            ip++;\n            break;\n\n          case 6:\n            stack.pop();\n            ip++;\n            break;\n\n          case 7:\n            peg$currPos = stack.pop();\n            ip++;\n            break;\n\n          case 8:\n            stack.length -= bc[ip + 1];\n            ip += 2;\n            break;\n\n          case 9:\n            stack.splice(-2, 1);\n            ip++;\n            break;\n\n          case 10:\n            stack[stack.length - 2].push(stack.pop());\n            ip++;\n            break;\n\n          case 11:\n            stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));\n            ip += 2;\n            break;\n\n          case 12:\n            stack.push(input.substring(stack.pop(), peg$currPos));\n            ip++;\n            break;\n\n          case 13:\n            ends.push(end);\n            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);\n\n            if (stack[stack.length - 1]) {\n              end = ip + 3 + bc[ip + 1];\n              ip += 3;\n            } else {\n              end = ip + 3 + bc[ip + 1] + bc[ip + 2];\n              ip += 3 + bc[ip + 1];\n            }\n\n            break;\n\n          case 14:\n            ends.push(end);\n            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);\n\n            if (stack[stack.length - 1] === peg$FAILED) {\n              end = ip + 3 + bc[ip + 1];\n              ip += 3;\n            } else {\n              end = ip + 3 + bc[ip + 1] + bc[ip + 2];\n              ip += 3 + bc[ip + 1];\n            }\n\n            break;\n\n          case 15:\n            ends.push(end);\n            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);\n\n            if (stack[stack.length - 1] !== peg$FAILED) {\n              end = ip + 3 + bc[ip + 1];\n              ip += 3;\n            } else {\n              end = ip + 3 + bc[ip + 1] + bc[ip + 2];\n              ip += 3 + bc[ip + 1];\n            }\n\n            break;\n\n          case 16:\n            if (stack[stack.length - 1] !== peg$FAILED) {\n              ends.push(end);\n              ips.push(ip);\n\n              end = ip + 2 + bc[ip + 1];\n              ip += 2;\n            } else {\n              ip += 2 + bc[ip + 1];\n            }\n\n            break;\n\n          case 17:\n            ends.push(end);\n            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);\n\n            if (input.length > peg$currPos) {\n              end = ip + 3 + bc[ip + 1];\n              ip += 3;\n            } else {\n              end = ip + 3 + bc[ip + 1] + bc[ip + 2];\n              ip += 3 + bc[ip + 1];\n            }\n\n            break;\n\n          case 18:\n            ends.push(end);\n            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);\n\n            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {\n              end = ip + 4 + bc[ip + 2];\n              ip += 4;\n            } else {\n              end = ip + 4 + bc[ip + 2] + bc[ip + 3];\n              ip += 4 + bc[ip + 2];\n            }\n\n            break;\n\n          case 19:\n            ends.push(end);\n            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);\n\n            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {\n              end = ip + 4 + bc[ip + 2];\n              ip += 4;\n            } else {\n              end = ip + 4 + bc[ip + 2] + bc[ip + 3];\n              ip += 4 + bc[ip + 2];\n            }\n\n            break;\n\n          case 20:\n            ends.push(end);\n            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);\n\n            if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {\n              end = ip + 4 + bc[ip + 2];\n              ip += 4;\n            } else {\n              end = ip + 4 + bc[ip + 2] + bc[ip + 3];\n              ip += 4 + bc[ip + 2];\n            }\n\n            break;\n\n          case 21:\n            stack.push(input.substr(peg$currPos, bc[ip + 1]));\n            peg$currPos += bc[ip + 1];\n            ip += 2;\n            break;\n\n          case 22:\n            stack.push(peg$consts[bc[ip + 1]]);\n            peg$currPos += peg$consts[bc[ip + 1]].length;\n            ip += 2;\n            break;\n\n          case 23:\n            stack.push(peg$FAILED);\n            if (peg$silentFails === 0) {\n              peg$fail(peg$consts[bc[ip + 1]]);\n            }\n            ip += 2;\n            break;\n\n          case 24:\n            peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];\n            ip += 2;\n            break;\n\n          case 25:\n            peg$savedPos = peg$currPos;\n            ip++;\n            break;\n\n          case 26:\n            params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);\n            for (i = 0; i < bc[ip + 3]; i++) {\n              params[i] = stack[stack.length - 1 - params[i]];\n            }\n\n            stack.splice(\n              stack.length - bc[ip + 2],\n              bc[ip + 2],\n              peg$consts[bc[ip + 1]].apply(null, params)\n            );\n\n            ip += 4 + bc[ip + 3];\n            break;\n\n          case 27:\n            stack.push(peg$parseRule(bc[ip + 1]));\n            ip += 2;\n            break;\n\n          case 28:\n            peg$silentFails++;\n            ip++;\n            break;\n\n          case 29:\n            peg$silentFails--;\n            ip++;\n            break;\n\n          default:\n            throw new Error(\"Invalid opcode: \" + bc[ip] + \".\");\n        }\n      }\n\n      if (ends.length > 0) {\n        end = ends.pop();\n        ip = ips.pop();\n      } else {\n        break;\n      }\n    }\n\n    return stack[0];\n  }\n\n\n    options.data = {}; // Object to which header attributes will be assigned during parsing\n\n    function list (head, tail) {\n      return [head].concat(tail);\n    }\n\n\n  peg$result = peg$parseRule(peg$startRuleIndex);\n\n  if (peg$result !== peg$FAILED && peg$currPos === input.length) {\n    return peg$result;\n  } else {\n    if (peg$result !== peg$FAILED && peg$currPos < input.length) {\n      peg$fail(peg$endExpectation());\n    }\n\n    throw peg$buildStructuredError(\n      peg$maxFailExpected,\n      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,\n      peg$maxFailPos < input.length\n        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)\n        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)\n    );\n  }\n}\n\nmodule.exports = {\n  SyntaxError: peg$SyntaxError,\n  parse:       peg$parse\n};\n\n\n//# sourceURL=webpack://SIP/./src/Grammar/src/Grammar.pegjs?");

/***/ }),

/***/ "./src/LoggerFactory.js":
/*!******************************!*\
  !*** ./src/LoggerFactory.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar levels = {\n  'error': 0,\n  'warn': 1,\n  'log': 2,\n  'debug': 3\n};\n\nmodule.exports = function (console) {\n\n  var LoggerFactory = function LoggerFactory() {\n    var logger,\n        level = 2,\n        builtinEnabled = true,\n        connector = null;\n\n    this.loggers = {};\n\n    logger = this.getLogger('sip.loggerfactory');\n\n    Object.defineProperties(this, {\n      builtinEnabled: {\n        get: function get() {\n          return builtinEnabled;\n        },\n        set: function set(value) {\n          if (typeof value === 'boolean') {\n            builtinEnabled = value;\n          } else {\n            logger.error('invalid \"builtinEnabled\" parameter value: ' + JSON.stringify(value));\n          }\n        }\n      },\n\n      level: {\n        get: function get() {\n          return level;\n        },\n        set: function set(value) {\n          if (value >= 0 && value <= 3) {\n            level = value;\n          } else if (value > 3) {\n            level = 3;\n          } else if (levels.hasOwnProperty(value)) {\n            level = levels[value];\n          } else {\n            logger.error('invalid \"level\" parameter value: ' + JSON.stringify(value));\n          }\n        }\n      },\n\n      connector: {\n        get: function get() {\n          return connector;\n        },\n        set: function set(value) {\n          if (value === null || value === \"\" || value === undefined) {\n            connector = null;\n          } else if (typeof value === 'function') {\n            connector = value;\n          } else {\n            logger.error('invalid \"connector\" parameter value: ' + JSON.stringify(value));\n          }\n        }\n      }\n    });\n  };\n\n  LoggerFactory.prototype.print = function (target, category, label, content) {\n    if (typeof content === 'string') {\n      var prefix = [new Date(), category];\n      if (label) {\n        prefix.push(label);\n      }\n      content = prefix.concat(content).join(' | ');\n    }\n    target.call(console, content);\n  };\n\n  function Logger(logger, category, label) {\n    this.logger = logger;\n    this.category = category;\n    this.label = label;\n  }\n\n  Object.keys(levels).forEach(function (targetName) {\n    Logger.prototype[targetName] = function (content) {\n      this.logger[targetName](this.category, this.label, content);\n    };\n\n    LoggerFactory.prototype[targetName] = function (category, label, content) {\n      if (this.level >= levels[targetName]) {\n        if (this.builtinEnabled) {\n          this.print(console[targetName], category, label, content);\n        }\n\n        if (this.connector) {\n          this.connector(targetName, category, label, content);\n        }\n      }\n    };\n  });\n\n  LoggerFactory.prototype.getLogger = function (category, label) {\n    var logger;\n\n    if (label && this.level === 3) {\n      return new Logger(this, category, label);\n    } else if (this.loggers[category]) {\n      return this.loggers[category];\n    } else {\n      logger = new Logger(this, category);\n      this.loggers[category] = logger;\n      return logger;\n    }\n  };\n\n  return LoggerFactory;\n};\n\n//# sourceURL=webpack://SIP/./src/LoggerFactory.js?");

/***/ }),

/***/ "./src/NameAddrHeader.js":
/*!*******************************!*\
  !*** ./src/NameAddrHeader.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP NameAddrHeader\n */\n\n/**\n * @augments SIP\n * @class Class creating a Name Address SIP header.\n *\n * @param {SIP.URI} uri\n * @param {String} [displayName]\n * @param {Object} [parameters]\n *\n */\n\nmodule.exports = function (SIP) {\n  var NameAddrHeader;\n\n  NameAddrHeader = function NameAddrHeader(uri, displayName, parameters) {\n    var param;\n\n    // Checks\n    if (!uri || !(uri instanceof SIP.URI)) {\n      throw new TypeError('missing or invalid \"uri\" parameter');\n    }\n\n    // Initialize parameters\n    this.uri = uri;\n    this.parameters = {};\n\n    for (param in parameters) {\n      this.setParam(param, parameters[param]);\n    }\n\n    Object.defineProperties(this, {\n      friendlyName: {\n        get: function get() {\n          return this.displayName || uri.aor;\n        }\n      },\n\n      displayName: {\n        get: function get() {\n          return displayName;\n        },\n        set: function set(value) {\n          displayName = value === 0 ? '0' : value;\n        }\n      }\n    });\n  };\n  NameAddrHeader.prototype = {\n    setParam: function setParam(key, value) {\n      if (key) {\n        this.parameters[key.toLowerCase()] = typeof value === 'undefined' || value === null ? null : value.toString();\n      }\n    },\n    getParam: SIP.URI.prototype.getParam,\n    hasParam: SIP.URI.prototype.hasParam,\n    deleteParam: SIP.URI.prototype.deleteParam,\n    clearParams: SIP.URI.prototype.clearParams,\n\n    clone: function clone() {\n      return new NameAddrHeader(this.uri.clone(), this.displayName, JSON.parse(JSON.stringify(this.parameters)));\n    },\n\n    toString: function toString() {\n      var body, parameter;\n\n      body = this.displayName || this.displayName === 0 ? '\"' + this.displayName + '\" ' : '';\n      body += '<' + this.uri.toString() + '>';\n\n      for (parameter in this.parameters) {\n        body += ';' + parameter;\n\n        if (this.parameters[parameter] !== null) {\n          body += '=' + this.parameters[parameter];\n        }\n      }\n\n      return body;\n    }\n  };\n\n  /**\n    * Parse the given string and returns a SIP.NameAddrHeader instance or undefined if\n    * it is an invalid NameAddrHeader.\n    * @public\n    * @param {String} name_addr_header\n    */\n  NameAddrHeader.parse = function (name_addr_header) {\n    name_addr_header = SIP.Grammar.parse(name_addr_header, 'Name_Addr_Header');\n\n    if (name_addr_header !== -1) {\n      return name_addr_header;\n    } else {\n      return undefined;\n    }\n  };\n\n  SIP.NameAddrHeader = NameAddrHeader;\n};\n\n//# sourceURL=webpack://SIP/./src/NameAddrHeader.js?");

/***/ }),

/***/ "./src/Parser.js":
/*!***********************!*\
  !*** ./src/Parser.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP Message Parser\n */\n\n/**\n * Extract and parse every header of a SIP message.\n * @augments SIP\n * @namespace\n */\n\nmodule.exports = function (SIP) {\n  var Parser;\n\n  function getHeader(data, headerStart) {\n    var\n    // 'start' position of the header.\n    start = headerStart,\n\n    // 'end' position of the header.\n    end = 0,\n\n    // 'partial end' position of the header.\n    partialEnd = 0;\n\n    //End of message.\n    if (data.substring(start, start + 2).match(/(^\\r\\n)/)) {\n      return -2;\n    }\n\n    while (end === 0) {\n      // Partial End of Header.\n      partialEnd = data.indexOf('\\r\\n', start);\n\n      // 'indexOf' returns -1 if the value to be found never occurs.\n      if (partialEnd === -1) {\n        return partialEnd;\n      }\n\n      if (!data.substring(partialEnd + 2, partialEnd + 4).match(/(^\\r\\n)/) && data.charAt(partialEnd + 2).match(/(^\\s+)/)) {\n        // Not the end of the message. Continue from the next position.\n        start = partialEnd + 2;\n      } else {\n        end = partialEnd;\n      }\n    }\n\n    return end;\n  }\n\n  function parseHeader(message, data, headerStart, headerEnd) {\n    var header,\n        idx,\n        length,\n        parsed,\n        hcolonIndex = data.indexOf(':', headerStart),\n        headerName = data.substring(headerStart, hcolonIndex).trim(),\n        headerValue = data.substring(hcolonIndex + 1, headerEnd).trim();\n\n    // If header-field is well-known, parse it.\n    switch (headerName.toLowerCase()) {\n      case 'via':\n      case 'v':\n        message.addHeader('via', headerValue);\n        if (message.getHeaders('via').length === 1) {\n          parsed = message.parseHeader('Via');\n          if (parsed) {\n            message.via = parsed;\n            message.via_branch = parsed.branch;\n          }\n        } else {\n          parsed = 0;\n        }\n        break;\n      case 'from':\n      case 'f':\n        message.setHeader('from', headerValue);\n        parsed = message.parseHeader('from');\n        if (parsed) {\n          message.from = parsed;\n          message.from_tag = parsed.getParam('tag');\n        }\n        break;\n      case 'to':\n      case 't':\n        message.setHeader('to', headerValue);\n        parsed = message.parseHeader('to');\n        if (parsed) {\n          message.to = parsed;\n          message.to_tag = parsed.getParam('tag');\n        }\n        break;\n      case 'record-route':\n        parsed = SIP.Grammar.parse(headerValue, 'Record_Route');\n\n        if (parsed === -1) {\n          parsed = undefined;\n          break;\n        }\n\n        length = parsed.length;\n        for (idx = 0; idx < length; idx++) {\n          header = parsed[idx];\n          message.addHeader('record-route', headerValue.substring(header.position, header.offset));\n          message.headers['Record-Route'][message.getHeaders('record-route').length - 1].parsed = header.parsed;\n        }\n        break;\n      case 'call-id':\n      case 'i':\n        message.setHeader('call-id', headerValue);\n        parsed = message.parseHeader('call-id');\n        if (parsed) {\n          message.call_id = headerValue;\n        }\n        break;\n      case 'contact':\n      case 'm':\n        parsed = SIP.Grammar.parse(headerValue, 'Contact');\n\n        if (parsed === -1) {\n          parsed = undefined;\n          break;\n        }\n\n        length = parsed.length;\n        for (idx = 0; idx < length; idx++) {\n          header = parsed[idx];\n          message.addHeader('contact', headerValue.substring(header.position, header.offset));\n          message.headers['Contact'][message.getHeaders('contact').length - 1].parsed = header.parsed;\n        }\n        break;\n      case 'content-length':\n      case 'l':\n        message.setHeader('content-length', headerValue);\n        parsed = message.parseHeader('content-length');\n        break;\n      case 'content-type':\n      case 'c':\n        message.setHeader('content-type', headerValue);\n        parsed = message.parseHeader('content-type');\n        break;\n      case 'cseq':\n        message.setHeader('cseq', headerValue);\n        parsed = message.parseHeader('cseq');\n        if (parsed) {\n          message.cseq = parsed.value;\n        }\n        if (message instanceof SIP.IncomingResponse) {\n          message.method = parsed.method;\n        }\n        break;\n      case 'max-forwards':\n        message.setHeader('max-forwards', headerValue);\n        parsed = message.parseHeader('max-forwards');\n        break;\n      case 'www-authenticate':\n        message.setHeader('www-authenticate', headerValue);\n        parsed = message.parseHeader('www-authenticate');\n        break;\n      case 'proxy-authenticate':\n        message.setHeader('proxy-authenticate', headerValue);\n        parsed = message.parseHeader('proxy-authenticate');\n        break;\n      case 'refer-to':\n      case 'r':\n        message.setHeader('refer-to', headerValue);\n        parsed = message.parseHeader('refer-to');\n        if (parsed) {\n          message.refer_to = parsed;\n        }\n        break;\n      default:\n        // Do not parse this header.\n        message.setHeader(headerName, headerValue);\n        parsed = 0;\n    }\n\n    if (parsed === undefined) {\n      return {\n        error: 'error parsing header \"' + headerName + '\"'\n      };\n    } else {\n      return true;\n    }\n  }\n\n  /** Parse SIP Message\n   * @function\n   * @param {String} message SIP message.\n   * @param {Object} logger object.\n   * @returns {SIP.IncomingRequest|SIP.IncomingResponse|undefined}\n   */\n  Parser = {};\n  Parser.parseMessage = function (data, ua) {\n    var message,\n        firstLine,\n        contentLength,\n        bodyStart,\n        parsed,\n        headerStart = 0,\n        headerEnd = data.indexOf('\\r\\n'),\n        logger = ua.getLogger('sip.parser');\n\n    if (headerEnd === -1) {\n      logger.warn('no CRLF found, not a SIP message, discarded');\n      return;\n    }\n\n    // Parse first line. Check if it is a Request or a Reply.\n    firstLine = data.substring(0, headerEnd);\n    parsed = SIP.Grammar.parse(firstLine, 'Request_Response');\n\n    if (parsed === -1) {\n      logger.warn('error parsing first line of SIP message: \"' + firstLine + '\"');\n      return;\n    } else if (!parsed.status_code) {\n      message = new SIP.IncomingRequest(ua);\n      message.method = parsed.method;\n      message.ruri = parsed.uri;\n    } else {\n      message = new SIP.IncomingResponse(ua);\n      message.status_code = parsed.status_code;\n      message.reason_phrase = parsed.reason_phrase;\n    }\n\n    message.data = data;\n    headerStart = headerEnd + 2;\n\n    /* Loop over every line in data. Detect the end of each header and parse\n    * it or simply add to the headers collection.\n    */\n    while (true) {\n      headerEnd = getHeader(data, headerStart);\n\n      // The SIP message has normally finished.\n      if (headerEnd === -2) {\n        bodyStart = headerStart + 2;\n        break;\n      }\n      // data.indexOf returned -1 due to a malformed message.\n      else if (headerEnd === -1) {\n          logger.error('malformed message');\n          return;\n        }\n\n      parsed = parseHeader(message, data, headerStart, headerEnd);\n\n      if (parsed !== true) {\n        logger.error(parsed.error);\n        return;\n      }\n\n      headerStart = headerEnd + 2;\n    }\n\n    /* RFC3261 18.3.\n     * If there are additional bytes in the transport packet\n     * beyond the end of the body, they MUST be discarded.\n     */\n    if (message.hasHeader('content-length')) {\n      contentLength = message.getHeader('content-length');\n      message.body = data.substr(bodyStart, contentLength);\n    } else {\n      message.body = data.substring(bodyStart);\n    }\n\n    return message;\n  };\n\n  SIP.Parser = Parser;\n};\n\n//# sourceURL=webpack://SIP/./src/Parser.js?");

/***/ }),

/***/ "./src/PublishContext.js":
/*!*******************************!*\
  !*** ./src/PublishContext.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * @fileoverview SIP Publish (SIP Extension for Event State Publication RFC3903)\n */\n\n/**\n * @augments SIP\n * @class Class creating a SIP PublishContext.\n */\n\nmodule.exports = function (SIP) {\n\n  var PublishContext;\n\n  PublishContext = function PublishContext(ua, target, event, options) {\n    this.options = options = options || {};\n    this.options.extraHeaders = (options.extraHeaders || []).slice();\n    this.options.contentType = options.contentType || 'text/plain';\n\n    if (typeof options.expires !== 'number' || options.expires % 1 !== 0) {\n      this.options.expires = 3600;\n    } else {\n      this.options.expires = Number(options.expires);\n    }\n\n    if (typeof options.unpublishOnClose !== \"boolean\") {\n      this.options.unpublishOnClose = true;\n    } else {\n      this.options.unpublishOnClose = options.unpublishOnClose;\n    }\n\n    if (target === undefined || target === null || target === '') {\n      throw new SIP.Exceptions.MethodParameterError('Publish', 'Target', target);\n    } else {\n      this.target = ua.normalizeTarget(target);\n    }\n\n    if (event === undefined || event === null || event === '') {\n      throw new SIP.Exceptions.MethodParameterError('Publish', 'Event', event);\n    } else {\n      this.event = event;\n    }\n\n    // Call parent constructor\n    SIP.ClientContext.call(this, ua, SIP.C.PUBLISH, this.target, this.options);\n\n    this.logger = this.ua.getLogger('sip.publish');\n\n    this.pubRequestBody = null;\n    this.pubRequestExpires = this.options.expires;\n    this.pubRequestEtag = null;\n\n    this.publish_refresh_timer = null;\n\n    ua.on('transportCreated', function (transport) {\n      transport.on('transportError', this.onTransportError.bind(this));\n    }.bind(this));\n  };\n\n  // Extend ClientContext\n  PublishContext.prototype = Object.create(SIP.ClientContext.prototype);\n\n  // Restore the class constructor\n  PublishContext.prototype.constructor = PublishContext;\n\n  /**\n   * Publish\n   *\n   * @param {string} Event body to publish, optional\n   *\n   */\n  PublishContext.prototype.publish = function (body) {\n    // Clean up before the run\n    this.request = null;\n    SIP.Timers.clearTimeout(this.publish_refresh_timer);\n\n    if (body !== undefined && body !== null && body !== '') {\n      // is Inital or Modify request\n      this.options.body = body;\n      this.pubRequestBody = this.options.body;\n\n      if (this.pubRequestExpires === 0) {\n        // This is Initial request after unpublish\n        this.pubRequestExpires = this.options.expires;\n        this.pubRequestEtag = null;\n      }\n\n      if (!this.ua.publishers[this.target.toString() + ':' + this.event]) {\n        this.ua.publishers[this.target.toString() + ':' + this.event] = this;\n      }\n    } else {\n      // This is Refresh request\n      this.pubRequestBody = null;\n\n      if (this.pubRequestEtag === null) {\n        //Request not valid\n        throw new SIP.Exceptions.MethodParameterError('Publish', 'Body', body);\n      }\n\n      if (this.pubRequestExpires === 0) {\n        //Request not valid\n        throw new SIP.Exceptions.MethodParameterError('Publish', 'Expire', this.pubRequestExpires);\n      }\n    }\n\n    this.sendPublishRequest();\n  };\n\n  /**\n   * Unpublish\n   *\n   */\n  PublishContext.prototype.unpublish = function () {\n    // Clean up before the run\n    this.request = null;\n    SIP.Timers.clearTimeout(this.publish_refresh_timer);\n\n    this.pubRequestBody = null;\n    this.pubRequestExpires = 0;\n\n    if (this.pubRequestEtag !== null) {\n      this.sendPublishRequest();\n    }\n  };\n\n  /**\n   * Close\n   *\n   */\n  PublishContext.prototype.close = function () {\n    // Send unpublish, if requested\n    if (this.options.unpublishOnClose) {\n      this.unpublish();\n    } else {\n      this.request = null;\n      SIP.Timers.clearTimeout(this.publish_refresh_timer);\n\n      this.pubRequestBody = null;\n      this.pubRequestExpires = 0;\n      this.pubRequestEtag = null;\n    }\n\n    if (this.ua.publishers[this.target.toString() + ':' + this.event]) {\n      delete this.ua.publishers[this.target.toString() + ':' + this.event];\n    }\n  };\n\n  /**\n   * @private\n   *\n   */\n  PublishContext.prototype.sendPublishRequest = function () {\n    var reqOptions;\n\n    reqOptions = Object.create(this.options || Object.prototype);\n    reqOptions.extraHeaders = (this.options.extraHeaders || []).slice();\n\n    reqOptions.extraHeaders.push('Event: ' + this.event);\n    reqOptions.extraHeaders.push('Expires: ' + this.pubRequestExpires);\n\n    if (this.pubRequestEtag !== null) {\n      reqOptions.extraHeaders.push('SIP-If-Match: ' + this.pubRequestEtag);\n    }\n\n    this.request = new SIP.OutgoingRequest(SIP.C.PUBLISH, this.target, this.ua, this.options.params, reqOptions.extraHeaders);\n\n    if (this.pubRequestBody !== null) {\n      this.request.body = {};\n      this.request.body.body = this.pubRequestBody;\n      this.request.body.contentType = this.options.contentType;\n    }\n\n    this.send();\n  };\n\n  /**\n   * @private\n   *\n   */\n  PublishContext.prototype.receiveResponse = function (response) {\n    var expires,\n        minExpires,\n        cause = SIP.Utils.getReasonPhrase(response.status_code);\n\n    switch (true) {\n      case /^1[0-9]{2}$/.test(response.status_code):\n        this.emit('progress', response, cause);\n        break;\n\n      case /^2[0-9]{2}$/.test(response.status_code):\n        // Set SIP-Etag\n        if (response.hasHeader('SIP-ETag')) {\n          this.pubRequestEtag = response.getHeader('SIP-ETag');\n        } else {\n          this.logger.warn('SIP-ETag header missing in a 200-class response to PUBLISH');\n        }\n\n        // Update Expire\n        if (response.hasHeader('Expires')) {\n          expires = Number(response.getHeader('Expires'));\n          if (typeof expires === 'number' && expires >= 0 && expires <= this.pubRequestExpires) {\n            this.pubRequestExpires = expires;\n          } else {\n            this.logger.warn('Bad Expires header in a 200-class response to PUBLISH');\n          }\n        } else {\n          this.logger.warn('Expires header missing in a 200-class response to PUBLISH');\n        }\n\n        if (this.pubRequestExpires !== 0) {\n          // Schedule refresh\n          this.publish_refresh_timer = SIP.Timers.setTimeout(this.publish.bind(this), this.pubRequestExpires * 900);\n          this.emit('published', response, cause);\n        } else {\n          this.emit('unpublished', response, cause);\n        }\n\n        break;\n\n      case /^412$/.test(response.status_code):\n        // 412 code means no matching ETag - possibly the PUBLISH expired\n        // Resubmit as new request, if the current request is not a \"remove\"\n\n        if (this.pubRequestEtag !== null && this.pubRequestExpires !== 0) {\n          this.logger.warn('412 response to PUBLISH, recovering');\n          this.pubRequestEtag = null;\n          this.emit('progress', response, cause);\n          this.publish(this.options.body);\n        } else {\n          this.logger.warn('412 response to PUBLISH, recovery failed');\n          this.pubRequestExpires = 0;\n          this.emit('failed', response, cause);\n          this.emit('unpublished', response, cause);\n        }\n\n        break;\n\n      case /^423$/.test(response.status_code):\n        // 423 code means we need to adjust the Expires interval up\n        if (this.pubRequestExpires !== 0 && response.hasHeader('Min-Expires')) {\n          minExpires = Number(response.getHeader('Min-Expires'));\n          if (typeof minExpires === 'number' || minExpires > this.pubRequestExpires) {\n            this.logger.warn('423 code in response to PUBLISH, adjusting the Expires value and trying to recover');\n            this.pubRequestExpires = minExpires;\n            this.emit('progress', response, cause);\n            this.publish(this.options.body);\n          } else {\n            this.logger.warn('Bad 423 response Min-Expires header received for PUBLISH');\n            this.pubRequestExpires = 0;\n            this.emit('failed', response, cause);\n            this.emit('unpublished', response, cause);\n          }\n        } else {\n          this.logger.warn('423 response to PUBLISH, recovery failed');\n          this.pubRequestExpires = 0;\n          this.emit('failed', response, cause);\n          this.emit('unpublished', response, cause);\n        }\n\n        break;\n\n      default:\n        this.pubRequestExpires = 0;\n        this.emit('failed', response, cause);\n        this.emit('unpublished', response, cause);\n\n        break;\n    }\n\n    // Do the cleanup\n    if (this.pubRequestExpires === 0) {\n      SIP.Timers.clearTimeout(this.publish_refresh_timer);\n\n      this.pubRequestBody = null;\n      this.pubRequestEtag = null;\n    }\n  };\n\n  PublishContext.prototype.onRequestTimeout = function () {\n    SIP.ClientContext.prototype.onRequestTimeout.call(this);\n    this.emit('unpublished', null, SIP.C.causes.REQUEST_TIMEOUT);\n  };\n\n  PublishContext.prototype.onTransportError = function () {\n    SIP.ClientContext.prototype.onTransportError.call(this);\n    this.emit('unpublished', null, SIP.C.causes.CONNECTION_ERROR);\n  };\n\n  SIP.PublishContext = PublishContext;\n};\n\n//# sourceURL=webpack://SIP/./src/PublishContext.js?");

/***/ }),

/***/ "./src/RegisterContext.js":
/*!********************************!*\
  !*** ./src/RegisterContext.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (SIP) {\n\n  var RegisterContext;\n\n  RegisterContext = function RegisterContext(ua) {\n    var params = {},\n        regId = 1;\n\n    this.registrar = ua.configuration.registrarServer;\n    this.expires = ua.configuration.registerExpires;\n\n    // Contact header\n    this.contact = ua.contact.toString();\n\n    if (regId) {\n      this.contact += ';reg-id=' + regId;\n      this.contact += ';+sip.instance=\"<urn:uuid:' + ua.configuration.instanceId + '>\"';\n    }\n\n    // Call-ID and CSeq values RFC3261 10.2\n    this.call_id = SIP.Utils.createRandomToken(22);\n    this.cseq = Math.floor(Math.random() * 10000);\n\n    this.to_uri = ua.configuration.uri;\n\n    params.to_uri = this.to_uri;\n    params.to_displayName = ua.configuration.displayName;\n    params.call_id = this.call_id;\n    params.cseq = this.cseq;\n\n    // Extends ClientContext\n    SIP.Utils.augment(this, SIP.ClientContext, [ua, 'REGISTER', this.registrar, { params: params }]);\n\n    this.registrationTimer = null;\n    this.registrationExpiredTimer = null;\n\n    // Set status\n    this.registered = false;\n\n    this.logger = ua.getLogger('sip.registercontext');\n    ua.on('transportCreated', function (transport) {\n      transport.on('disconnected', this.onTransportDisconnected.bind(this));\n    }.bind(this));\n  };\n\n  RegisterContext.prototype = Object.create({}, {\n    register: { writable: true, value: function register(options) {\n        var self = this,\n            extraHeaders;\n\n        // Handle Options\n        this.options = options || {};\n        extraHeaders = (this.options.extraHeaders || []).slice();\n        extraHeaders.push('Contact: ' + this.contact + ';expires=' + this.expires);\n        extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());\n\n        // Save original extraHeaders to be used in .close\n        this.closeHeaders = this.options.closeWithHeaders ? (this.options.extraHeaders || []).slice() : [];\n\n        this.receiveResponse = function (response) {\n          var contact,\n              expires,\n              contacts = response.getHeaders('contact').length,\n              cause;\n\n          // Discard responses to older REGISTER/un-REGISTER requests.\n          if (response.cseq !== this.cseq) {\n            return;\n          }\n\n          // Clear registration timer\n          if (this.registrationTimer !== null) {\n            SIP.Timers.clearTimeout(this.registrationTimer);\n            this.registrationTimer = null;\n          }\n\n          switch (true) {\n            case /^1[0-9]{2}$/.test(response.status_code):\n              this.emit('progress', response);\n              break;\n            case /^2[0-9]{2}$/.test(response.status_code):\n              this.emit('accepted', response);\n\n              if (response.hasHeader('expires')) {\n                expires = response.getHeader('expires');\n              }\n\n              if (this.registrationExpiredTimer !== null) {\n                SIP.Timers.clearTimeout(this.registrationExpiredTimer);\n                this.registrationExpiredTimer = null;\n              }\n\n              // Search the Contact pointing to us and update the expires value accordingly.\n              if (!contacts) {\n                this.logger.warn('no Contact header in response to REGISTER, response ignored');\n                break;\n              }\n\n              while (contacts--) {\n                contact = response.parseHeader('contact', contacts);\n                if (contact.uri.user === this.ua.contact.uri.user) {\n                  expires = contact.getParam('expires');\n                  break;\n                } else {\n                  contact = null;\n                }\n              }\n\n              if (!contact) {\n                this.logger.warn('no Contact header pointing to us, response ignored');\n                break;\n              }\n\n              if (!expires) {\n                expires = this.expires;\n              }\n\n              // Re-Register before the expiration interval has elapsed.\n              // For that, decrease the expires value. ie: 3 seconds\n              this.registrationTimer = SIP.Timers.setTimeout(function () {\n                self.registrationTimer = null;\n                self.register(self.options);\n              }, expires * 1000 - 3000);\n              this.registrationExpiredTimer = SIP.Timers.setTimeout(function () {\n                self.logger.warn('registration expired');\n                if (self.registered) {\n                  self.unregistered(null, SIP.C.causes.EXPIRES);\n                }\n              }, expires * 1000);\n\n              //Save gruu values\n              if (contact.hasParam('temp-gruu')) {\n                this.ua.contact.temp_gruu = SIP.URI.parse(contact.getParam('temp-gruu').replace(/\"/g, ''));\n              }\n              if (contact.hasParam('pub-gruu')) {\n                this.ua.contact.pub_gruu = SIP.URI.parse(contact.getParam('pub-gruu').replace(/\"/g, ''));\n              }\n\n              this.registered = true;\n              this.emit('registered', response || null);\n              break;\n            // Interval too brief RFC3261 10.2.8\n            case /^423$/.test(response.status_code):\n              if (response.hasHeader('min-expires')) {\n                // Increase our registration interval to the suggested minimum\n                this.expires = response.getHeader('min-expires');\n                // Attempt the registration again immediately\n                this.register(this.options);\n              } else {\n                //This response MUST contain a Min-Expires header field\n                this.logger.warn('423 response received for REGISTER without Min-Expires');\n                this.registrationFailure(response, SIP.C.causes.SIP_FAILURE_CODE);\n              }\n              break;\n            default:\n              cause = SIP.Utils.sipErrorCause(response.status_code);\n              this.registrationFailure(response, cause);\n          }\n        };\n\n        this.onRequestTimeout = function () {\n          this.registrationFailure(null, SIP.C.causes.REQUEST_TIMEOUT);\n        };\n\n        this.onTransportError = function () {\n          this.registrationFailure(null, SIP.C.causes.CONNECTION_ERROR);\n        };\n\n        this.cseq++;\n        this.request.cseq = this.cseq;\n        this.request.setHeader('cseq', this.cseq + ' REGISTER');\n        this.request.extraHeaders = extraHeaders;\n        this.send();\n      } },\n\n    registrationFailure: { writable: true, value: function registrationFailure(response, cause) {\n        this.emit('failed', response || null, cause || null);\n      } },\n\n    onTransportDisconnected: { writable: true, value: function onTransportDisconnected() {\n        this.registered_before = this.registered;\n        if (this.registrationTimer !== null) {\n          SIP.Timers.clearTimeout(this.registrationTimer);\n          this.registrationTimer = null;\n        }\n\n        if (this.registrationExpiredTimer !== null) {\n          SIP.Timers.clearTimeout(this.registrationExpiredTimer);\n          this.registrationExpiredTimer = null;\n        }\n\n        if (this.registered) {\n          this.unregistered(null, SIP.C.causes.CONNECTION_ERROR);\n        }\n      } },\n\n    onTransportConnected: { writable: true, value: function onTransportConnected() {\n        this.register(this.options);\n      } },\n\n    close: { writable: true, value: function close() {\n        var options = {\n          all: false,\n          extraHeaders: this.closeHeaders\n        };\n\n        this.registered_before = this.registered;\n        if (this.registered) {\n          this.unregister(options);\n        }\n      } },\n\n    unregister: { writable: true, value: function unregister(options) {\n        var extraHeaders;\n\n        options = options || {};\n\n        if (!this.registered && !options.all) {\n          this.logger.warn('Already unregistered, but sending an unregister anyways.');\n        }\n\n        extraHeaders = (options.extraHeaders || []).slice();\n\n        this.registered = false;\n\n        // Clear the registration timer.\n        if (this.registrationTimer !== null) {\n          SIP.Timers.clearTimeout(this.registrationTimer);\n          this.registrationTimer = null;\n        }\n\n        if (options.all) {\n          extraHeaders.push('Contact: *');\n          extraHeaders.push('Expires: 0');\n        } else {\n          extraHeaders.push('Contact: ' + this.contact + ';expires=0');\n        }\n\n        this.receiveResponse = function (response) {\n          var cause;\n\n          switch (true) {\n            case /^1[0-9]{2}$/.test(response.status_code):\n              this.emit('progress', response);\n              break;\n            case /^2[0-9]{2}$/.test(response.status_code):\n              this.emit('accepted', response);\n              if (this.registrationExpiredTimer !== null) {\n                SIP.Timers.clearTimeout(this.registrationExpiredTimer);\n                this.registrationExpiredTimer = null;\n              }\n              this.unregistered(response);\n              break;\n            default:\n              cause = SIP.Utils.sipErrorCause(response.status_code);\n              this.unregistered(response, cause);\n          }\n        };\n\n        this.onRequestTimeout = function () {\n          // Not actually unregistered...\n          //this.unregistered(null, SIP.C.causes.REQUEST_TIMEOUT);\n        };\n\n        this.cseq++;\n        this.request.cseq = this.cseq;\n        this.request.setHeader('cseq', this.cseq + ' REGISTER');\n        this.request.extraHeaders = extraHeaders;\n\n        this.send();\n      } },\n\n    unregistered: { writable: true, value: function unregistered(response, cause) {\n        this.registered = false;\n        this.emit('unregistered', response || null, cause || null);\n      } }\n\n  });\n\n  SIP.RegisterContext = RegisterContext;\n};\n\n//# sourceURL=webpack://SIP/./src/RegisterContext.js?");

/***/ }),

/***/ "./src/RequestSender.js":
/*!******************************!*\
  !*** ./src/RequestSender.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * @fileoverview Request Sender\n */\n\n/**\n * @augments SIP\n * @class Class creating a request sender.\n * @param {Object} applicant\n * @param {SIP.UA} ua\n */\n\nmodule.exports = function (SIP) {\n  var RequestSender;\n\n  RequestSender = function RequestSender(applicant, ua) {\n    this.logger = ua.getLogger('sip.requestsender');\n    this.ua = ua;\n    this.applicant = applicant;\n    this.method = applicant.request.method;\n    this.request = applicant.request;\n    this.credentials = null;\n    this.challenged = false;\n    this.staled = false;\n\n    // If ua is in closing process or even closed just allow sending Bye and ACK\n    if (ua.status === SIP.UA.C.STATUS_USER_CLOSED && (this.method !== SIP.C.BYE || this.method !== SIP.C.ACK)) {\n      this.onTransportError();\n    }\n  };\n\n  /**\n  * Create the client transaction and send the message.\n  */\n  RequestSender.prototype = {\n    send: function send() {\n      switch (this.method) {\n        case \"INVITE\":\n          this.clientTransaction = new SIP.Transactions.InviteClientTransaction(this, this.request, this.ua.transport);\n          break;\n        case \"ACK\":\n          this.clientTransaction = new SIP.Transactions.AckClientTransaction(this, this.request, this.ua.transport);\n          break;\n        default:\n          this.clientTransaction = new SIP.Transactions.NonInviteClientTransaction(this, this.request, this.ua.transport);\n      }\n      this.clientTransaction.send();\n\n      return this.clientTransaction;\n    },\n\n    /**\n    * Callback fired when receiving a request timeout error from the client transaction.\n    * To be re-defined by the applicant.\n    * @event\n    */\n    onRequestTimeout: function onRequestTimeout() {\n      this.applicant.onRequestTimeout();\n    },\n\n    /**\n    * Callback fired when receiving a transport error from the client transaction.\n    * To be re-defined by the applicant.\n    * @event\n    */\n    onTransportError: function onTransportError() {\n      this.applicant.onTransportError();\n    },\n\n    /**\n    * Called from client transaction when receiving a correct response to the request.\n    * Authenticate request if needed or pass the response back to the applicant.\n    * @param {SIP.IncomingResponse} response\n    */\n    receiveResponse: function receiveResponse(response) {\n      var cseq,\n          challenge,\n          authorization_header_name,\n          status_code = response.status_code;\n\n      /*\n      * Authentication\n      * Authenticate once. _challenged_ flag used to avoid infinite authentications.\n      */\n      if (status_code === 401 || status_code === 407) {\n\n        // Get and parse the appropriate WWW-Authenticate or Proxy-Authenticate header.\n        if (response.status_code === 401) {\n          challenge = response.parseHeader('www-authenticate');\n          authorization_header_name = 'authorization';\n        } else {\n          challenge = response.parseHeader('proxy-authenticate');\n          authorization_header_name = 'proxy-authorization';\n        }\n\n        // Verify it seems a valid challenge.\n        if (!challenge) {\n          this.logger.warn(response.status_code + ' with wrong or missing challenge, cannot authenticate');\n          this.applicant.receiveResponse(response);\n          return;\n        }\n\n        if (!this.challenged || !this.staled && challenge.stale === true) {\n          if (!this.credentials) {\n            this.credentials = this.ua.configuration.authenticationFactory(this.ua);\n          }\n\n          // Verify that the challenge is really valid.\n          if (!this.credentials.authenticate(this.request, challenge)) {\n            this.applicant.receiveResponse(response);\n            return;\n          }\n          this.challenged = true;\n\n          if (challenge.stale) {\n            this.staled = true;\n          }\n\n          if (response.method === SIP.C.REGISTER) {\n            cseq = this.applicant.cseq += 1;\n          } else if (this.request.dialog) {\n            cseq = this.request.dialog.local_seqnum += 1;\n          } else {\n            cseq = this.request.cseq + 1;\n            this.request.cseq = cseq;\n          }\n          this.request.setHeader('cseq', cseq + ' ' + this.method);\n\n          this.request.setHeader(authorization_header_name, this.credentials.toString());\n          this.send();\n        } else {\n          this.applicant.receiveResponse(response);\n        }\n      } else {\n        this.applicant.receiveResponse(response);\n      }\n    }\n  };\n\n  SIP.RequestSender = RequestSender;\n};\n\n//# sourceURL=webpack://SIP/./src/RequestSender.js?");

/***/ }),

/***/ "./src/SIP.js":
/*!********************!*\
  !*** ./src/SIP.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/**\n * @name SIP\n * @namespace\n */\n\n\nmodule.exports = function (environment) {\n\n  var pkg = __webpack_require__(/*! ../package.json */ \"./package.json\"),\n      version = pkg.version,\n      title = pkg.title;\n\n  var SIP = Object.defineProperties({}, {\n    version: {\n      get: function get() {\n        return version;\n      }\n    },\n    name: {\n      get: function get() {\n        return title;\n      }\n    }\n  });\n\n  __webpack_require__(/*! ./Utils */ \"./src/Utils.js\")(SIP, environment);\n  SIP.LoggerFactory = __webpack_require__(/*! ./LoggerFactory */ \"./src/LoggerFactory.js\")(environment.console);\n  SIP.EventEmitter = __webpack_require__(/*! ./EventEmitter */ \"./src/EventEmitter.js\")();\n  SIP.C = __webpack_require__(/*! ./Constants */ \"./src/Constants.js\")(SIP.name, SIP.version);\n  SIP.Exceptions = __webpack_require__(/*! ./Exceptions */ \"./src/Exceptions.js\");\n  SIP.Timers = __webpack_require__(/*! ./Timers */ \"./src/Timers.js\")(environment.timers);\n  SIP.Transport = __webpack_require__(/*! ./Transport */ \"./src/Transport.js\")(SIP);\n  __webpack_require__(/*! ./Parser */ \"./src/Parser.js\")(SIP);\n  __webpack_require__(/*! ./SIPMessage */ \"./src/SIPMessage.js\")(SIP);\n  __webpack_require__(/*! ./URI */ \"./src/URI.js\")(SIP);\n  __webpack_require__(/*! ./NameAddrHeader */ \"./src/NameAddrHeader.js\")(SIP);\n  __webpack_require__(/*! ./Transactions */ \"./src/Transactions.js\")(SIP);\n  __webpack_require__(/*! ./Dialogs */ \"./src/Dialogs.js\")(SIP);\n  __webpack_require__(/*! ./RequestSender */ \"./src/RequestSender.js\")(SIP);\n  __webpack_require__(/*! ./RegisterContext */ \"./src/RegisterContext.js\")(SIP);\n  SIP.SessionDescriptionHandler = __webpack_require__(/*! ./SessionDescriptionHandler */ \"./src/SessionDescriptionHandler.js\")(SIP.EventEmitter);\n  __webpack_require__(/*! ./ClientContext */ \"./src/ClientContext.js\")(SIP);\n  __webpack_require__(/*! ./ServerContext */ \"./src/ServerContext.js\")(SIP);\n  __webpack_require__(/*! ./Session */ \"./src/Session.js\")(SIP);\n  __webpack_require__(/*! ./Subscription */ \"./src/Subscription.js\")(SIP);\n  __webpack_require__(/*! ./PublishContext */ \"./src/PublishContext.js\")(SIP);\n  __webpack_require__(/*! ./UA */ \"./src/UA.js\")(SIP, environment);\n  __webpack_require__(/*! ./SanityCheck */ \"./src/SanityCheck.js\")(SIP);\n  SIP.DigestAuthentication = __webpack_require__(/*! ./DigestAuthentication */ \"./src/DigestAuthentication.js\")(SIP.Utils);\n  SIP.Grammar = __webpack_require__(/*! ./Grammar */ \"./src/Grammar.js\")(SIP);\n  SIP.Web = {\n    Modifiers: __webpack_require__(/*! ./Web/Modifiers */ \"./src/Web/Modifiers.js\")(SIP),\n    Simple: __webpack_require__(/*! ./Web/Simple */ \"./src/Web/Simple.js\")(SIP)\n  };\n\n  return SIP;\n};\n\n//# sourceURL=webpack://SIP/./src/SIP.js?");

/***/ }),

/***/ "./src/SIPMessage.js":
/*!***************************!*\
  !*** ./src/SIPMessage.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP Message\n */\n\nmodule.exports = function (SIP) {\n  var OutgoingRequest, IncomingMessage, IncomingRequest, IncomingResponse;\n\n  function getSupportedHeader(request) {\n    var allowUnregistered = request.ua.configuration.hackAllowUnregisteredOptionTags;\n    var optionTags = [];\n    var optionTagSet = {};\n\n    if (request.method === SIP.C.REGISTER) {\n      optionTags.push('path', 'gruu');\n    } else if (request.method === SIP.C.INVITE && (request.ua.contact.pub_gruu || request.ua.contact.temp_gruu)) {\n      optionTags.push('gruu');\n    }\n\n    if (request.ua.configuration.rel100 === SIP.C.supported.SUPPORTED) {\n      optionTags.push('100rel');\n    }\n    if (request.ua.configuration.replaces === SIP.C.supported.SUPPORTED) {\n      optionTags.push('replaces');\n    }\n\n    optionTags.push('outbound');\n\n    optionTags = optionTags.concat(request.ua.configuration.extraSupported);\n\n    optionTags = optionTags.filter(function (optionTag) {\n      var registered = SIP.C.OPTION_TAGS[optionTag];\n      var unique = !optionTagSet[optionTag];\n      optionTagSet[optionTag] = true;\n      return (registered || allowUnregistered) && unique;\n    });\n\n    return 'Supported: ' + optionTags.join(', ') + '\\r\\n';\n  }\n\n  /**\n   * @augments SIP\n   * @class Class for outgoing SIP request.\n   * @param {String} method request method\n   * @param {String} ruri request uri\n   * @param {SIP.UA} ua\n   * @param {Object} params parameters that will have priority over ua.configuration parameters:\n   * <br>\n   *  - cseq, call_id, from_tag, from_uri, from_displayName, to_uri, to_tag, route_set\n   * @param {Object} [headers] extra headers\n   * @param {String} [body]\n   */\n  OutgoingRequest = function OutgoingRequest(method, ruri, ua, params, extraHeaders, body) {\n    var to, from, call_id, cseq, to_uri, from_uri;\n\n    params = params || {};\n\n    // Mandatory parameters check\n    if (!method || !ruri || !ua) {\n      return null;\n    }\n\n    this.logger = ua.getLogger('sip.sipmessage');\n    this.ua = ua;\n    this.headers = {};\n    this.method = method;\n    this.ruri = ruri;\n    this.body = body;\n    this.extraHeaders = (extraHeaders || []).slice();\n    this.statusCode = params.status_code;\n    this.reasonPhrase = params.reason_phrase;\n\n    // Fill the Common SIP Request Headers\n\n    // Route\n    if (params.route_set) {\n      this.setHeader('route', params.route_set);\n    } else if (ua.configuration.usePreloadedRoute) {\n      this.setHeader('route', ua.transport.server.sip_uri);\n    }\n\n    // Via\n    // Empty Via header. Will be filled by the client transaction.\n    this.setHeader('via', '');\n\n    // Max-Forwards\n    this.setHeader('max-forwards', SIP.UA.C.MAX_FORWARDS);\n\n    // To\n    to_uri = params.to_uri || ruri;\n    to = params.to_displayName || params.to_displayName === 0 ? '\"' + params.to_displayName + '\" ' : '';\n    to += '<' + (to_uri && to_uri.toRaw ? to_uri.toRaw() : to_uri) + '>';\n    to += params.to_tag ? ';tag=' + params.to_tag : '';\n    this.to = new SIP.NameAddrHeader.parse(to);\n    this.setHeader('to', to);\n\n    // From\n    from_uri = params.from_uri || ua.configuration.uri;\n    if (params.from_displayName || params.from_displayName === 0) {\n      from = '\"' + params.from_displayName + '\" ';\n    } else if (ua.configuration.displayName) {\n      from = '\"' + ua.configuration.displayName + '\" ';\n    } else {\n      from = '';\n    }\n    from += '<' + (from_uri && from_uri.toRaw ? from_uri.toRaw() : from_uri) + '>;tag=';\n    from += params.from_tag || SIP.Utils.newTag();\n    this.from = new SIP.NameAddrHeader.parse(from);\n    this.setHeader('from', from);\n\n    // Call-ID\n    call_id = params.call_id || ua.configuration.sipjsId + SIP.Utils.createRandomToken(15);\n    this.call_id = call_id;\n    this.setHeader('call-id', call_id);\n\n    // CSeq\n    cseq = params.cseq || Math.floor(Math.random() * 10000);\n    this.cseq = cseq;\n    this.setHeader('cseq', cseq + ' ' + method);\n  };\n\n  OutgoingRequest.prototype = {\n    /**\n     * Replace the the given header by the given value.\n     * @param {String} name header name\n     * @param {String | Array} value header value\n     */\n    setHeader: function setHeader(name, value) {\n      this.headers[SIP.Utils.headerize(name)] = value instanceof Array ? value : [value];\n    },\n\n    /**\n     * Get the value of the given header name at the given position.\n     * @param {String} name header name\n     * @returns {String|undefined} Returns the specified header, undefined if header doesn't exist.\n     */\n    getHeader: function getHeader(name) {\n      var regexp,\n          idx,\n          length = this.extraHeaders.length,\n          header = this.headers[SIP.Utils.headerize(name)];\n\n      if (header) {\n        if (header[0]) {\n          return header[0];\n        }\n      } else {\n        regexp = new RegExp('^\\\\s*' + name + '\\\\s*:', 'i');\n        for (idx = 0; idx < length; idx++) {\n          header = this.extraHeaders[idx];\n          if (regexp.test(header)) {\n            return header.substring(header.indexOf(':') + 1).trim();\n          }\n        }\n      }\n\n      return;\n    },\n\n    /**\n     * Get the header/s of the given name.\n     * @param {String} name header name\n     * @returns {Array} Array with all the headers of the specified name.\n     */\n    getHeaders: function getHeaders(name) {\n      var idx,\n          length,\n          regexp,\n          header = this.headers[SIP.Utils.headerize(name)],\n          result = [];\n\n      if (header) {\n        length = header.length;\n        for (idx = 0; idx < length; idx++) {\n          result.push(header[idx]);\n        }\n        return result;\n      } else {\n        length = this.extraHeaders.length;\n        regexp = new RegExp('^\\\\s*' + name + '\\\\s*:', 'i');\n        for (idx = 0; idx < length; idx++) {\n          header = this.extraHeaders[idx];\n          if (regexp.test(header)) {\n            result.push(header.substring(header.indexOf(':') + 1).trim());\n          }\n        }\n        return result;\n      }\n    },\n\n    /**\n     * Verify the existence of the given header.\n     * @param {String} name header name\n     * @returns {boolean} true if header with given name exists, false otherwise\n     */\n    hasHeader: function hasHeader(name) {\n      var regexp,\n          idx,\n          length = this.extraHeaders.length;\n\n      if (this.headers[SIP.Utils.headerize(name)]) {\n        return true;\n      } else {\n        regexp = new RegExp('^\\\\s*' + name + '\\\\s*:', 'i');\n        for (idx = 0; idx < length; idx++) {\n          if (regexp.test(this.extraHeaders[idx])) {\n            return true;\n          }\n        }\n      }\n\n      return false;\n    },\n\n    toString: function toString() {\n      var msg = '',\n          header,\n          length,\n          idx;\n\n      msg += this.method + ' ' + (this.ruri.toRaw ? this.ruri.toRaw() : this.ruri) + ' SIP/2.0\\r\\n';\n\n      for (header in this.headers) {\n        length = this.headers[header].length;\n        for (idx = 0; idx < length; idx++) {\n          msg += header + ': ' + this.headers[header][idx] + '\\r\\n';\n        }\n      }\n\n      length = this.extraHeaders.length;\n      for (idx = 0; idx < length; idx++) {\n        msg += this.extraHeaders[idx].trim() + '\\r\\n';\n      }\n\n      msg += getSupportedHeader(this);\n      msg += 'User-Agent: ' + this.ua.configuration.userAgentString + '\\r\\n';\n\n      if (this.body) {\n        if (typeof this.body === 'string') {\n          length = SIP.Utils.str_utf8_length(this.body);\n          msg += 'Content-Length: ' + length + '\\r\\n\\r\\n';\n          msg += this.body;\n        } else {\n          if (this.body.body && this.body.contentType) {\n            length = SIP.Utils.str_utf8_length(this.body.body);\n            msg += 'Content-Type: ' + this.body.contentType + '\\r\\n';\n            msg += 'Content-Length: ' + length + '\\r\\n\\r\\n';\n            msg += this.body.body;\n          } else {\n            msg += 'Content-Length: ' + 0 + '\\r\\n\\r\\n';\n          }\n        }\n      } else {\n        msg += 'Content-Length: ' + 0 + '\\r\\n\\r\\n';\n      }\n\n      return msg;\n    }\n  };\n\n  /**\n   * @augments SIP\n   * @class Class for incoming SIP message.\n   */\n  IncomingMessage = function IncomingMessage() {\n    this.data = null;\n    this.headers = null;\n    this.method = null;\n    this.via = null;\n    this.via_branch = null;\n    this.call_id = null;\n    this.cseq = null;\n    this.from = null;\n    this.from_tag = null;\n    this.to = null;\n    this.to_tag = null;\n    this.body = null;\n  };\n\n  IncomingMessage.prototype = {\n    /**\n    * Insert a header of the given name and value into the last position of the\n    * header array.\n    * @param {String} name header name\n    * @param {String} value header value\n    */\n    addHeader: function addHeader(name, value) {\n      var header = { raw: value };\n\n      name = SIP.Utils.headerize(name);\n\n      if (this.headers[name]) {\n        this.headers[name].push(header);\n      } else {\n        this.headers[name] = [header];\n      }\n    },\n\n    /**\n     * Get the value of the given header name at the given position.\n     * @param {String} name header name\n     * @returns {String|undefined} Returns the specified header, null if header doesn't exist.\n     */\n    getHeader: function getHeader(name) {\n      var header = this.headers[SIP.Utils.headerize(name)];\n\n      if (header) {\n        if (header[0]) {\n          return header[0].raw;\n        }\n      } else {\n        return;\n      }\n    },\n\n    /**\n     * Get the header/s of the given name.\n     * @param {String} name header name\n     * @returns {Array} Array with all the headers of the specified name.\n     */\n    getHeaders: function getHeaders(name) {\n      var idx,\n          length,\n          header = this.headers[SIP.Utils.headerize(name)],\n          result = [];\n\n      if (!header) {\n        return [];\n      }\n\n      length = header.length;\n      for (idx = 0; idx < length; idx++) {\n        result.push(header[idx].raw);\n      }\n\n      return result;\n    },\n\n    /**\n     * Verify the existence of the given header.\n     * @param {String} name header name\n     * @returns {boolean} true if header with given name exists, false otherwise\n     */\n    hasHeader: function hasHeader(name) {\n      return this.headers[SIP.Utils.headerize(name)] ? true : false;\n    },\n\n    /**\n    * Parse the given header on the given index.\n    * @param {String} name header name\n    * @param {Number} [idx=0] header index\n    * @returns {Object|undefined} Parsed header object, undefined if the header is not present or in case of a parsing error.\n    */\n    parseHeader: function parseHeader(name, idx) {\n      var header, value, parsed;\n\n      name = SIP.Utils.headerize(name);\n\n      idx = idx || 0;\n\n      if (!this.headers[name]) {\n        this.logger.log('header \"' + name + '\" not present');\n        return;\n      } else if (idx >= this.headers[name].length) {\n        this.logger.log('not so many \"' + name + '\" headers present');\n        return;\n      }\n\n      header = this.headers[name][idx];\n      value = header.raw;\n\n      if (header.parsed) {\n        return header.parsed;\n      }\n\n      //substitute '-' by '_' for grammar rule matching.\n      parsed = SIP.Grammar.parse(value, name.replace(/-/g, '_'));\n\n      if (parsed === -1) {\n        this.headers[name].splice(idx, 1); //delete from headers\n        this.logger.warn('error parsing \"' + name + '\" header field with value \"' + value + '\"');\n        return;\n      } else {\n        header.parsed = parsed;\n        return parsed;\n      }\n    },\n\n    /**\n     * Message Header attribute selector. Alias of parseHeader.\n     * @param {String} name header name\n     * @param {Number} [idx=0] header index\n     * @returns {Object|undefined} Parsed header object, undefined if the header is not present or in case of a parsing error.\n     *\n     * @example\n     * message.s('via',3).port\n     */\n    s: function s(name, idx) {\n      return this.parseHeader(name, idx);\n    },\n\n    /**\n    * Replace the value of the given header by the value.\n    * @param {String} name header name\n    * @param {String} value header value\n    */\n    setHeader: function setHeader(name, value) {\n      var header = { raw: value };\n      this.headers[SIP.Utils.headerize(name)] = [header];\n    },\n\n    toString: function toString() {\n      return this.data;\n    }\n  };\n\n  /**\n   * @augments IncomingMessage\n   * @class Class for incoming SIP request.\n   */\n  IncomingRequest = function IncomingRequest(ua) {\n    this.logger = ua.getLogger('sip.sipmessage');\n    this.ua = ua;\n    this.headers = {};\n    this.ruri = null;\n    this.transport = null;\n    this.server_transaction = null;\n  };\n  IncomingRequest.prototype = new IncomingMessage();\n\n  /**\n  * Stateful reply.\n  * @param {Number} code status code\n  * @param {String} reason reason phrase\n  * @param {Object} headers extra headers\n  * @param {String} body body\n  * @param {Function} [onSuccess] onSuccess callback\n  * @param {Function} [onFailure] onFailure callback\n  */\n  // TODO: Get rid of callbacks and make promise based\n  IncomingRequest.prototype.reply = function (code, reason, extraHeaders, body, onSuccess, onFailure) {\n    var rr,\n        vias,\n        length,\n        idx,\n        response,\n        to = this.getHeader('To'),\n        r = 0,\n        v = 0;\n\n    response = SIP.Utils.buildStatusLine(code, reason);\n    extraHeaders = (extraHeaders || []).slice();\n\n    if (this.method === SIP.C.INVITE && code > 100 && code <= 200) {\n      rr = this.getHeaders('record-route');\n      length = rr.length;\n\n      for (r; r < length; r++) {\n        response += 'Record-Route: ' + rr[r] + '\\r\\n';\n      }\n    }\n\n    vias = this.getHeaders('via');\n    length = vias.length;\n\n    for (v; v < length; v++) {\n      response += 'Via: ' + vias[v] + '\\r\\n';\n    }\n\n    if (!this.to_tag && code > 100) {\n      to += ';tag=' + SIP.Utils.newTag();\n    } else if (this.to_tag && !this.s('to').hasParam('tag')) {\n      to += ';tag=' + this.to_tag;\n    }\n\n    response += 'To: ' + to + '\\r\\n';\n    response += 'From: ' + this.getHeader('From') + '\\r\\n';\n    response += 'Call-ID: ' + this.call_id + '\\r\\n';\n    response += 'CSeq: ' + this.cseq + ' ' + this.method + '\\r\\n';\n\n    length = extraHeaders.length;\n    for (idx = 0; idx < length; idx++) {\n      response += extraHeaders[idx].trim() + '\\r\\n';\n    }\n\n    response += getSupportedHeader(this);\n    response += 'User-Agent: ' + this.ua.configuration.userAgentString + '\\r\\n';\n\n    if (body) {\n      if (typeof body === 'string') {\n        length = SIP.Utils.str_utf8_length(body);\n        response += 'Content-Type: application/sdp\\r\\n';\n        response += 'Content-Length: ' + length + '\\r\\n\\r\\n';\n        response += body;\n      } else {\n        if (body.body && body.contentType) {\n          length = SIP.Utils.str_utf8_length(body.body);\n          response += 'Content-Type: ' + body.contentType + '\\r\\n';\n          response += 'Content-Length: ' + length + '\\r\\n\\r\\n';\n          response += body.body;\n        } else {\n          response += 'Content-Length: ' + 0 + '\\r\\n\\r\\n';\n        }\n      }\n    } else {\n      response += 'Content-Length: ' + 0 + '\\r\\n\\r\\n';\n    }\n\n    this.server_transaction.receiveResponse(code, response).then(onSuccess, onFailure);\n\n    return response;\n  };\n\n  /**\n  * Stateless reply.\n  * @param {Number} code status code\n  * @param {String} reason reason phrase\n  */\n  IncomingRequest.prototype.reply_sl = function (code, reason) {\n    var to,\n        response,\n        v = 0,\n        vias = this.getHeaders('via'),\n        length = vias.length;\n\n    response = SIP.Utils.buildStatusLine(code, reason);\n\n    for (v; v < length; v++) {\n      response += 'Via: ' + vias[v] + '\\r\\n';\n    }\n\n    to = this.getHeader('To');\n\n    if (!this.to_tag && code > 100) {\n      to += ';tag=' + SIP.Utils.newTag();\n    } else if (this.to_tag && !this.s('to').hasParam('tag')) {\n      to += ';tag=' + this.to_tag;\n    }\n\n    response += 'To: ' + to + '\\r\\n';\n    response += 'From: ' + this.getHeader('From') + '\\r\\n';\n    response += 'Call-ID: ' + this.call_id + '\\r\\n';\n    response += 'CSeq: ' + this.cseq + ' ' + this.method + '\\r\\n';\n    response += 'User-Agent: ' + this.ua.configuration.userAgentString + '\\r\\n';\n    response += 'Content-Length: ' + 0 + '\\r\\n\\r\\n';\n\n    this.transport.send(response);\n  };\n\n  /**\n   * @augments IncomingMessage\n   * @class Class for incoming SIP response.\n   */\n  IncomingResponse = function IncomingResponse(ua) {\n    this.logger = ua.getLogger('sip.sipmessage');\n    this.headers = {};\n    this.status_code = null;\n    this.reason_phrase = null;\n  };\n  IncomingResponse.prototype = new IncomingMessage();\n\n  SIP.OutgoingRequest = OutgoingRequest;\n  SIP.IncomingRequest = IncomingRequest;\n  SIP.IncomingResponse = IncomingResponse;\n};\n\n//# sourceURL=webpack://SIP/./src/SIPMessage.js?");

/***/ }),

/***/ "./src/SanityCheck.js":
/*!****************************!*\
  !*** ./src/SanityCheck.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview Incoming SIP Message Sanity Check\n */\n\n/**\n * SIP message sanity check.\n * @augments SIP\n * @function\n * @param {SIP.IncomingMessage} message\n * @param {SIP.UA} ua\n * @param {SIP.Transport} transport\n * @returns {Boolean}\n */\n\nmodule.exports = function (SIP) {\n  var sanityCheck,\n      requests = [],\n      responses = [],\n      all = [];\n\n  // Reply\n  function reply(status_code, message, transport) {\n    var to,\n        response = SIP.Utils.buildStatusLine(status_code),\n        vias = message.getHeaders('via'),\n        length = vias.length,\n        idx = 0;\n\n    for (idx; idx < length; idx++) {\n      response += \"Via: \" + vias[idx] + \"\\r\\n\";\n    }\n\n    to = message.getHeader('To');\n\n    if (!message.to_tag) {\n      to += ';tag=' + SIP.Utils.newTag();\n    }\n\n    response += \"To: \" + to + \"\\r\\n\";\n    response += \"From: \" + message.getHeader('From') + \"\\r\\n\";\n    response += \"Call-ID: \" + message.call_id + \"\\r\\n\";\n    response += \"CSeq: \" + message.cseq + \" \" + message.method + \"\\r\\n\";\n    response += \"\\r\\n\";\n\n    transport.send(response);\n  }\n\n  /*\n   * Sanity Check for incoming Messages\n   *\n   * Requests:\n   *  - _rfc3261_8_2_2_1_ Receive a Request with a non supported URI scheme\n   *  - _rfc3261_16_3_4_ Receive a Request already sent by us\n   *   Does not look at via sent-by but at sipjsId, which is inserted as\n   *   a prefix in all initial requests generated by the ua\n   *  - _rfc3261_18_3_request_ Body Content-Length\n   *  - _rfc3261_8_2_2_2_ Merged Requests\n   *\n   * Responses:\n   *  - _rfc3261_8_1_3_3_ Multiple Via headers\n   *  - _rfc3261_18_1_2_ sent-by mismatch\n   *  - _rfc3261_18_3_response_ Body Content-Length\n   *\n   * All:\n   *  - Minimum headers in a SIP message\n   */\n\n  // Sanity Check functions for requests\n  function rfc3261_8_2_2_1(message, ua, transport) {\n    if (!message.ruri || message.ruri.scheme !== 'sip') {\n      reply(416, message, transport);\n      return false;\n    }\n  }\n\n  function rfc3261_16_3_4(message, ua, transport) {\n    if (!message.to_tag) {\n      if (message.call_id.substr(0, 5) === ua.configuration.sipjsId) {\n        reply(482, message, transport);\n        return false;\n      }\n    }\n  }\n\n  function rfc3261_18_3_request(message, ua, transport) {\n    var len = SIP.Utils.str_utf8_length(message.body),\n        contentLength = message.getHeader('content-length');\n\n    if (len < contentLength) {\n      reply(400, message, transport);\n      return false;\n    }\n  }\n\n  function rfc3261_8_2_2_2(message, ua, transport) {\n    var tr,\n        idx,\n        fromTag = message.from_tag,\n        call_id = message.call_id,\n        cseq = message.cseq;\n\n    if (!message.to_tag) {\n      if (message.method === SIP.C.INVITE) {\n        tr = ua.transactions.ist[message.via_branch];\n        if (tr) {\n          return;\n        } else {\n          for (idx in ua.transactions.ist) {\n            tr = ua.transactions.ist[idx];\n            if (tr.request.from_tag === fromTag && tr.request.call_id === call_id && tr.request.cseq === cseq) {\n              reply(482, message, transport);\n              return false;\n            }\n          }\n        }\n      } else {\n        tr = ua.transactions.nist[message.via_branch];\n        if (tr) {\n          return;\n        } else {\n          for (idx in ua.transactions.nist) {\n            tr = ua.transactions.nist[idx];\n            if (tr.request.from_tag === fromTag && tr.request.call_id === call_id && tr.request.cseq === cseq) {\n              reply(482, message, transport);\n              return false;\n            }\n          }\n        }\n      }\n    }\n  }\n\n  // Sanity Check functions for responses\n  function rfc3261_8_1_3_3(message, ua) {\n    if (message.getHeaders('via').length > 1) {\n      ua.getLogger('sip.sanitycheck').warn('More than one Via header field present in the response. Dropping the response');\n      return false;\n    }\n  }\n\n  function rfc3261_18_1_2(message, ua) {\n    var viaHost = ua.configuration.viaHost;\n    if (message.via.host !== viaHost || message.via.port !== undefined) {\n      ua.getLogger('sip.sanitycheck').warn('Via sent-by in the response does not match UA Via host value. Dropping the response');\n      return false;\n    }\n  }\n\n  function rfc3261_18_3_response(message, ua) {\n    var len = SIP.Utils.str_utf8_length(message.body),\n        contentLength = message.getHeader('content-length');\n\n    if (len < contentLength) {\n      ua.getLogger('sip.sanitycheck').warn('Message body length is lower than the value in Content-Length header field. Dropping the response');\n      return false;\n    }\n  }\n\n  // Sanity Check functions for requests and responses\n  function minimumHeaders(message, ua) {\n    var mandatoryHeaders = ['from', 'to', 'call_id', 'cseq', 'via'],\n        idx = mandatoryHeaders.length;\n\n    while (idx--) {\n      if (!message.hasHeader(mandatoryHeaders[idx])) {\n        ua.getLogger('sip.sanitycheck').warn('Missing mandatory header field : ' + mandatoryHeaders[idx] + '. Dropping the response');\n        return false;\n      }\n    }\n  }\n\n  requests.push(rfc3261_8_2_2_1);\n  requests.push(rfc3261_16_3_4);\n  requests.push(rfc3261_18_3_request);\n  requests.push(rfc3261_8_2_2_2);\n\n  responses.push(rfc3261_8_1_3_3);\n  responses.push(rfc3261_18_1_2);\n  responses.push(rfc3261_18_3_response);\n\n  all.push(minimumHeaders);\n\n  sanityCheck = function sanityCheck(message, ua, transport) {\n    var len, pass;\n\n    len = all.length;\n    while (len--) {\n      pass = all[len](message, ua, transport);\n      if (pass === false) {\n        return false;\n      }\n    }\n\n    if (message instanceof SIP.IncomingRequest) {\n      len = requests.length;\n      while (len--) {\n        pass = requests[len](message, ua, transport);\n        if (pass === false) {\n          return false;\n        }\n      }\n    } else if (message instanceof SIP.IncomingResponse) {\n      len = responses.length;\n      while (len--) {\n        pass = responses[len](message, ua, transport);\n        if (pass === false) {\n          return false;\n        }\n      }\n    }\n\n    //Everything is OK\n    return true;\n  };\n\n  SIP.sanityCheck = sanityCheck;\n};\n\n//# sourceURL=webpack://SIP/./src/SanityCheck.js?");

/***/ }),

/***/ "./src/ServerContext.js":
/*!******************************!*\
  !*** ./src/ServerContext.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (SIP) {\n  var ServerContext;\n\n  ServerContext = function ServerContext(ua, request) {\n    this.ua = ua;\n    this.logger = ua.getLogger('sip.servercontext');\n    this.request = request;\n    if (request.method === SIP.C.INVITE) {\n      this.transaction = new SIP.Transactions.InviteServerTransaction(request, ua);\n    } else {\n      this.transaction = new SIP.Transactions.NonInviteServerTransaction(request, ua);\n    }\n\n    if (request.body) {\n      this.body = request.body;\n    }\n    if (request.hasHeader('Content-Type')) {\n      this.contentType = request.getHeader('Content-Type');\n    }\n    this.method = request.method;\n\n    this.data = {};\n\n    this.localIdentity = request.to;\n    this.remoteIdentity = request.from;\n    if (request.hasHeader('P-Asserted-Identity')) {\n      this.assertedIdentity = new SIP.NameAddrHeader.parse(request.getHeader('P-Asserted-Identity'));\n    }\n  };\n\n  ServerContext.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  ServerContext.prototype.progress = function (options) {\n    options = Object.create(options || Object.prototype);\n    options.statusCode || (options.statusCode = 180);\n    options.minCode = 100;\n    options.maxCode = 199;\n    options.events = ['progress'];\n    return this.reply(options);\n  };\n\n  ServerContext.prototype.accept = function (options) {\n    options = Object.create(options || Object.prototype);\n    options.statusCode || (options.statusCode = 200);\n    options.minCode = 200;\n    options.maxCode = 299;\n    options.events = ['accepted'];\n    return this.reply(options);\n  };\n\n  ServerContext.prototype.reject = function (options) {\n    options = Object.create(options || Object.prototype);\n    options.statusCode || (options.statusCode = 480);\n    options.minCode = 300;\n    options.maxCode = 699;\n    options.events = ['rejected', 'failed'];\n    return this.reply(options);\n  };\n\n  ServerContext.prototype.reply = function (options) {\n    options = options || {}; // This is okay, so long as we treat options as read-only in this method\n    var statusCode = options.statusCode || 100,\n        minCode = options.minCode || 100,\n        maxCode = options.maxCode || 699,\n        reasonPhrase = SIP.Utils.getReasonPhrase(statusCode, options.reasonPhrase),\n        extraHeaders = options.extraHeaders || [],\n        body = options.body,\n        events = options.events || [],\n        response;\n\n    if (statusCode < minCode || statusCode > maxCode) {\n      throw new TypeError('Invalid statusCode: ' + statusCode);\n    }\n    response = this.request.reply(statusCode, reasonPhrase, extraHeaders, body);\n    events.forEach(function (event) {\n      this.emit(event, response, reasonPhrase);\n    }, this);\n\n    return this;\n  };\n\n  ServerContext.prototype.onRequestTimeout = function () {\n    this.emit('failed', null, SIP.C.causes.REQUEST_TIMEOUT);\n  };\n\n  ServerContext.prototype.onTransportError = function () {\n    this.emit('failed', null, SIP.C.causes.CONNECTION_ERROR);\n  };\n\n  SIP.ServerContext = ServerContext;\n};\n\n//# sourceURL=webpack://SIP/./src/ServerContext.js?");

/***/ }),

/***/ "./src/Session.js":
/*!************************!*\
  !*** ./src/Session.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (SIP) {\n\n  var DTMF = __webpack_require__(/*! ./Session/DTMF */ \"./src/Session/DTMF.js\")(SIP);\n  var SessionDescriptionHandlerObserver = __webpack_require__(/*! ./SessionDescriptionHandlerObserver */ \"./src/SessionDescriptionHandlerObserver.js\");\n\n  var Session,\n      InviteServerContext,\n      InviteClientContext,\n      ReferServerContext,\n      ReferClientContext,\n      C = {\n    //Session states\n    STATUS_NULL: 0,\n    STATUS_INVITE_SENT: 1,\n    STATUS_1XX_RECEIVED: 2,\n    STATUS_INVITE_RECEIVED: 3,\n    STATUS_WAITING_FOR_ANSWER: 4,\n    STATUS_ANSWERED: 5,\n    STATUS_WAITING_FOR_PRACK: 6,\n    STATUS_WAITING_FOR_ACK: 7,\n    STATUS_CANCELED: 8,\n    STATUS_TERMINATED: 9,\n    STATUS_ANSWERED_WAITING_FOR_PRACK: 10,\n    STATUS_EARLY_MEDIA: 11,\n    STATUS_CONFIRMED: 12\n  };\n\n  /*\n   * @param {function returning SIP.sessionDescriptionHandler} [sessionDescriptionHandlerFactory]\n   *        (See the documentation for the sessionDescriptionHandlerFactory argument of the UA constructor.)\n   */\n  Session = function Session(sessionDescriptionHandlerFactory) {\n    this.status = C.STATUS_NULL;\n    this.dialog = null;\n    this.pendingReinvite = false;\n    this.earlyDialogs = {};\n    if (!sessionDescriptionHandlerFactory) {\n      throw new SIP.Exceptions.SessionDescriptionHandlerMissing('A session description handler is required for the session to function');\n    }\n    this.sessionDescriptionHandlerFactory = sessionDescriptionHandlerFactory;\n\n    this.hasOffer = false;\n    this.hasAnswer = false;\n\n    // Session Timers\n    this.timers = {\n      ackTimer: null,\n      expiresTimer: null,\n      invite2xxTimer: null,\n      userNoAnswerTimer: null,\n      rel1xxTimer: null,\n      prackTimer: null\n    };\n\n    // Session info\n    this.startTime = null;\n    this.endTime = null;\n    this.tones = null;\n\n    // Hold state\n    this.local_hold = false;\n\n    // Flag to disable renegotiation. When set to true, it will not renegotiate\n    // and will throw a RENEGOTIATION_ERROR\n    this.disableRenegotiation = false;\n\n    this.early_sdp = null;\n    this.rel100 = SIP.C.supported.UNSUPPORTED;\n  };\n\n  Session.prototype = {\n    dtmf: function dtmf(tones, options) {\n      var tone,\n          dtmfs = [],\n          self = this,\n          dtmfType = this.ua.configuration.dtmfType;\n\n      options = options || {};\n\n      if (tones === undefined) {\n        throw new TypeError('Not enough arguments');\n      }\n\n      // Check Session Status\n      if (this.status !== C.STATUS_CONFIRMED && this.status !== C.STATUS_WAITING_FOR_ACK) {\n        throw new SIP.Exceptions.InvalidStateError(this.status);\n      }\n\n      // Check tones\n      if (typeof tones !== 'string' && typeof tones !== 'number' || !tones.toString().match(/^[0-9A-D#*,]+$/i)) {\n        throw new TypeError('Invalid tones: ' + tones);\n      }\n\n      var sendDTMF = function sendDTMF() {\n        var dtmf, timeout;\n\n        if (self.status === C.STATUS_TERMINATED || !self.tones || self.tones.length === 0) {\n          // Stop sending DTMF\n          self.tones = null;\n          return this;\n        }\n\n        dtmf = self.tones.shift();\n\n        if (tone === ',') {\n          timeout = 2000;\n        } else {\n          dtmf.on('failed', function () {\n            self.tones = null;\n          });\n          dtmf.send(options);\n          timeout = dtmf.duration + dtmf.interToneGap;\n        }\n\n        // Set timeout for the next tone\n        SIP.Timers.setTimeout(sendDTMF, timeout);\n      };\n\n      tones = tones.toString();\n      if (dtmfType === SIP.C.dtmfType.RTP) {\n        var sent = this.sessionDescriptionHandler.sendDtmf(tones, options);\n        if (!sent) {\n          this.logger.warn(\"Attempt to use dtmfType 'RTP' has failed, falling back to INFO packet method\");\n          dtmfType = SIP.C.dtmfType.INFO;\n        }\n      }\n      if (dtmfType === SIP.C.dtmfType.INFO) {\n        tones = tones.split('');\n        while (tones.length > 0) {\n          dtmfs.push(new DTMF(this, tones.shift(), options));\n        }\n\n        if (this.tones) {\n          // Tones are already queued, just add to the queue\n          this.tones = this.tones.concat(dtmfs);\n          return this;\n        }\n        this.tones = dtmfs;\n        sendDTMF();\n      }\n      return this;\n    },\n\n    bye: function bye(options) {\n      options = Object.create(options || Object.prototype);\n      var statusCode = options.statusCode;\n\n      // Check Session Status\n      if (this.status === C.STATUS_TERMINATED) {\n        this.logger.error('Error: Attempted to send BYE in a terminated session.');\n        return this;\n      }\n\n      this.logger.log('terminating Session');\n\n      if (statusCode && (statusCode < 200 || statusCode >= 700)) {\n        throw new TypeError('Invalid statusCode: ' + statusCode);\n      }\n\n      options.receiveResponse = function () {};\n\n      return this.sendRequest(SIP.C.BYE, options).terminated();\n    },\n\n    refer: function refer(target, options) {\n      options = options || {};\n\n      // Check Session Status\n      if (this.status !== C.STATUS_CONFIRMED) {\n        throw new SIP.Exceptions.InvalidStateError(this.status);\n      }\n\n      this.referContext = new SIP.ReferClientContext(this.ua, this, target, options);\n\n      this.emit('referRequested', this.referContext);\n\n      this.referContext.refer();\n    },\n\n    sendRequest: function sendRequest(method, options) {\n      options = options || {};\n      var self = this;\n\n      var request = new SIP.OutgoingRequest(method, this.dialog.remote_target, this.ua, {\n        cseq: options.cseq || (this.dialog.local_seqnum += 1),\n        call_id: this.dialog.id.call_id,\n        from_uri: this.dialog.local_uri,\n        from_tag: this.dialog.id.local_tag,\n        to_uri: this.dialog.remote_uri,\n        to_tag: this.dialog.id.remote_tag,\n        route_set: this.dialog.route_set,\n        statusCode: options.statusCode,\n        reasonPhrase: options.reasonPhrase\n      }, options.extraHeaders || [], options.body);\n\n      new SIP.RequestSender({\n        request: request,\n        onRequestTimeout: function onRequestTimeout() {\n          self.onRequestTimeout();\n        },\n        onTransportError: function onTransportError() {\n          self.onTransportError();\n        },\n        receiveResponse: options.receiveResponse || function (response) {\n          self.receiveNonInviteResponse(response);\n        }\n      }, this.ua).send();\n\n      // Emit the request event\n      this.emit(method.toLowerCase(), request);\n\n      return this;\n    },\n\n    close: function close() {\n      var idx;\n\n      if (this.status === C.STATUS_TERMINATED) {\n        return this;\n      }\n\n      this.logger.log('closing INVITE session ' + this.id);\n\n      // 1st Step. Terminate media.\n      if (this.sessionDescriptionHandler) {\n        this.sessionDescriptionHandler.close();\n      }\n\n      // 2nd Step. Terminate signaling.\n\n      // Clear session timers\n      for (idx in this.timers) {\n        SIP.Timers.clearTimeout(this.timers[idx]);\n      }\n\n      // Terminate dialogs\n\n      // Terminate confirmed dialog\n      if (this.dialog) {\n        this.dialog.terminate();\n        delete this.dialog;\n      }\n\n      // Terminate early dialogs\n      for (idx in this.earlyDialogs) {\n        this.earlyDialogs[idx].terminate();\n        delete this.earlyDialogs[idx];\n      }\n\n      this.status = C.STATUS_TERMINATED;\n\n      delete this.ua.sessions[this.id];\n      return this;\n    },\n\n    createDialog: function createDialog(message, type, early) {\n      var dialog,\n          early_dialog,\n          local_tag = message[type === 'UAS' ? 'to_tag' : 'from_tag'],\n          remote_tag = message[type === 'UAS' ? 'from_tag' : 'to_tag'],\n          id = message.call_id + local_tag + remote_tag;\n\n      early_dialog = this.earlyDialogs[id];\n\n      // Early Dialog\n      if (early) {\n        if (early_dialog) {\n          return true;\n        } else {\n          early_dialog = new SIP.Dialog(this, message, type, SIP.Dialog.C.STATUS_EARLY);\n\n          // Dialog has been successfully created.\n          if (early_dialog.error) {\n            this.logger.error(early_dialog.error);\n            this.failed(message, SIP.C.causes.INTERNAL_ERROR);\n            return false;\n          } else {\n            this.earlyDialogs[id] = early_dialog;\n            return true;\n          }\n        }\n      }\n      // Confirmed Dialog\n      else {\n          // In case the dialog is in _early_ state, update it\n          if (early_dialog) {\n            early_dialog.update(message, type);\n            this.dialog = early_dialog;\n            delete this.earlyDialogs[id];\n            for (var dia in this.earlyDialogs) {\n              this.earlyDialogs[dia].terminate();\n              delete this.earlyDialogs[dia];\n            }\n            return true;\n          }\n\n          // Otherwise, create a _confirmed_ dialog\n          dialog = new SIP.Dialog(this, message, type);\n\n          if (dialog.error) {\n            this.logger.error(dialog.error);\n            this.failed(message, SIP.C.causes.INTERNAL_ERROR);\n            return false;\n          } else {\n            this.to_tag = message.to_tag;\n            this.dialog = dialog;\n            return true;\n          }\n        }\n    },\n\n    /**\n     * Hold\n     */\n    hold: function hold(options, modifiers) {\n\n      if (this.status !== C.STATUS_WAITING_FOR_ACK && this.status !== C.STATUS_CONFIRMED) {\n        throw new SIP.Exceptions.InvalidStateError(this.status);\n      }\n\n      if (this.local_hold) {\n        this.logger.log('Session is already on hold, cannot put it on hold again');\n        return;\n      }\n\n      options = options || {};\n      options.modifiers = modifiers || [];\n      options.modifiers.push(this.sessionDescriptionHandler.holdModifier);\n\n      this.local_hold = true;\n\n      this.sendReinvite(options);\n    },\n\n    /**\n     * Unhold\n     */\n    unhold: function unhold(options, modifiers) {\n\n      if (this.status !== C.STATUS_WAITING_FOR_ACK && this.status !== C.STATUS_CONFIRMED) {\n        throw new SIP.Exceptions.InvalidStateError(this.status);\n      }\n\n      if (!this.local_hold) {\n        this.logger.log('Session is not on hold, cannot unhold it');\n        return;\n      }\n\n      options = options || {};\n\n      if (modifiers) {\n        options.modifiers = modifiers;\n      }\n\n      this.local_hold = false;\n\n      this.sendReinvite(options);\n    },\n\n    reinvite: function reinvite(options, modifiers) {\n      options = options || {};\n\n      if (modifiers) {\n        options.modifiers = modifiers;\n      }\n\n      return this.sendReinvite(options);\n    },\n\n    /**\n     * In dialog INVITE Reception\n     * @private\n     */\n    receiveReinvite: function receiveReinvite(request) {\n      var self = this,\n          promise;\n      // TODO: Should probably check state of the session\n\n      self.emit('reinvite', this);\n\n      if (request.hasHeader('P-Asserted-Identity')) {\n        this.assertedIdentity = new SIP.NameAddrHeader.parse(request.getHeader('P-Asserted-Identity'));\n      }\n\n      // Invite w/o SDP\n      if (request.getHeader('Content-Length') === '0' && !request.getHeader('Content-Type')) {\n        promise = this.sessionDescriptionHandler.getDescription(this.sessionDescriptionHandlerOptions, this.modifiers);\n\n        // Invite w/ SDP\n      } else if (this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))) {\n        promise = this.sessionDescriptionHandler.setDescription(request.body, this.sessionDescriptionHandlerOptions, this.modifiers).then(this.sessionDescriptionHandler.getDescription.bind(this.sessionDescriptionHandler, this.sessionDescriptionHandlerOptions, this.modifiers));\n\n        // Bad Packet (should never get hit)\n      } else {\n        request.reply(415);\n        this.emit('reinviteFailed', self);\n        return;\n      }\n\n      this.receiveRequest = function (request) {\n        if (request.method === SIP.C.ACK && this.status === C.STATUS_WAITING_FOR_ACK) {\n          if (this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))) {\n            this.hasAnswer = true;\n            this.sessionDescriptionHandler.setDescription(request.body, this.sessionDescriptionHandlerOptions, this.modifiers).then(function () {\n              SIP.Timers.clearTimeout(this.timers.ackTimer);\n              SIP.Timers.clearTimeout(this.timers.invite2xxTimer);\n              this.status = C.STATUS_CONFIRMED;\n\n              this.emit('confirmed', request);\n            }.bind(this));\n          } else {\n            SIP.Timers.clearTimeout(this.timers.ackTimer);\n            SIP.Timers.clearTimeout(this.timers.invite2xxTimer);\n            this.status = C.STATUS_CONFIRMED;\n\n            this.emit('confirmed', request);\n          }\n        } else {\n          SIP.Session.prototype.receiveRequest.apply(this, [request]);\n        }\n      }.bind(this);\n\n      promise.catch(function onFailure(e) {\n        var statusCode;\n        if (e instanceof SIP.Exceptions.GetDescriptionError) {\n          statusCode = 500;\n        } else if (e instanceof SIP.Exceptions.RenegotiationError) {\n          self.emit('renegotiationError', e);\n          self.logger.warn(e);\n          statusCode = 488;\n        } else {\n          self.logger.error(e);\n          statusCode = 488;\n        }\n        request.reply(statusCode);\n        self.emit('reinviteFailed', self);\n      }).then(function (description) {\n        var extraHeaders = ['Contact: ' + self.contact];\n        request.reply(200, null, extraHeaders, description, function () {\n          self.status = C.STATUS_WAITING_FOR_ACK;\n\n          self.setACKTimer();\n          self.emit('reinviteAccepted', self);\n        });\n      });\n    },\n\n    sendReinvite: function sendReinvite(options) {\n      if (this.pendingReinvite) {\n        this.logger.warn('Reinvite in progress. Please wait until complete, then try again.');\n        return;\n      }\n      this.pendingReinvite = true;\n      options = options || {};\n      options.modifiers = options.modifiers || [];\n\n      var self = this,\n          extraHeaders = (options.extraHeaders || []).slice();\n\n      extraHeaders.push('Contact: ' + this.contact);\n      extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());\n\n      this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions, options.modifiers).then(function (description) {\n        self.sendRequest(SIP.C.INVITE, {\n          extraHeaders: extraHeaders,\n          body: description,\n          receiveResponse: self.receiveReinviteResponse.bind(self)\n        });\n      }).catch(function onFailure(e) {\n        if (e instanceof SIP.Exceptions.RenegotiationError) {\n          self.pendingReinvite = false;\n          self.emit('renegotiationError', e);\n          self.logger.warn('Renegotiation Error');\n          self.logger.warn(e);\n          return;\n        }\n        self.logger.error('sessionDescriptionHandler error');\n        self.logger.error(e);\n      });\n    },\n\n    receiveRequest: function receiveRequest(request) {\n      switch (request.method) {\n        case SIP.C.BYE:\n          request.reply(200);\n          if (this.status === C.STATUS_CONFIRMED) {\n            this.emit('bye', request);\n            this.terminated(request, SIP.C.causes.BYE);\n          }\n          break;\n        case SIP.C.INVITE:\n          if (this.status === C.STATUS_CONFIRMED) {\n            this.logger.log('re-INVITE received');\n            this.receiveReinvite(request);\n          }\n          break;\n        case SIP.C.INFO:\n          if (this.status === C.STATUS_CONFIRMED || this.status === C.STATUS_WAITING_FOR_ACK) {\n            if (this.onInfo) {\n              return this.onInfo(request);\n            }\n\n            var body,\n                tone,\n                duration,\n                contentType = request.getHeader('content-type'),\n                reg_tone = /^(Signal\\s*?=\\s*?)([0-9A-D#*]{1})(\\s)?.*/,\n                reg_duration = /^(Duration\\s?=\\s?)([0-9]{1,4})(\\s)?.*/;\n\n            if (contentType) {\n              if (contentType.match(/^application\\/dtmf-relay/i)) {\n                if (request.body) {\n                  body = request.body.split('\\r\\n', 2);\n                  if (body.length === 2) {\n                    if (reg_tone.test(body[0])) {\n                      tone = body[0].replace(reg_tone, \"$2\");\n                    }\n                    if (reg_duration.test(body[1])) {\n                      duration = parseInt(body[1].replace(reg_duration, \"$2\"), 10);\n                    }\n                  }\n                }\n\n                new DTMF(this, tone, { duration: duration }).init_incoming(request);\n              } else {\n                request.reply(415, null, [\"Accept: application/dtmf-relay\"]);\n              }\n            }\n          }\n          break;\n        case SIP.C.REFER:\n          if (this.status === C.STATUS_CONFIRMED) {\n            this.logger.log('REFER received');\n            this.referContext = new SIP.ReferServerContext(this.ua, request);\n            var hasReferListener = this.listeners('referRequested').length;\n            if (hasReferListener) {\n              this.emit('referRequested', this.referContext);\n            } else {\n              this.logger.log('No referRequested listeners, automatically accepting and following the refer');\n              var options = { followRefer: true };\n              if (this.passedOptions) {\n                options.inviteOptions = this.passedOptions;\n              }\n              this.referContext.accept(options, this.modifiers);\n            }\n          }\n          break;\n        case SIP.C.NOTIFY:\n          if (this.referContext && this.referContext instanceof SIP.ReferClientContext && request.hasHeader('event') && /^refer(;.*)?$/.test(request.getHeader('event'))) {\n            this.referContext.receiveNotify(request);\n            return;\n          }\n          request.reply(200, 'OK');\n          this.emit('notify', request);\n          break;\n      }\n    },\n\n    /**\n     * Reception of Response for in-dialog INVITE\n     * @private\n     */\n    receiveReinviteResponse: function receiveReinviteResponse(response) {\n      var self = this;\n\n      if (this.status === C.STATUS_TERMINATED) {\n        return;\n      }\n\n      switch (true) {\n        case /^1[0-9]{2}$/.test(response.status_code):\n          break;\n        case /^2[0-9]{2}$/.test(response.status_code):\n          this.status = C.STATUS_CONFIRMED;\n\n          // 17.1.1.1 - For each final response that is received at the client transaction, the client transaction sends an ACK,\n          this.emit(\"ack\", response.transaction.sendACK());\n          this.pendingReinvite = false;\n          // TODO: All of these timers should move into the Transaction layer\n          SIP.Timers.clearTimeout(self.timers.invite2xxTimer);\n          if (!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))) {\n            this.logger.error('2XX response received to re-invite but did not have a description');\n            this.emit('reinviteFailed', self);\n            this.emit('renegotiationError', new SIP.Exceptions.RenegotiationError('2XX response received to re-invite but did not have a description'));\n            break;\n          }\n\n          this.sessionDescriptionHandler.setDescription(response.body, this.sessionDescriptionHandlerOptions, this.modifiers).catch(function onFailure(e) {\n            self.logger.error('Could not set the description in 2XX response');\n            self.logger.error(e);\n            self.emit('reinviteFailed', self);\n            self.emit('renegotiationError', e);\n            self.sendRequest(SIP.C.BYE, {\n              extraHeaders: ['Reason: ' + SIP.Utils.getReasonHeaderValue(488, 'Not Acceptable Here')]\n            });\n            self.terminated(null, SIP.C.causes.INCOMPATIBLE_SDP);\n          }).then(function () {\n            self.emit('reinviteAccepted', self);\n          });\n          break;\n        default:\n          this.disableRenegotiation = true;\n          this.pendingReinvite = false;\n          this.logger.log('Received a non 1XX or 2XX response to a re-invite');\n          this.emit('reinviteFailed', self);\n          this.emit('renegotiationError', new SIP.Exceptions.RenegotiationError('Invalid response to a re-invite'));\n      }\n    },\n\n    acceptAndTerminate: function acceptAndTerminate(response, status_code, reason_phrase) {\n      var extraHeaders = [];\n\n      if (status_code) {\n        extraHeaders.push('Reason: ' + SIP.Utils.getReasonHeaderValue(status_code, reason_phrase));\n      }\n\n      // An error on dialog creation will fire 'failed' event\n      if (this.dialog || this.createDialog(response, 'UAC')) {\n        this.emit(\"ack\", response.transaction.sendACK());\n        this.sendRequest(SIP.C.BYE, {\n          extraHeaders: extraHeaders\n        });\n      }\n\n      return this;\n    },\n\n    /**\n     * RFC3261 13.3.1.4\n     * Response retransmissions cannot be accomplished by transaction layer\n     *  since it is destroyed when receiving the first 2xx answer\n     */\n    setInvite2xxTimer: function setInvite2xxTimer(request, description) {\n      var self = this,\n          timeout = SIP.Timers.T1;\n\n      this.timers.invite2xxTimer = SIP.Timers.setTimeout(function invite2xxRetransmission() {\n        if (self.status !== C.STATUS_WAITING_FOR_ACK) {\n          return;\n        }\n\n        self.logger.log('no ACK received, attempting to retransmit OK');\n\n        var extraHeaders = ['Contact: ' + self.contact];\n\n        request.reply(200, null, extraHeaders, description);\n\n        timeout = Math.min(timeout * 2, SIP.Timers.T2);\n\n        self.timers.invite2xxTimer = SIP.Timers.setTimeout(invite2xxRetransmission, timeout);\n      }, timeout);\n    },\n\n    /**\n     * RFC3261 14.2\n     * If a UAS generates a 2xx response and never receives an ACK,\n     *  it SHOULD generate a BYE to terminate the dialog.\n     */\n    setACKTimer: function setACKTimer() {\n      var self = this;\n\n      this.timers.ackTimer = SIP.Timers.setTimeout(function () {\n        if (self.status === C.STATUS_WAITING_FOR_ACK) {\n          self.logger.log('no ACK received for an extended period of time, terminating the call');\n          SIP.Timers.clearTimeout(self.timers.invite2xxTimer);\n          self.sendRequest(SIP.C.BYE);\n          self.terminated(null, SIP.C.causes.NO_ACK);\n        }\n      }, SIP.Timers.TIMER_H);\n    },\n\n    /*\n     * @private\n     */\n    onTransportError: function onTransportError() {\n      if (this.status !== C.STATUS_CONFIRMED && this.status !== C.STATUS_TERMINATED) {\n        this.failed(null, SIP.C.causes.CONNECTION_ERROR);\n      }\n    },\n\n    onRequestTimeout: function onRequestTimeout() {\n      if (this.status === C.STATUS_CONFIRMED) {\n        this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);\n      } else if (this.status !== C.STATUS_TERMINATED) {\n        this.failed(null, SIP.C.causes.REQUEST_TIMEOUT);\n        this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);\n      }\n    },\n\n    onDialogError: function onDialogError(response) {\n      if (this.status === C.STATUS_CONFIRMED) {\n        this.terminated(response, SIP.C.causes.DIALOG_ERROR);\n      } else if (this.status !== C.STATUS_TERMINATED) {\n        this.failed(response, SIP.C.causes.DIALOG_ERROR);\n        this.terminated(response, SIP.C.causes.DIALOG_ERROR);\n      }\n    },\n\n    /**\n     * @private\n     */\n\n    failed: function failed(response, cause) {\n      if (this.status === C.STATUS_TERMINATED) {\n        return this;\n      }\n      this.emit('failed', response || null, cause || null);\n      return this;\n    },\n\n    rejected: function rejected(response, cause) {\n      this.emit('rejected', response || null, cause || null);\n      return this;\n    },\n\n    canceled: function canceled() {\n      if (this.sessionDescriptionHandler) {\n        this.sessionDescriptionHandler.close();\n      }\n      this.emit('cancel');\n      return this;\n    },\n\n    accepted: function accepted(response, cause) {\n      cause = SIP.Utils.getReasonPhrase(response && response.status_code, cause);\n\n      this.startTime = new Date();\n\n      if (this.replacee) {\n        this.replacee.emit('replaced', this);\n        this.replacee.terminate();\n      }\n      this.emit('accepted', response, cause);\n      return this;\n    },\n\n    terminated: function terminated(message, cause) {\n      if (this.status === C.STATUS_TERMINATED) {\n        return this;\n      }\n\n      this.endTime = new Date();\n\n      this.close();\n      this.emit('terminated', message || null, cause || null);\n      return this;\n    },\n\n    connecting: function connecting(request) {\n      this.emit('connecting', { request: request });\n      return this;\n    }\n  };\n\n  Session.C = C;\n  SIP.Session = Session;\n\n  InviteServerContext = function InviteServerContext(ua, request) {\n    var expires,\n        self = this,\n        contentType = request.getHeader('Content-Type'),\n        contentDisp = request.parseHeader('Content-Disposition');\n\n    SIP.Utils.augment(this, SIP.ServerContext, [ua, request]);\n    SIP.Utils.augment(this, SIP.Session, [ua.configuration.sessionDescriptionHandlerFactory]);\n\n    if (contentDisp && contentDisp.type === 'render') {\n      this.renderbody = request.body;\n      this.rendertype = contentType;\n    }\n\n    this.status = C.STATUS_INVITE_RECEIVED;\n    this.from_tag = request.from_tag;\n    this.id = request.call_id + this.from_tag;\n    this.request = request;\n    this.contact = this.ua.contact.toString();\n\n    this.receiveNonInviteResponse = function () {}; // intentional no-op\n\n    this.logger = ua.getLogger('sip.inviteservercontext', this.id);\n\n    //Save the session into the ua sessions collection.\n    this.ua.sessions[this.id] = this;\n\n    //Get the Expires header value if exists\n    if (request.hasHeader('expires')) {\n      expires = request.getHeader('expires') * 1000;\n    }\n\n    //Set 100rel if necessary\n    function set100rel(h, c) {\n      if (request.hasHeader(h) && request.getHeader(h).toLowerCase().indexOf('100rel') >= 0) {\n        self.rel100 = c;\n      }\n    }\n    set100rel('require', SIP.C.supported.REQUIRED);\n    set100rel('supported', SIP.C.supported.SUPPORTED);\n\n    /* Set the to_tag before\n     * replying a response code that will create a dialog.\n     */\n    request.to_tag = SIP.Utils.newTag();\n\n    // An error on dialog creation will fire 'failed' event\n    if (!this.createDialog(request, 'UAS', true)) {\n      request.reply(500, 'Missing Contact header field');\n      return;\n    }\n\n    var options = { extraHeaders: ['Contact: ' + self.contact] };\n\n    if (self.rel100 !== SIP.C.supported.REQUIRED) {\n      self.progress(options);\n    }\n    self.status = C.STATUS_WAITING_FOR_ANSWER;\n\n    // Set userNoAnswerTimer\n    self.timers.userNoAnswerTimer = SIP.Timers.setTimeout(function () {\n      request.reply(408);\n      self.failed(request, SIP.C.causes.NO_ANSWER);\n      self.terminated(request, SIP.C.causes.NO_ANSWER);\n    }, self.ua.configuration.noAnswerTimeout);\n\n    /* Set expiresTimer\n     * RFC3261 13.3.1\n     */\n    if (expires) {\n      self.timers.expiresTimer = SIP.Timers.setTimeout(function () {\n        if (self.status === C.STATUS_WAITING_FOR_ANSWER) {\n          request.reply(487);\n          self.failed(request, SIP.C.causes.EXPIRES);\n          self.terminated(request, SIP.C.causes.EXPIRES);\n        }\n      }, expires);\n    }\n\n    ua.transport.on('transportError', this.onTransportError.bind(this));\n  };\n\n  InviteServerContext.prototype = Object.create({}, {\n    reject: { writable: true, value: function value(options) {\n        // Check Session Status\n        if (this.status === C.STATUS_TERMINATED) {\n          throw new SIP.Exceptions.InvalidStateError(this.status);\n        }\n\n        this.logger.log('rejecting RTCSession');\n\n        SIP.ServerContext.prototype.reject.call(this, options);\n        return this.terminated();\n      } },\n\n    terminate: { writable: true, value: function value(options) {\n        options = options || {};\n\n        var extraHeaders = (options.extraHeaders || []).slice(),\n            body = options.body,\n            dialog,\n            self = this;\n\n        if (this.status === C.STATUS_WAITING_FOR_ACK && this.request.server_transaction.state !== SIP.Transactions.C.STATUS_TERMINATED) {\n          dialog = this.dialog;\n\n          this.receiveRequest = function (request) {\n            if (request.method === SIP.C.ACK) {\n              this.sendRequest(SIP.C.BYE, {\n                extraHeaders: extraHeaders,\n                body: body\n              });\n              dialog.terminate();\n            }\n          };\n\n          this.request.server_transaction.on('stateChanged', function () {\n            if (this.state === SIP.Transactions.C.STATUS_TERMINATED && this.dialog) {\n              this.request = new SIP.OutgoingRequest(SIP.C.BYE, this.dialog.remote_target, this.ua, {\n                'cseq': this.dialog.local_seqnum += 1,\n                'call_id': this.dialog.id.call_id,\n                'from_uri': this.dialog.local_uri,\n                'from_tag': this.dialog.id.local_tag,\n                'to_uri': this.dialog.remote_uri,\n                'to_tag': this.dialog.id.remote_tag,\n                'route_set': this.dialog.route_set\n              }, extraHeaders, body);\n\n              new SIP.RequestSender({\n                request: this.request,\n                onRequestTimeout: function onRequestTimeout() {\n                  self.onRequestTimeout();\n                },\n                onTransportError: function onTransportError() {\n                  self.onTransportError();\n                },\n                receiveResponse: function receiveResponse() {\n                  return;\n                }\n              }, this.ua).send();\n              dialog.terminate();\n            }\n          });\n\n          this.emit('bye', this.request);\n          this.terminated();\n\n          // Restore the dialog into 'this' in order to be able to send the in-dialog BYE :-)\n          this.dialog = dialog;\n\n          // Restore the dialog into 'ua' so the ACK can reach 'this' session\n          this.ua.dialogs[dialog.id.toString()] = dialog;\n        } else if (this.status === C.STATUS_CONFIRMED) {\n          this.bye(options);\n        } else {\n          this.reject(options);\n        }\n\n        return this;\n      } },\n\n    /*\n     * @param {Object} [options.sessionDescriptionHandlerOptions] gets passed to SIP.SessionDescriptionHandler.getDescription as options\n     */\n    progress: { writable: true, value: function value(options) {\n        options = options || {};\n        var statusCode = options.statusCode || 180,\n            reasonPhrase = options.reasonPhrase,\n            extraHeaders = (options.extraHeaders || []).slice(),\n            body = options.body,\n            response;\n\n        if (statusCode < 100 || statusCode > 199) {\n          throw new TypeError('Invalid statusCode: ' + statusCode);\n        }\n\n        if (this.isCanceled || this.status === C.STATUS_TERMINATED) {\n          return this;\n        }\n\n        function do100rel() {\n          /* jshint validthis: true */\n          statusCode = options.statusCode || 183;\n\n          // Set status and add extra headers\n          this.status = C.STATUS_WAITING_FOR_PRACK;\n          extraHeaders.push('Contact: ' + this.contact);\n          extraHeaders.push('Require: 100rel');\n          extraHeaders.push('RSeq: ' + Math.floor(Math.random() * 10000));\n\n          // Get the session description to add to preaccept with\n          this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions, options.modifiers).then(function onSuccess(description) {\n            if (this.isCanceled || this.status === C.STATUS_TERMINATED) {\n              return;\n            }\n\n            this.early_sdp = description.body;\n            this[this.hasOffer ? 'hasAnswer' : 'hasOffer'] = true;\n\n            // Retransmit until we get a response or we time out (see prackTimer below)\n            var timeout = SIP.Timers.T1;\n            this.timers.rel1xxTimer = SIP.Timers.setTimeout(function rel1xxRetransmission() {\n              this.request.reply(statusCode, null, extraHeaders, description);\n              timeout *= 2;\n              this.timers.rel1xxTimer = SIP.Timers.setTimeout(rel1xxRetransmission.bind(this), timeout);\n            }.bind(this), timeout);\n\n            // Timeout and reject INVITE if no response\n            this.timers.prackTimer = SIP.Timers.setTimeout(function () {\n              if (this.status !== C.STATUS_WAITING_FOR_PRACK) {\n                return;\n              }\n\n              this.logger.log('no PRACK received, rejecting the call');\n              SIP.Timers.clearTimeout(this.timers.rel1xxTimer);\n              this.request.reply(504);\n              this.terminated(null, SIP.C.causes.NO_PRACK);\n            }.bind(this), SIP.Timers.T1 * 64);\n\n            // Send the initial response\n            response = this.request.reply(statusCode, reasonPhrase, extraHeaders, description);\n            this.emit('progress', response, reasonPhrase);\n          }.bind(this), function onFailure() {\n            this.request.reply(480);\n            this.failed(null, SIP.C.causes.WEBRTC_ERROR);\n            this.terminated(null, SIP.C.causes.WEBRTC_ERROR);\n          }.bind(this));\n        } // end do100rel\n\n        function normalReply() {\n          /* jshint validthis:true */\n          response = this.request.reply(statusCode, reasonPhrase, extraHeaders, body);\n          this.emit('progress', response, reasonPhrase);\n        }\n\n        if (options.statusCode !== 100 && (this.rel100 === SIP.C.supported.REQUIRED || this.rel100 === SIP.C.supported.SUPPORTED && options.rel100 || this.rel100 === SIP.C.supported.SUPPORTED && this.ua.configuration.rel100 === SIP.C.supported.REQUIRED)) {\n          this.sessionDescriptionHandler = this.setupSessionDescriptionHandler();\n          this.emit('SessionDescriptionHandler-created', this.sessionDescriptionHandler);\n          if (this.sessionDescriptionHandler.hasDescription(this.request.getHeader('Content-Type'))) {\n            this.hasOffer = true;\n            this.sessionDescriptionHandler.setDescription(this.request.body, options.sessionDescriptionHandlerOptions, options.modifiers).then(do100rel.apply(this)).catch(function onFailure(e) {\n              this.logger.warn('invalid description');\n              this.logger.warn(e);\n              this.failed(null, SIP.C.causes.WEBRTC_ERROR);\n              this.terminated(null, SIP.C.causes.WEBRTC_ERROR);\n            }.bind(this));\n          } else {\n            do100rel.apply(this);\n          }\n        } else {\n          normalReply.apply(this);\n        }\n        return this;\n      } },\n\n    /*\n     * @param {Object} [options.sessionDescriptionHandlerOptions] gets passed to SIP.SessionDescriptionHandler.getDescription as options\n     */\n    accept: { writable: true, value: function value(options) {\n        options = options || {};\n\n        this.onInfo = options.onInfo;\n\n        var self = this,\n            request = this.request,\n            extraHeaders = (options.extraHeaders || []).slice(),\n            descriptionCreationSucceeded = function descriptionCreationSucceeded(description) {\n          var response,\n\n          // run for reply success callback\n          replySucceeded = function replySucceeded() {\n            self.status = C.STATUS_WAITING_FOR_ACK;\n\n            self.setInvite2xxTimer(request, description);\n            self.setACKTimer();\n          },\n\n\n          // run for reply failure callback\n          replyFailed = function replyFailed() {\n            self.failed(null, SIP.C.causes.CONNECTION_ERROR);\n            self.terminated(null, SIP.C.causes.CONNECTION_ERROR);\n          };\n\n          extraHeaders.push('Contact: ' + self.contact);\n          extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());\n\n          if (!self.hasOffer) {\n            self.hasOffer = true;\n          } else {\n            self.hasAnswer = true;\n          }\n          response = request.reply(200, null, extraHeaders, description, replySucceeded, replyFailed);\n          if (self.status !== C.STATUS_TERMINATED) {\n            // Didn't fail\n            self.accepted(response, SIP.Utils.getReasonPhrase(200));\n          }\n        },\n            descriptionCreationFailed = function descriptionCreationFailed() {\n          // TODO: This should check the actual error and make sure it is an\n          //        \"expected\" error. Otherwise it should throw.\n          if (self.status === C.STATUS_TERMINATED) {\n            return;\n          }\n          self.request.reply(480);\n          self.failed(null, SIP.C.causes.WEBRTC_ERROR);\n          self.terminated(null, SIP.C.causes.WEBRTC_ERROR);\n        };\n\n        // Check Session Status\n        if (this.status === C.STATUS_WAITING_FOR_PRACK) {\n          this.status = C.STATUS_ANSWERED_WAITING_FOR_PRACK;\n          return this;\n        } else if (this.status === C.STATUS_WAITING_FOR_ANSWER) {\n          this.status = C.STATUS_ANSWERED;\n        } else if (this.status !== C.STATUS_EARLY_MEDIA) {\n          throw new SIP.Exceptions.InvalidStateError(this.status);\n        }\n\n        // An error on dialog creation will fire 'failed' event\n        if (!this.createDialog(request, 'UAS')) {\n          request.reply(500, 'Missing Contact header field');\n          return this;\n        }\n\n        SIP.Timers.clearTimeout(this.timers.userNoAnswerTimer);\n\n        if (this.status === C.STATUS_EARLY_MEDIA) {\n          descriptionCreationSucceeded({});\n        } else {\n          this.sessionDescriptionHandler = this.setupSessionDescriptionHandler();\n          this.emit('SessionDescriptionHandler-created', this.sessionDescriptionHandler);\n          if (this.request.getHeader('Content-Length') === '0' && !this.request.getHeader('Content-Type')) {\n            this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions, options.modifiers).catch(descriptionCreationFailed).then(descriptionCreationSucceeded);\n          } else if (this.sessionDescriptionHandler.hasDescription(this.request.getHeader('Content-Type'))) {\n            this.hasOffer = true;\n            this.sessionDescriptionHandler.setDescription(this.request.body, options.sessionDescriptionHandlerOptions, options.modifiers).then(function () {\n              return this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions, options.modifiers);\n            }.bind(this)).catch(descriptionCreationFailed).then(descriptionCreationSucceeded);\n          } else {\n            this.request.reply(415);\n            // TODO: Events\n            return;\n          }\n        }\n\n        return this;\n      } },\n\n    receiveRequest: { writable: true, value: function value(request) {\n\n        // ISC RECEIVE REQUEST\n\n        function confirmSession() {\n          /* jshint validthis:true */\n          var contentType, contentDisp;\n\n          SIP.Timers.clearTimeout(this.timers.ackTimer);\n          SIP.Timers.clearTimeout(this.timers.invite2xxTimer);\n          this.status = C.STATUS_CONFIRMED;\n\n          contentType = request.getHeader('Content-Type');\n          contentDisp = request.getHeader('Content-Disposition');\n\n          if (contentDisp && contentDisp.type === 'render') {\n            this.renderbody = request.body;\n            this.rendertype = contentType;\n          }\n\n          this.emit('confirmed', request);\n        }\n\n        switch (request.method) {\n          case SIP.C.CANCEL:\n            /* RFC3261 15 States that a UAS may have accepted an invitation while a CANCEL\n             * was in progress and that the UAC MAY continue with the session established by\n             * any 2xx response, or MAY terminate with BYE. SIP does continue with the\n             * established session. So the CANCEL is processed only if the session is not yet\n             * established.\n             */\n\n            /*\n             * Terminate the whole session in case the user didn't accept (or yet to send the answer) nor reject the\n             *request opening the session.\n             */\n            if (this.status === C.STATUS_WAITING_FOR_ANSWER || this.status === C.STATUS_WAITING_FOR_PRACK || this.status === C.STATUS_ANSWERED_WAITING_FOR_PRACK || this.status === C.STATUS_EARLY_MEDIA || this.status === C.STATUS_ANSWERED) {\n\n              this.status = C.STATUS_CANCELED;\n              this.request.reply(487);\n              this.canceled(request);\n              this.rejected(request, SIP.C.causes.CANCELED);\n              this.failed(request, SIP.C.causes.CANCELED);\n              this.terminated(request, SIP.C.causes.CANCELED);\n            }\n            break;\n          case SIP.C.ACK:\n            if (this.status === C.STATUS_WAITING_FOR_ACK) {\n              if (this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))) {\n                // ACK contains answer to an INVITE w/o SDP negotiation\n                this.hasAnswer = true;\n                this.sessionDescriptionHandler.setDescription(request.body, this.sessionDescriptionHandlerOptions, this.modifiers).then(\n                // TODO: Catch then .then\n                confirmSession.bind(this), function onFailure(e) {\n                  this.logger.warn(e);\n                  this.terminate({\n                    statusCode: '488',\n                    reasonPhrase: 'Bad Media Description'\n                  });\n                  this.failed(request, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                  this.terminated(request, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                }.bind(this));\n              } else {\n                confirmSession.apply(this);\n              }\n            }\n            break;\n          case SIP.C.PRACK:\n            if (this.status === C.STATUS_WAITING_FOR_PRACK || this.status === C.STATUS_ANSWERED_WAITING_FOR_PRACK) {\n              if (!this.hasAnswer) {\n                this.sessionDescriptionHandler = this.setupSessionDescriptionHandler();\n                this.emit('SessionDescriptionHandler-created', this.sessionDescriptionHandler);\n                if (this.sessionDescriptionHandler.hasDescription(request.getHeader('Content-Type'))) {\n                  this.hasAnswer = true;\n                  this.sessionDescriptionHandler.setDescription(request.body, this.sessionDescriptionHandlerOptions, this.modifiers).then(function onSuccess() {\n                    SIP.Timers.clearTimeout(this.timers.rel1xxTimer);\n                    SIP.Timers.clearTimeout(this.timers.prackTimer);\n                    request.reply(200);\n                    if (this.status === C.STATUS_ANSWERED_WAITING_FOR_PRACK) {\n                      this.status = C.STATUS_EARLY_MEDIA;\n                      this.accept();\n                    }\n                    this.status = C.STATUS_EARLY_MEDIA;\n                  }.bind(this), function onFailure(e) {\n                    this.logger.warn(e);\n                    this.terminate({\n                      statusCode: '488',\n                      reasonPhrase: 'Bad Media Description'\n                    });\n                    this.failed(request, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                    this.terminated(request, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                  }.bind(this));\n                } else {\n                  this.terminate({\n                    statusCode: '488',\n                    reasonPhrase: 'Bad Media Description'\n                  });\n                  this.failed(request, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                  this.terminated(request, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                }\n              } else {\n                SIP.Timers.clearTimeout(this.timers.rel1xxTimer);\n                SIP.Timers.clearTimeout(this.timers.prackTimer);\n                request.reply(200);\n\n                if (this.status === C.STATUS_ANSWERED_WAITING_FOR_PRACK) {\n                  this.status = C.STATUS_EARLY_MEDIA;\n                  this.accept();\n                }\n                this.status = C.STATUS_EARLY_MEDIA;\n              }\n            } else if (this.status === C.STATUS_EARLY_MEDIA) {\n              request.reply(200);\n            }\n            break;\n          default:\n            Session.prototype.receiveRequest.apply(this, [request]);\n            break;\n        }\n      } },\n\n    // Internal Function to setup the handler consistently\n    setupSessionDescriptionHandler: { writable: true, value: function value() {\n        if (this.sessionDescriptionHandler) {\n          return this.sessionDescriptionHandler;\n        }\n        return this.sessionDescriptionHandlerFactory(this, new SessionDescriptionHandlerObserver(this), this.ua.configuration.sessionDescriptionHandlerFactoryOptions);\n      } },\n\n    onTransportError: { writable: true, value: function value() {\n        if (this.status !== C.STATUS_CONFIRMED && this.status !== C.STATUS_TERMINATED) {\n          this.failed(null, SIP.C.causes.CONNECTION_ERROR);\n        }\n      } },\n\n    onRequestTimeout: { writable: true, value: function value() {\n        if (this.status === C.STATUS_CONFIRMED) {\n          this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);\n        } else if (this.status !== C.STATUS_TERMINATED) {\n          this.failed(null, SIP.C.causes.REQUEST_TIMEOUT);\n          this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);\n        }\n      } }\n\n  });\n\n  SIP.InviteServerContext = InviteServerContext;\n\n  InviteClientContext = function InviteClientContext(ua, target, options, modifiers) {\n    options = options || {};\n    this.passedOptions = options; // Save for later to use with refer\n    options.params = Object.create(options.params || Object.prototype);\n\n    var extraHeaders = (options.extraHeaders || []).slice(),\n        sessionDescriptionHandlerFactory = ua.configuration.sessionDescriptionHandlerFactory;\n\n    this.sessionDescriptionHandlerFactoryOptions = ua.configuration.sessionDescriptionHandlerFactoryOptions || {};\n    this.sessionDescriptionHandlerOptions = options.sessionDescriptionHandlerOptions || {};\n    this.modifiers = modifiers;\n\n    this.inviteWithoutSdp = options.inviteWithoutSdp || false;\n\n    // Set anonymous property\n    this.anonymous = options.anonymous || false;\n\n    // Custom data to be sent either in INVITE or in ACK\n    this.renderbody = options.renderbody || null;\n    this.rendertype = options.rendertype || 'text/plain';\n\n    // Session parameter initialization\n    this.from_tag = SIP.Utils.newTag();\n    options.params.from_tag = this.from_tag;\n\n    /* Do not add ;ob in initial forming dialog requests if the registration over\n     *  the current connection got a GRUU URI.\n     */\n    this.contact = ua.contact.toString({\n      anonymous: this.anonymous,\n      outbound: this.anonymous ? !ua.contact.temp_gruu : !ua.contact.pub_gruu\n    });\n\n    if (this.anonymous) {\n      options.params.from_displayName = 'Anonymous';\n      options.params.from_uri = 'sip:anonymous@anonymous.invalid';\n\n      extraHeaders.push('P-Preferred-Identity: ' + ua.configuration.uri.toString());\n      extraHeaders.push('Privacy: id');\n    }\n    extraHeaders.push('Contact: ' + this.contact);\n    extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());\n    if (this.inviteWithoutSdp && this.renderbody) {\n      extraHeaders.push('Content-Type: ' + this.rendertype);\n      extraHeaders.push('Content-Disposition: render;handling=optional');\n    }\n\n    if (ua.configuration.rel100 === SIP.C.supported.REQUIRED) {\n      extraHeaders.push('Require: 100rel');\n    }\n    if (ua.configuration.replaces === SIP.C.supported.REQUIRED) {\n      extraHeaders.push('Require: replaces');\n    }\n\n    options.extraHeaders = extraHeaders;\n\n    SIP.Utils.augment(this, SIP.ClientContext, [ua, SIP.C.INVITE, target, options]);\n    SIP.Utils.augment(this, SIP.Session, [sessionDescriptionHandlerFactory]);\n\n    // Check Session Status\n    if (this.status !== C.STATUS_NULL) {\n      throw new SIP.Exceptions.InvalidStateError(this.status);\n    }\n\n    // OutgoingSession specific parameters\n    this.isCanceled = false;\n    this.received_100 = false;\n\n    this.method = SIP.C.INVITE;\n\n    this.receiveNonInviteResponse = this.receiveResponse;\n    this.receiveResponse = this.receiveInviteResponse;\n\n    this.logger = ua.getLogger('sip.inviteclientcontext');\n\n    ua.applicants[this] = this;\n\n    this.id = this.request.call_id + this.from_tag;\n\n    this.onInfo = options.onInfo;\n\n    ua.transport.on('transportError', this.onTransportError.bind(this));\n  };\n\n  InviteClientContext.prototype = Object.create({}, {\n    invite: { writable: true, value: function value() {\n        var self = this;\n\n        //Save the session into the ua sessions collection.\n        //Note: placing in constructor breaks call to request.cancel on close... User does not need this anyway\n        this.ua.sessions[this.id] = this;\n\n        if (this.inviteWithoutSdp) {\n          //just send an invite with no sdp...\n          this.request.body = self.renderbody;\n          this.status = C.STATUS_INVITE_SENT;\n          this.send();\n        } else {\n          //Initialize Media Session\n          this.sessionDescriptionHandler = this.sessionDescriptionHandlerFactory(this, new SessionDescriptionHandlerObserver(this), this.sessionDescriptionHandlerFactoryOptions);\n          this.emit('SessionDescriptionHandler-created', this.sessionDescriptionHandler);\n\n          this.sessionDescriptionHandler.getDescription(this.sessionDescriptionHandlerOptions, this.modifiers).then(function onSuccess(description) {\n            if (self.isCanceled || self.status === C.STATUS_TERMINATED) {\n              return;\n            }\n            self.hasOffer = true;\n            self.request.body = description;\n            self.status = C.STATUS_INVITE_SENT;\n            self.send();\n          }, function onFailure() {\n            if (self.status === C.STATUS_TERMINATED) {\n              return;\n            }\n            self.failed(null, SIP.C.causes.WEBRTC_ERROR);\n            self.terminated(null, SIP.C.causes.WEBRTC_ERROR);\n          });\n        }\n\n        return this;\n      } },\n\n    receiveInviteResponse: { writable: true, value: function value(response) {\n        var cause,\n            session = this,\n            id = response.call_id + response.from_tag + response.to_tag,\n            extraHeaders = [],\n            options = {};\n\n        if (this.status === C.STATUS_TERMINATED || response.method !== SIP.C.INVITE) {\n          return;\n        }\n\n        if (this.dialog && response.status_code >= 200 && response.status_code <= 299) {\n          if (id !== this.dialog.id.toString()) {\n            if (!this.createDialog(response, 'UAC', true)) {\n              return;\n            }\n            this.emit(\"ack\", response.transaction.sendACK({ body: SIP.Utils.generateFakeSDP(response.body) }));\n            this.earlyDialogs[id].sendRequest(this, SIP.C.BYE);\n\n            /* NOTE: This fails because the forking proxy does not recognize that an unanswerable\n             * leg (due to peerConnection limitations) has been answered first. If your forking\n             * proxy does not hang up all unanswered branches on the first branch answered, remove this.\n             */\n            if (this.status !== C.STATUS_CONFIRMED) {\n              this.failed(response, SIP.C.causes.WEBRTC_ERROR);\n              this.terminated(response, SIP.C.causes.WEBRTC_ERROR);\n            }\n            return;\n          } else if (this.status === C.STATUS_CONFIRMED) {\n            this.emit(\"ack\", response.transaction.sendACK());\n            return;\n          } else if (!this.hasAnswer) {\n            // invite w/o sdp is waiting for callback\n            //an invite with sdp must go on, and hasAnswer is true\n            return;\n          }\n        }\n\n        if (this.dialog && response.status_code < 200) {\n          /*\n            Early media has been set up with at least one other different branch,\n            but a final 2xx response hasn't been received\n          */\n          if (this.dialog.pracked.indexOf(response.getHeader('rseq')) !== -1 || this.dialog.pracked[this.dialog.pracked.length - 1] >= response.getHeader('rseq') && this.dialog.pracked.length > 0) {\n            return;\n          }\n\n          if (!this.earlyDialogs[id] && !this.createDialog(response, 'UAC', true)) {\n            return;\n          }\n\n          if (this.earlyDialogs[id].pracked.indexOf(response.getHeader('rseq')) !== -1 || this.earlyDialogs[id].pracked[this.earlyDialogs[id].pracked.length - 1] >= response.getHeader('rseq') && this.earlyDialogs[id].pracked.length > 0) {\n            return;\n          }\n\n          extraHeaders.push('RAck: ' + response.getHeader('rseq') + ' ' + response.getHeader('cseq'));\n          this.earlyDialogs[id].pracked.push(response.getHeader('rseq'));\n\n          this.earlyDialogs[id].sendRequest(this, SIP.C.PRACK, {\n            extraHeaders: extraHeaders,\n            body: SIP.Utils.generateFakeSDP(response.body)\n          });\n          return;\n        }\n\n        // Proceed to cancellation if the user requested.\n        if (this.isCanceled) {\n          if (response.status_code >= 100 && response.status_code < 200) {\n            this.request.cancel(this.cancelReason, extraHeaders);\n            this.canceled(null);\n          } else if (response.status_code >= 200 && response.status_code < 299) {\n            this.acceptAndTerminate(response);\n            this.emit('bye', this.request);\n          } else if (response.status_code >= 300) {\n            cause = SIP.C.REASON_PHRASE[response.status_code] || SIP.C.causes.CANCELED;\n            this.rejected(response, cause);\n            this.failed(response, cause);\n            this.terminated(response, cause);\n          }\n          return;\n        }\n\n        switch (true) {\n          case /^100$/.test(response.status_code):\n            this.received_100 = true;\n            this.emit('progress', response);\n            break;\n          case /^1[0-9]{2}$/.test(response.status_code):\n            // Do nothing with 1xx responses without To tag.\n            if (!response.to_tag) {\n              this.logger.warn('1xx response received without to tag');\n              break;\n            }\n\n            // Create Early Dialog if 1XX comes with contact\n            if (response.hasHeader('contact')) {\n              // An error on dialog creation will fire 'failed' event\n              if (!this.createDialog(response, 'UAC', true)) {\n                break;\n              }\n            }\n\n            this.status = C.STATUS_1XX_RECEIVED;\n\n            if (response.hasHeader('P-Asserted-Identity')) {\n              this.assertedIdentity = new SIP.NameAddrHeader.parse(response.getHeader('P-Asserted-Identity'));\n            }\n\n            if (response.hasHeader('require') && response.getHeader('require').indexOf('100rel') !== -1) {\n\n              // Do nothing if this.dialog is already confirmed\n              if (this.dialog || !this.earlyDialogs[id]) {\n                break;\n              }\n\n              if (this.earlyDialogs[id].pracked.indexOf(response.getHeader('rseq')) !== -1 || this.earlyDialogs[id].pracked[this.earlyDialogs[id].pracked.length - 1] >= response.getHeader('rseq') && this.earlyDialogs[id].pracked.length > 0) {\n                return;\n              }\n              // TODO: This may be broken. It may have to be on the early dialog\n              this.sessionDescriptionHandler = this.sessionDescriptionHandlerFactory(this, new SessionDescriptionHandlerObserver(this), this.sessionDescriptionHandlerFactoryOptions);\n              this.emit('SessionDescriptionHandler-created', this.sessionDescriptionHandler);\n              if (!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))) {\n                extraHeaders.push('RAck: ' + response.getHeader('rseq') + ' ' + response.getHeader('cseq'));\n                this.earlyDialogs[id].pracked.push(response.getHeader('rseq'));\n                this.earlyDialogs[id].sendRequest(this, SIP.C.PRACK, {\n                  extraHeaders: extraHeaders\n                });\n                this.emit('progress', response);\n              } else if (this.hasOffer) {\n                if (!this.createDialog(response, 'UAC')) {\n                  break;\n                }\n                this.hasAnswer = true;\n                this.dialog.pracked.push(response.getHeader('rseq'));\n\n                this.sessionDescriptionHandler.setDescription(response.body, this.sessionDescriptionHandlerOptions, this.modifiers).then(function onSuccess() {\n                  extraHeaders.push('RAck: ' + response.getHeader('rseq') + ' ' + response.getHeader('cseq'));\n\n                  session.sendRequest(SIP.C.PRACK, {\n                    extraHeaders: extraHeaders,\n                    receiveResponse: function receiveResponse() {}\n                  });\n                  session.status = C.STATUS_EARLY_MEDIA;\n                  session.emit('progress', response);\n                }, function onFailure(e) {\n                  session.logger.warn(e);\n                  session.acceptAndTerminate(response, 488, 'Not Acceptable Here');\n                  session.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                });\n              } else {\n                var earlyDialog = this.earlyDialogs[id];\n                var earlyMedia = earlyDialog.sessionDescriptionHandler = this.sessionDescriptionHandlerFactory(this, new SessionDescriptionHandlerObserver(this), this.sessionDescriptionHandlerFactoryOptions);\n                this.emit('SessionDescriptionHandler-created', earlyMedia);\n\n                earlyDialog.pracked.push(response.getHeader('rseq'));\n\n                earlyMedia.setDescription(response.body, session.sessionDescriptionHandlerOptions, session.modifers).then(earlyMedia.getDescription.bind(earlyMedia, session.sessionDescriptionHandlerOptions, session.modifiers)).then(function onSuccess(description) {\n                  extraHeaders.push('RAck: ' + response.getHeader('rseq') + ' ' + response.getHeader('cseq'));\n                  earlyDialog.sendRequest(session, SIP.C.PRACK, {\n                    extraHeaders: extraHeaders,\n                    body: description\n                  });\n                  session.status = C.STATUS_EARLY_MEDIA;\n                  session.emit('progress', response);\n                }).catch(function onFailure(e) {\n                  if (e instanceof SIP.Exceptions.GetDescriptionError) {\n                    earlyDialog.pracked.push(response.getHeader('rseq'));\n                    if (session.status === C.STATUS_TERMINATED) {\n                      return;\n                    }\n                    session.failed(null, SIP.C.causes.WEBRTC_ERROR);\n                    session.terminated(null, SIP.C.causes.WEBRTC_ERROR);\n                  } else {\n                    earlyDialog.pracked.splice(earlyDialog.pracked.indexOf(response.getHeader('rseq')), 1);\n                    // Could not set remote description\n                    session.logger.warn('invalid description');\n                    session.logger.warn(e);\n                  }\n                });\n              }\n            } else {\n              this.emit('progress', response);\n            }\n            break;\n          case /^2[0-9]{2}$/.test(response.status_code):\n            var cseq = this.request.cseq + ' ' + this.request.method;\n            if (cseq !== response.getHeader('cseq')) {\n              break;\n            }\n\n            if (response.hasHeader('P-Asserted-Identity')) {\n              this.assertedIdentity = new SIP.NameAddrHeader.parse(response.getHeader('P-Asserted-Identity'));\n            }\n\n            if (this.status === C.STATUS_EARLY_MEDIA && this.dialog) {\n              this.status = C.STATUS_CONFIRMED;\n              options = {};\n              if (this.renderbody) {\n                extraHeaders.push('Content-Type: ' + this.rendertype);\n                options.extraHeaders = extraHeaders;\n                options.body = this.renderbody;\n              }\n              this.emit(\"ack\", response.transaction.sendACK(options));\n              this.accepted(response);\n              break;\n            }\n            // Do nothing if this.dialog is already confirmed\n            if (this.dialog) {\n              break;\n            }\n\n            // This is an invite without sdp\n            if (!this.hasOffer) {\n              if (this.earlyDialogs[id] && this.earlyDialogs[id].sessionDescriptionHandler) {\n                //REVISIT\n                this.hasOffer = true;\n                this.hasAnswer = true;\n                this.sessionDescriptionHandler = this.earlyDialogs[id].sessionDescriptionHandler;\n                if (!this.createDialog(response, 'UAC')) {\n                  break;\n                }\n                this.status = C.STATUS_CONFIRMED;\n                this.emit(\"ack\", response.transaction.sendACK());\n\n                this.accepted(response);\n              } else {\n                this.sessionDescriptionHandler = this.sessionDescriptionHandlerFactory(this, new SessionDescriptionHandlerObserver(this), this.sessionDescriptionHandlerFactoryOptions);\n                this.emit('SessionDescriptionHandler-created', this.sessionDescriptionHandler);\n\n                if (!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))) {\n                  this.acceptAndTerminate(response, 400, 'Missing session description');\n                  this.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                  break;\n                }\n                if (!this.createDialog(response, 'UAC')) {\n                  break;\n                }\n                this.hasOffer = true;\n                this.sessionDescriptionHandler.setDescription(response.body, this.sessionDescriptionHandlerOptions, this.modifiers).then(this.sessionDescriptionHandler.getDescription.bind(this.sessionDescriptionHandler, this.sessionDescriptionHandlerOptions, this.modifiers)).then(function onSuccess(description) {\n                  //var localMedia;\n                  if (session.isCanceled || session.status === C.STATUS_TERMINATED) {\n                    return;\n                  }\n\n                  session.status = C.STATUS_CONFIRMED;\n                  session.hasAnswer = true;\n\n                  session.emit(\"ack\", response.transaction.sendACK({ body: description }));\n                  session.accepted(response);\n                }).catch(function onFailure(e) {\n                  if (e instanceof SIP.Exceptions.GetDescriptionError) {\n                    // TODO do something here\n                    session.logger.warn(\"there was a problem\");\n                  } else {\n                    session.logger.warn('invalid description');\n                    session.logger.warn(e);\n                    session.acceptAndTerminate(response, 488, 'Invalid session description');\n                    session.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                  }\n                });\n              }\n            } else if (this.hasAnswer) {\n              if (this.renderbody) {\n                extraHeaders.push('Content-Type: ' + session.rendertype);\n                options.extraHeaders = extraHeaders;\n                options.body = this.renderbody;\n              }\n              this.emit(\"ack\", response.transaction.sendACK(options));\n            } else {\n              if (!this.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))) {\n                this.acceptAndTerminate(response, 400, 'Missing session description');\n                this.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n                break;\n              }\n              if (!this.createDialog(response, 'UAC')) {\n                break;\n              }\n              this.hasAnswer = true;\n              this.sessionDescriptionHandler.setDescription(response.body, this.sessionDescriptionHandlerOptions, this.modifiers).then(function onSuccess() {\n                var options = {};\n                session.status = C.STATUS_CONFIRMED;\n                if (session.renderbody) {\n                  extraHeaders.push('Content-Type: ' + session.rendertype);\n                  options.extraHeaders = extraHeaders;\n                  options.body = session.renderbody;\n                }\n                session.emit(\"ack\", response.transaction.sendACK(options));\n                session.accepted(response);\n              }, function onFailure(e) {\n                session.logger.warn(e);\n                session.acceptAndTerminate(response, 488, 'Not Acceptable Here');\n                session.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);\n              });\n            }\n            break;\n          default:\n            cause = SIP.Utils.sipErrorCause(response.status_code);\n            this.rejected(response, cause);\n            this.failed(response, cause);\n            this.terminated(response, cause);\n        }\n      } },\n\n    cancel: { writable: true, value: function value(options) {\n        options = options || {};\n\n        options.extraHeaders = (options.extraHeaders || []).slice();\n\n        // Check Session Status\n        if (this.status === C.STATUS_TERMINATED || this.status === C.STATUS_CONFIRMED) {\n          throw new SIP.Exceptions.InvalidStateError(this.status);\n        }\n\n        this.logger.log('canceling RTCSession');\n\n        var cancel_reason = SIP.Utils.getCancelReason(options.status_code, options.reason_phrase);\n\n        // Check Session Status\n        if (this.status === C.STATUS_NULL || this.status === C.STATUS_INVITE_SENT && !this.received_100) {\n          this.isCanceled = true;\n          this.cancelReason = cancel_reason;\n        } else if (this.status === C.STATUS_INVITE_SENT || this.status === C.STATUS_1XX_RECEIVED || this.status === C.STATUS_EARLY_MEDIA) {\n          this.request.cancel(cancel_reason, options.extraHeaders);\n        }\n\n        return this.canceled();\n      } },\n\n    terminate: { writable: true, value: function value(options) {\n        if (this.status === C.STATUS_TERMINATED) {\n          return this;\n        }\n\n        if (this.status === C.STATUS_WAITING_FOR_ACK || this.status === C.STATUS_CONFIRMED) {\n          this.bye(options);\n        } else {\n          this.cancel(options);\n        }\n\n        return this;\n      } },\n\n    receiveRequest: { writable: true, value: function value(request) {\n        // ICC RECEIVE REQUEST\n\n        // Reject CANCELs\n        if (request.method === SIP.C.CANCEL) {\n          // TODO; make this a switch when it gets added\n        }\n\n        if (request.method === SIP.C.ACK && this.status === C.STATUS_WAITING_FOR_ACK) {\n\n          SIP.Timers.clearTimeout(this.timers.ackTimer);\n          SIP.Timers.clearTimeout(this.timers.invite2xxTimer);\n          this.status = C.STATUS_CONFIRMED;\n\n          this.accepted();\n        }\n\n        return Session.prototype.receiveRequest.apply(this, [request]);\n      } },\n\n    onTransportError: { writable: true, value: function value() {\n        if (this.status !== C.STATUS_CONFIRMED && this.status !== C.STATUS_TERMINATED) {\n          this.failed(null, SIP.C.causes.CONNECTION_ERROR);\n        }\n      } },\n\n    onRequestTimeout: { writable: true, value: function value() {\n        if (this.status === C.STATUS_CONFIRMED) {\n          this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);\n        } else if (this.status !== C.STATUS_TERMINATED) {\n          this.failed(null, SIP.C.causes.REQUEST_TIMEOUT);\n          this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);\n        }\n      } }\n\n  });\n\n  SIP.InviteClientContext = InviteClientContext;\n\n  ReferClientContext = function ReferClientContext(ua, applicant, target, options) {\n    this.options = options || {};\n    this.extraHeaders = (this.options.extraHeaders || []).slice();\n\n    if (ua === undefined || applicant === undefined || target === undefined) {\n      throw new TypeError('Not enough arguments');\n    }\n\n    SIP.Utils.augment(this, SIP.ClientContext, [ua, SIP.C.REFER, applicant.remoteIdentity.uri.toString(), options]);\n\n    this.applicant = applicant;\n\n    var withReplaces = target instanceof SIP.InviteServerContext || target instanceof SIP.InviteClientContext;\n    if (withReplaces) {\n      // Attended Transfer\n      // All of these fields should be defined based on the check above\n      this.target = '\"' + target.remoteIdentity.friendlyName + '\" ' + '<' + target.dialog.remote_target.toString() + '?Replaces=' + target.dialog.id.call_id + '%3Bto-tag%3D' + target.dialog.id.remote_tag + '%3Bfrom-tag%3D' + target.dialog.id.local_tag + '>';\n    } else {\n      // Blind Transfer\n      // Refer-To: <sip:bob@example.com>\n      try {\n        this.target = SIP.Grammar.parse(target, 'Refer_To').uri || target;\n      } catch (e) {\n        this.logger.debug(\".refer() cannot parse Refer_To from\", target);\n        this.logger.debug(\"...falling through to normalizeTarget()\");\n      }\n\n      // Check target validity\n      this.target = this.ua.normalizeTarget(this.target);\n      if (!this.target) {\n        throw new TypeError('Invalid target: ' + target);\n      }\n    }\n\n    if (this.ua) {\n      this.extraHeaders.push('Referred-By: <' + this.ua.configuration.uri + '>');\n    }\n    // TODO: Check that this is correct isc/icc\n    this.extraHeaders.push('Contact: ' + applicant.contact);\n    this.extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());\n    this.extraHeaders.push('Refer-To: ' + this.target);\n\n    ua.transport.on('transportError', this.onTransportError.bind(this));\n  };\n\n  ReferClientContext.prototype = Object.create({}, {\n\n    refer: { writable: true, value: function value(options) {\n        options = options || {};\n\n        var extraHeaders = (this.extraHeaders || []).slice();\n        if (options.extraHeaders) {\n          extraHeaders.concat(options.extraHeaders);\n        }\n\n        this.applicant.sendRequest(SIP.C.REFER, {\n          extraHeaders: this.extraHeaders,\n          receiveResponse: function (response) {\n            if (/^1[0-9]{2}$/.test(response.status_code)) {\n              this.emit('referRequestProgress', this);\n            } else if (/^2[0-9]{2}$/.test(response.status_code)) {\n              this.emit('referRequestAccepted', this);\n            } else if (/^[4-6][0-9]{2}$/.test(response.status_code)) {\n              this.emit('referRequestRejected', this);\n            }\n            if (options.receiveResponse) {\n              options.receiveResponse(response);\n            }\n          }.bind(this)\n        });\n        return this;\n      } },\n\n    receiveNotify: { writable: true, value: function value(request) {\n        // If we can correctly handle this, then we need to send a 200 OK!\n        if (request.hasHeader('Content-Type') && request.getHeader('Content-Type').search(/^message\\/sipfrag/) !== -1) {\n          var messageBody = SIP.Grammar.parse(request.body, 'sipfrag');\n          if (messageBody === -1) {\n            request.reply(489, 'Bad Event');\n            return;\n          }\n          switch (true) {\n            case /^1[0-9]{2}$/.test(messageBody.status_code):\n              this.emit('referProgress', this);\n              break;\n            case /^2[0-9]{2}$/.test(messageBody.status_code):\n              this.emit('referAccepted', this);\n              if (!this.options.activeAfterTransfer && this.applicant.terminate) {\n                this.applicant.terminate();\n              }\n              break;\n            default:\n              this.emit('referRejected', this);\n              break;\n          }\n          request.reply(200);\n          this.emit('notify', request);\n          return;\n        }\n        request.reply(489, 'Bad Event');\n      } }\n  });\n\n  SIP.ReferClientContext = ReferClientContext;\n\n  ReferServerContext = function ReferServerContext(ua, request) {\n    SIP.Utils.augment(this, SIP.ServerContext, [ua, request]);\n\n    this.ua = ua;\n\n    this.status = C.STATUS_INVITE_RECEIVED;\n    this.from_tag = request.from_tag;\n    this.id = request.call_id + this.from_tag;\n    this.request = request;\n    this.contact = this.ua.contact.toString();\n\n    this.logger = ua.getLogger('sip.referservercontext', this.id);\n\n    // RFC 3515 2.4.1\n    if (!this.request.hasHeader('refer-to')) {\n      this.logger.warn('Invalid REFER packet. A refer-to header is required. Rejecting refer.');\n      this.reject();\n      return;\n    }\n\n    this.referTo = this.request.parseHeader('refer-to');\n\n    // TODO: Must set expiration timer and send 202 if there is no response by then\n\n    this.referredSession = this.ua.findSession(request);\n\n    // Needed to send the NOTIFY's\n    this.cseq = Math.floor(Math.random() * 10000);\n    this.call_id = this.request.call_id;\n    this.from_uri = this.request.to.uri;\n    this.from_tag = this.request.to.parameters.tag;\n    this.remote_target = this.request.headers.Contact[0].parsed.uri;\n    this.to_uri = this.request.from.uri;\n    this.to_tag = this.request.from_tag;\n    this.route_set = this.request.getHeaders('record-route');\n\n    this.receiveNonInviteResponse = function () {};\n\n    if (this.request.hasHeader('referred-by')) {\n      this.referredBy = this.request.getHeader('referred-by');\n    }\n\n    if (this.referTo.uri.hasHeader('replaces')) {\n      this.replaces = this.referTo.uri.getHeader('replaces');\n    }\n\n    ua.transport.on('transportError', this.onTransportError.bind(this));\n\n    this.status = C.STATUS_WAITING_FOR_ANSWER;\n  };\n\n  ReferServerContext.prototype = Object.create({}, {\n\n    progress: { writable: true, value: function value() {\n        if (this.status !== C.STATUS_WAITING_FOR_ANSWER) {\n          throw new SIP.Exceptions.InvalidStateError(this.status);\n        }\n        this.request.reply(100);\n      } },\n\n    reject: { writable: true, value: function value(options) {\n        if (this.status === C.STATUS_TERMINATED) {\n          throw new SIP.Exceptions.InvalidStateError(this.status);\n        }\n        this.logger.log('Rejecting refer');\n        this.status = C.STATUS_TERMINATED;\n        SIP.ServerContext.prototype.reject.call(this, options);\n        this.emit('referRequestRejected', this);\n      } },\n\n    accept: { writable: true, value: function value(options, modifiers) {\n        options = options || {};\n\n        if (this.status === C.STATUS_WAITING_FOR_ANSWER) {\n          this.status = C.STATUS_ANSWERED;\n        } else {\n          throw new SIP.Exceptions.InvalidStateError(this.status);\n        }\n\n        this.request.reply(202, 'Accepted');\n        this.emit('referRequestAccepted', this);\n\n        if (options.followRefer) {\n          this.logger.log('Accepted refer, attempting to automatically follow it');\n\n          var target = this.referTo.uri;\n          if (!target.scheme.match(\"^sips?$\")) {\n            this.logger.error('SIP.js can only automatically follow SIP refer target');\n            this.reject();\n            return;\n          }\n\n          var inviteOptions = options.inviteOptions || {};\n          var extraHeaders = (inviteOptions.extraHeaders || []).slice();\n          if (this.replaces) {\n            // decodeURIComponent is a holdover from 2c086eb4. Not sure that it is actually necessary\n            extraHeaders.push('Replaces: ' + decodeURIComponent(this.replaces));\n          }\n\n          if (this.referredBy) {\n            extraHeaders.push('Referred-By: ' + this.referredBy);\n          }\n\n          inviteOptions.extraHeaders = extraHeaders;\n\n          target.clearHeaders();\n\n          this.targetSession = this.ua.invite(target, inviteOptions, modifiers);\n\n          this.emit('referInviteSent', this);\n\n          this.targetSession.once('progress', function () {\n            this.sendNotify('SIP/2.0 100 Trying');\n            this.emit('referProgress', this);\n            if (this.referredSession) {\n              this.referredSession.emit('referProgress', this);\n            }\n          }.bind(this));\n          this.targetSession.once('accepted', function () {\n            this.logger.log('Successfully followed the refer');\n            this.sendNotify('SIP/2.0 200 OK');\n            this.emit('referAccepted', this);\n            if (this.referredSession) {\n              this.referredSession.emit('referAccepted', this);\n            }\n          }.bind(this));\n\n          var referFailed = function referFailed(response) {\n            if (this.status === C.STATUS_TERMINATED) {\n              return; // No throw here because it is possible this gets called multiple times\n            }\n            this.logger.log('Refer was not successful. Resuming session');\n            if (response && response.status_code === 429) {\n              this.logger.log('Alerting referrer that identity is required.');\n              this.sendNotify('SIP/2.0 429 Provide Referrer Identity');\n              return;\n            }\n            this.sendNotify('SIP/2.0 603 Declined');\n            // Must change the status after sending the final Notify or it will not send due to check\n            this.status = C.STATUS_TERMINATED;\n            this.emit('referRejected', this);\n            if (this.referredSession) {\n              this.referredSession.emit('referRejected');\n            }\n          };\n\n          this.targetSession.once('rejected', referFailed.bind(this));\n          this.targetSession.once('failed', referFailed.bind(this));\n        } else {\n          this.logger.log('Accepted refer, but did not automatically follow it');\n          this.sendNotify('SIP/2.0 200 OK');\n          this.emit('referAccepted', this);\n          if (this.referredSession) {\n            this.referredSession.emit('referAccepted', this);\n          }\n        }\n      } },\n\n    sendNotify: { writable: true, value: function value(body) {\n        if (this.status !== C.STATUS_ANSWERED) {\n          throw new SIP.Exceptions.InvalidStateError(this.status);\n        }\n        if (SIP.Grammar.parse(body, 'sipfrag') === -1) {\n          throw new Error('sipfrag body is required to send notify for refer');\n        }\n\n        var request = new SIP.OutgoingRequest(SIP.C.NOTIFY, this.remote_target, this.ua, {\n          cseq: this.cseq += 1, // randomly generated then incremented on each additional notify\n          call_id: this.call_id, // refer call_id\n          from_uri: this.from_uri,\n          from_tag: this.from_tag,\n          to_uri: this.to_uri,\n          to_tag: this.to_tag,\n          route_set: this.route_set\n        }, ['Event: refer', 'Subscription-State: terminated', 'Content-Type: message/sipfrag'], body);\n\n        new SIP.RequestSender({\n          request: request,\n          onRequestTimeout: function onRequestTimeout() {\n            return;\n          },\n          onTransportError: function onTransportError() {\n            return;\n          },\n          receiveResponse: function receiveResponse() {\n            return;\n          }\n        }, this.ua).send();\n      } }\n  });\n\n  SIP.ReferServerContext = ReferServerContext;\n};\n\n//# sourceURL=webpack://SIP/./src/Session.js?");

/***/ }),

/***/ "./src/Session/DTMF.js":
/*!*****************************!*\
  !*** ./src/Session/DTMF.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview DTMF\n */\n\n/**\n * @class DTMF\n * @param {SIP.Session} session\n */\n\nmodule.exports = function (SIP) {\n\n  var _DTMF,\n      C = {\n    MIN_DURATION: 70,\n    MAX_DURATION: 6000,\n    DEFAULT_DURATION: 100,\n    MIN_INTER_TONE_GAP: 50,\n    DEFAULT_INTER_TONE_GAP: 500\n  };\n\n  _DTMF = function DTMF(session, tone, options) {\n    var duration, interToneGap;\n\n    if (tone === undefined) {\n      throw new TypeError('Not enough arguments');\n    }\n\n    this.logger = session.ua.getLogger('sip.invitecontext.dtmf', session.id);\n    this.owner = session;\n    this.direction = null;\n\n    options = options || {};\n    duration = options.duration || null;\n    interToneGap = options.interToneGap || null;\n\n    // Check tone type\n    if (typeof tone === 'string') {\n      tone = tone.toUpperCase();\n    } else if (typeof tone === 'number') {\n      tone = tone.toString();\n    } else {\n      throw new TypeError('Invalid tone: ' + tone);\n    }\n\n    // Check tone value\n    if (!tone.match(/^[0-9A-D#*]$/)) {\n      throw new TypeError('Invalid tone: ' + tone);\n    } else {\n      this.tone = tone;\n    }\n\n    // Check duration\n    if (duration && !SIP.Utils.isDecimal(duration)) {\n      throw new TypeError('Invalid tone duration: ' + duration);\n    } else if (!duration) {\n      duration = _DTMF.C.DEFAULT_DURATION;\n    } else if (duration < _DTMF.C.MIN_DURATION) {\n      this.logger.warn('\"duration\" value is lower than the minimum allowed, setting it to ' + _DTMF.C.MIN_DURATION + ' milliseconds');\n      duration = _DTMF.C.MIN_DURATION;\n    } else if (duration > _DTMF.C.MAX_DURATION) {\n      this.logger.warn('\"duration\" value is greater than the maximum allowed, setting it to ' + _DTMF.C.MAX_DURATION + ' milliseconds');\n      duration = _DTMF.C.MAX_DURATION;\n    } else {\n      duration = Math.abs(duration);\n    }\n    this.duration = duration;\n\n    // Check interToneGap\n    if (interToneGap && !SIP.Utils.isDecimal(interToneGap)) {\n      throw new TypeError('Invalid interToneGap: ' + interToneGap);\n    } else if (!interToneGap) {\n      interToneGap = _DTMF.C.DEFAULT_INTER_TONE_GAP;\n    } else if (interToneGap < _DTMF.C.MIN_INTER_TONE_GAP) {\n      this.logger.warn('\"interToneGap\" value is lower than the minimum allowed, setting it to ' + _DTMF.C.MIN_INTER_TONE_GAP + ' milliseconds');\n      interToneGap = _DTMF.C.MIN_INTER_TONE_GAP;\n    } else {\n      interToneGap = Math.abs(interToneGap);\n    }\n    this.interToneGap = interToneGap;\n  };\n  _DTMF.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  _DTMF.prototype.send = function (options) {\n    var extraHeaders,\n        body = {};\n\n    this.direction = 'outgoing';\n\n    // Check RTCSession Status\n    if (this.owner.status !== SIP.Session.C.STATUS_CONFIRMED && this.owner.status !== SIP.Session.C.STATUS_WAITING_FOR_ACK) {\n      throw new SIP.Exceptions.InvalidStateError(this.owner.status);\n    }\n\n    // Get DTMF options\n    options = options || {};\n    extraHeaders = options.extraHeaders ? options.extraHeaders.slice() : [];\n\n    body.contentType = 'application/dtmf-relay';\n\n    body.body = \"Signal= \" + this.tone + \"\\r\\n\";\n    body.body += \"Duration= \" + this.duration;\n\n    this.request = this.owner.dialog.sendRequest(this, SIP.C.INFO, {\n      extraHeaders: extraHeaders,\n      body: body\n    });\n\n    this.owner.emit('dtmf', this.request, this);\n  };\n\n  /**\n   * @private\n   */\n  _DTMF.prototype.receiveResponse = function (response) {\n    var cause;\n\n    switch (true) {\n      case /^1[0-9]{2}$/.test(response.status_code):\n        // Ignore provisional responses.\n        break;\n\n      case /^2[0-9]{2}$/.test(response.status_code):\n        this.emit('succeeded', {\n          originator: 'remote',\n          response: response\n        });\n        break;\n\n      default:\n        cause = SIP.Utils.sipErrorCause(response.status_code);\n        this.emit('failed', response, cause);\n        break;\n    }\n  };\n\n  /**\n   * @private\n   */\n  _DTMF.prototype.onRequestTimeout = function () {\n    this.emit('failed', null, SIP.C.causes.REQUEST_TIMEOUT);\n    this.owner.onRequestTimeout();\n  };\n\n  /**\n   * @private\n   */\n  _DTMF.prototype.onTransportError = function () {\n    this.emit('failed', null, SIP.C.causes.CONNECTION_ERROR);\n    this.owner.onTransportError();\n  };\n\n  /**\n   * @private\n   */\n  _DTMF.prototype.onDialogError = function (response) {\n    this.emit('failed', response, SIP.C.causes.DIALOG_ERROR);\n    this.owner.onDialogError(response);\n  };\n\n  /**\n   * @private\n   */\n  _DTMF.prototype.init_incoming = function (request) {\n    this.direction = 'incoming';\n    this.request = request;\n\n    request.reply(200);\n\n    if (!this.tone || !this.duration) {\n      this.logger.warn('invalid INFO DTMF received, discarded');\n    } else {\n      this.owner.emit('dtmf', request, this);\n    }\n  };\n\n  _DTMF.C = C;\n  return _DTMF;\n};\n\n//# sourceURL=webpack://SIP/./src/Session/DTMF.js?");

/***/ }),

/***/ "./src/SessionDescriptionHandler.js":
/*!******************************************!*\
  !*** ./src/SessionDescriptionHandler.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/* eslint-disable */\n/**\n * @fileoverview SessionDescriptionHandler\n */\n\n/* SessionDescriptionHandler\n * @class PeerConnection helper Class.\n * @param {SIP.Session} session\n * @param {Object} [options]\n */\n\nmodule.exports = function (EventEmitter) {\n  var SessionDescriptionHandler = function SessionDescriptionHandler(session, observer, options) {};\n\n  SessionDescriptionHandler.prototype = Object.create(EventEmitter.prototype, {\n\n    /**\n     * Destructor\n     */\n    close: { value: function close() {} },\n\n    /**\n     * Gets the local description from the underlying media implementation\n     * @param {Object} [options] Options object to be used by getDescription\n     * @param {Array} [modifiers] Array with one time use description modifiers\n     * @returns {Promise} Promise that resolves with the local description to be used for the session\n     */\n    getDescription: { value: function getDescription(options, modifiers) {} },\n\n    /**\n     * Check if the Session Description Handler can handle the Content-Type described by a SIP Message\n     * @param {String} contentType The content type that is in the SIP Message\n     * @returns {boolean}\n     */\n    hasDescription: { value: function hasSessionDescription(contentType) {} },\n\n    /**\n     * The modifier that should be used when the session would like to place the call on hold\n     * @param {String} [sdp] The description that will be modified\n     * @returns {Promise} Promise that resolves with modified SDP\n     */\n    holdModifier: { value: function holdModifier(sdp) {} },\n\n    /**\n     * Set the remote description to the underlying media implementation\n     * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation\n     * @param {Object} [options] Options object to be used by setDescription\n     * @param {Array} [modifiers] Array with one time use description modifiers\n     * @returns {Promise} Promise that resolves once the description is set\n     */\n    setDescription: { value: function setDescription(sessionDescription, options, modifiers) {} },\n\n    /**\n     * Send DTMF via RTP (RFC 4733)\n     * @param {String} tones A string containing DTMF digits\n     * @param {Object} [options] Options object to be used by sendDtmf\n     * @returns {boolean} true if DTMF send is successful, false otherwise\n     */\n    sendDtmf: { value: function sendDtmf(tones, options) {} },\n\n    /**\n    * Get the direction of the session description\n    * @returns {String} direction of the description\n    */\n    getDirection: { value: function getDirection() {} }\n  });\n\n  return SessionDescriptionHandler;\n};\n\n//# sourceURL=webpack://SIP/./src/SessionDescriptionHandler.js?");

/***/ }),

/***/ "./src/SessionDescriptionHandlerObserver.js":
/*!**************************************************!*\
  !*** ./src/SessionDescriptionHandlerObserver.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SessionDescriptionHandlerObserver\n */\n\n/* SessionDescriptionHandlerObserver\n * @class SessionDescriptionHandler Observer Class.\n * @param {SIP.Session} session\n * @param {Object} [options]\n */\n\n// Constructor\n\nvar SessionDescriptionHandlerObserver = function SessionDescriptionHandlerObserver(session, options) {\n  this.session = session || {};\n  this.options = options || {};\n};\n\nSessionDescriptionHandlerObserver.prototype = {\n  trackAdded: function trackAdded() {\n    this.session.emit('trackAdded');\n  },\n\n  directionChanged: function directionChanged() {\n    this.session.emit('directionChanged');\n  }\n};\n\nmodule.exports = SessionDescriptionHandlerObserver;\n\n//# sourceURL=webpack://SIP/./src/SessionDescriptionHandlerObserver.js?");

/***/ }),

/***/ "./src/Subscription.js":
/*!*****************************!*\
  !*** ./src/Subscription.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * @fileoverview SIP Subscriber (SIP-Specific Event Notifications RFC6665)\n */\n\n/**\n * @augments SIP\n * @class Class creating a SIP Subscription.\n */\n\nmodule.exports = function (SIP) {\n  SIP.Subscription = function (ua, target, event, options) {\n    options = Object.create(options || Object.prototype);\n    this.extraHeaders = options.extraHeaders = (options.extraHeaders || []).slice();\n\n    this.id = null;\n    this.state = 'init';\n\n    if (!event) {\n      throw new TypeError('Event necessary to create a subscription.');\n    } else {\n      //TODO: check for valid events here probably make a list in SIP.C; or leave it up to app to check?\n      //The check may need to/should probably occur on the other side,\n      this.event = event;\n    }\n\n    if (typeof options.expires !== 'number') {\n      ua.logger.warn('expires must be a number. Using default of 3600.');\n      this.expires = 3600;\n    } else {\n      this.expires = options.expires;\n    }\n    this.requestedExpires = this.expires;\n\n    options.extraHeaders.push('Event: ' + this.event);\n    options.extraHeaders.push('Expires: ' + this.expires);\n\n    if (options.body) {\n      this.body = options.body;\n    }\n\n    this.contact = ua.contact.toString();\n\n    options.extraHeaders.push('Contact: ' + this.contact);\n    options.extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());\n\n    SIP.Utils.augment(this, SIP.ClientContext, [ua, SIP.C.SUBSCRIBE, target, options]);\n\n    this.logger = ua.getLogger('sip.subscription');\n\n    this.dialog = null;\n    this.timers = { N: null, sub_duration: null };\n    this.errorCodes = [404, 405, 410, 416, 480, 481, 482, 483, 484, 485, 489, 501, 604];\n  };\n\n  SIP.Subscription.prototype = {\n    subscribe: function subscribe() {\n      var sub = this;\n\n      //these states point to an existing subscription, no subscribe is necessary\n      if (this.state === 'active') {\n        this.refresh();\n        return this;\n      } else if (this.state === 'notify_wait') {\n        return this;\n      }\n\n      SIP.Timers.clearTimeout(this.timers.sub_duration);\n      SIP.Timers.clearTimeout(this.timers.N);\n      this.timers.N = SIP.Timers.setTimeout(sub.timer_fire.bind(sub), SIP.Timers.TIMER_N);\n\n      this.ua.earlySubscriptions[this.request.call_id + this.request.from.parameters.tag + this.event] = this;\n\n      this.send();\n\n      this.state = 'notify_wait';\n\n      return this;\n    },\n\n    refresh: function refresh() {\n      if (this.state === 'terminated' || this.state === 'pending' || this.state === 'notify_wait') {\n        return;\n      }\n\n      this.dialog.sendRequest(this, SIP.C.SUBSCRIBE, {\n        extraHeaders: this.extraHeaders,\n        body: this.body\n      });\n    },\n\n    receiveResponse: function receiveResponse(response) {\n      var expires,\n          sub = this,\n          cause = SIP.Utils.getReasonPhrase(response.status_code);\n\n      if (this.state === 'notify_wait' && response.status_code >= 300 || this.state !== 'notify_wait' && this.errorCodes.indexOf(response.status_code) !== -1) {\n        this.failed(response, null);\n      } else if (/^2[0-9]{2}$/.test(response.status_code)) {\n        this.emit('accepted', response, cause);\n        //As we don't support RFC 5839 or other extensions where the NOTIFY is optional, timer N will not be cleared\n        //SIP.Timers.clearTimeout(this.timers.N);\n\n        expires = response.getHeader('Expires');\n\n        if (expires && expires <= this.requestedExpires) {\n          // Preserve new expires value for subsequent requests\n          this.expires = expires;\n          this.timers.sub_duration = SIP.Timers.setTimeout(sub.refresh.bind(sub), expires * 900);\n        } else {\n          if (!expires) {\n            this.logger.warn('Expires header missing in a 200-class response to SUBSCRIBE');\n            this.failed(response, SIP.C.EXPIRES_HEADER_MISSING);\n          } else {\n            this.logger.warn('Expires header in a 200-class response to SUBSCRIBE with a higher value than the one in the request');\n            this.failed(response, SIP.C.INVALID_EXPIRES_HEADER);\n          }\n        }\n      } else if (response.statusCode > 300) {\n        this.emit('failed', response, cause);\n        this.emit('rejected', response, cause);\n      }\n    },\n\n    unsubscribe: function unsubscribe() {\n      var extraHeaders = [],\n          sub = this;\n\n      this.state = 'terminated';\n\n      extraHeaders.push('Event: ' + this.event);\n      extraHeaders.push('Expires: 0');\n\n      extraHeaders.push('Contact: ' + this.contact);\n      extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());\n\n      //makes sure expires isn't set, and other typical resubscribe behavior\n      this.receiveResponse = function () {};\n\n      this.dialog.sendRequest(this, this.method, {\n        extraHeaders: extraHeaders,\n        body: this.body\n      });\n\n      SIP.Timers.clearTimeout(this.timers.sub_duration);\n      SIP.Timers.clearTimeout(this.timers.N);\n      this.timers.N = SIP.Timers.setTimeout(sub.timer_fire.bind(sub), SIP.Timers.TIMER_N);\n    },\n\n    /**\n    * @private\n    */\n    timer_fire: function timer_fire() {\n      if (this.state === 'terminated') {\n        this.terminateDialog();\n        SIP.Timers.clearTimeout(this.timers.N);\n        SIP.Timers.clearTimeout(this.timers.sub_duration);\n\n        delete this.ua.subscriptions[this.id];\n      } else if (this.state === 'notify_wait' || this.state === 'pending') {\n        this.close();\n      } else {\n        this.refresh();\n      }\n    },\n\n    /**\n    * @private\n    */\n    close: function close() {\n      if (this.state === 'notify_wait') {\n        this.state = 'terminated';\n        SIP.Timers.clearTimeout(this.timers.N);\n        SIP.Timers.clearTimeout(this.timers.sub_duration);\n        this.receiveResponse = function () {};\n\n        delete this.ua.earlySubscriptions[this.request.call_id + this.request.from.parameters.tag + this.event];\n      } else if (this.state !== 'terminated') {\n        this.unsubscribe();\n      }\n    },\n\n    /**\n    * @private\n    */\n    createConfirmedDialog: function createConfirmedDialog(message, type) {\n      var dialog;\n\n      this.terminateDialog();\n      dialog = new SIP.Dialog(this, message, type);\n      dialog.invite_seqnum = this.request.cseq;\n      dialog.local_seqnum = this.request.cseq;\n\n      if (!dialog.error) {\n        this.dialog = dialog;\n        return true;\n      }\n      // Dialog not created due to an error\n      else {\n          return false;\n        }\n    },\n\n    /**\n    * @private\n    */\n    terminateDialog: function terminateDialog() {\n      if (this.dialog) {\n        delete this.ua.subscriptions[this.id];\n        this.dialog.terminate();\n        delete this.dialog;\n      }\n    },\n\n    /**\n    * @private\n    */\n    receiveRequest: function receiveRequest(request) {\n      var sub_state,\n          sub = this;\n\n      function setExpiresTimeout() {\n        if (sub_state.expires) {\n          SIP.Timers.clearTimeout(sub.timers.sub_duration);\n          sub_state.expires = Math.min(sub.expires, Math.max(sub_state.expires, 0));\n          sub.timers.sub_duration = SIP.Timers.setTimeout(sub.refresh.bind(sub), sub_state.expires * 900);\n        }\n      }\n\n      if (!this.matchEvent(request)) {\n        //checks event and subscription_state headers\n        request.reply(489);\n        return;\n      }\n\n      if (!this.dialog) {\n        if (this.createConfirmedDialog(request, 'UAS')) {\n          this.id = this.dialog.id.toString();\n          delete this.ua.earlySubscriptions[this.request.call_id + this.request.from.parameters.tag + this.event];\n          this.ua.subscriptions[this.id] = this;\n          // UPDATE ROUTE SET TO BE BACKWARDS COMPATIBLE?\n        }\n      }\n\n      sub_state = request.parseHeader('Subscription-State');\n\n      request.reply(200, SIP.C.REASON_200);\n\n      SIP.Timers.clearTimeout(this.timers.N);\n\n      this.emit('notify', { request: request });\n\n      // if we've set state to terminated, no further processing should take place\n      // and we are only interested in cleaning up after the appropriate NOTIFY\n      if (this.state === 'terminated') {\n        if (sub_state.state === 'terminated') {\n          this.terminateDialog();\n          SIP.Timers.clearTimeout(this.timers.N);\n          SIP.Timers.clearTimeout(this.timers.sub_duration);\n\n          delete this.ua.subscriptions[this.id];\n        }\n        return;\n      }\n\n      switch (sub_state.state) {\n        case 'active':\n          this.state = 'active';\n          setExpiresTimeout();\n          break;\n        case 'pending':\n          if (this.state === 'notify_wait') {\n            setExpiresTimeout();\n          }\n          this.state = 'pending';\n          break;\n        case 'terminated':\n          SIP.Timers.clearTimeout(this.timers.sub_duration);\n          if (sub_state.reason) {\n            this.logger.log('terminating subscription with reason ' + sub_state.reason);\n            switch (sub_state.reason) {\n              case 'deactivated':\n              case 'timeout':\n                this.subscribe();\n                return;\n              case 'probation':\n              case 'giveup':\n                if (sub_state.params && sub_state.params['retry-after']) {\n                  this.timers.sub_duration = SIP.Timers.setTimeout(sub.subscribe.bind(sub), sub_state.params['retry-after']);\n                } else {\n                  this.subscribe();\n                }\n                return;\n              case 'rejected':\n              case 'noresource':\n              case 'invariant':\n                break;\n            }\n          }\n          this.close();\n          break;\n      }\n    },\n\n    failed: function failed(response, cause) {\n      this.close();\n      this.emit('failed', response, cause);\n      this.emit('rejected', response, cause);\n      return this;\n    },\n\n    onDialogError: function onDialogError(response) {\n      this.failed(response, SIP.C.causes.DIALOG_ERROR);\n    },\n\n    /**\n    * @private\n    */\n    matchEvent: function matchEvent(request) {\n      var event;\n\n      // Check mandatory header Event\n      if (!request.hasHeader('Event')) {\n        this.logger.warn('missing Event header');\n        return false;\n      }\n      // Check mandatory header Subscription-State\n      if (!request.hasHeader('Subscription-State')) {\n        this.logger.warn('missing Subscription-State header');\n        return false;\n      }\n\n      // Check whether the event in NOTIFY matches the event in SUBSCRIBE\n      event = request.parseHeader('event').event;\n\n      if (this.event !== event) {\n        this.logger.warn('event match failed');\n        request.reply(481, 'Event Match Failed');\n        return false;\n      } else {\n        return true;\n      }\n    }\n  };\n};\n\n//# sourceURL=webpack://SIP/./src/Subscription.js?");

/***/ }),

/***/ "./src/Timers.js":
/*!***********************!*\
  !*** ./src/Timers.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP TIMERS\n */\n\n/**\n * @augments SIP\n */\n\nvar T1 = 500,\n    T2 = 4000,\n    T4 = 5000;\nmodule.exports = function (timers) {\n  var Timers = {\n    T1: T1,\n    T2: T2,\n    T4: T4,\n    TIMER_B: 64 * T1,\n    TIMER_D: 0 * T1,\n    TIMER_F: 64 * T1,\n    TIMER_H: 64 * T1,\n    TIMER_I: 0 * T1,\n    TIMER_J: 0 * T1,\n    TIMER_K: 0 * T4,\n    TIMER_L: 64 * T1,\n    TIMER_M: 64 * T1,\n    TIMER_N: 64 * T1,\n    PROVISIONAL_RESPONSE_INTERVAL: 60000 // See RFC 3261 Section 13.3.1.1\n  };\n\n  ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'].forEach(function (name) {\n    // can't just use timers[name].bind(timers) since it bypasses jasmine's\n    // clock-mocking\n    Timers[name] = function () {\n      return timers[name].apply(timers, arguments);\n    };\n  });\n\n  return Timers;\n};\n\n//# sourceURL=webpack://SIP/./src/Timers.js?");

/***/ }),

/***/ "./src/Transactions.js":
/*!*****************************!*\
  !*** ./src/Transactions.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP Transactions\n */\n\n/**\n * SIP Transactions module.\n * @augments SIP\n */\n\nmodule.exports = function (SIP) {\n  var C = {\n    // Transaction states\n    STATUS_TRYING: 1,\n    STATUS_PROCEEDING: 2,\n    STATUS_CALLING: 3,\n    STATUS_ACCEPTED: 4,\n    STATUS_COMPLETED: 5,\n    STATUS_TERMINATED: 6,\n    STATUS_CONFIRMED: 7,\n\n    // Transaction types\n    NON_INVITE_CLIENT: 'nict',\n    NON_INVITE_SERVER: 'nist',\n    INVITE_CLIENT: 'ict',\n    INVITE_SERVER: 'ist'\n  };\n\n  function buildViaHeader(request_sender, transport, id) {\n    var via;\n    via = 'SIP/2.0/' + (request_sender.ua.configuration.hackViaTcp ? 'TCP' : transport.server.scheme);\n    via += ' ' + request_sender.ua.configuration.viaHost + ';branch=' + id;\n    if (request_sender.ua.configuration.forceRport) {\n      via += ';rport';\n    }\n    return via;\n  }\n\n  /**\n  * @augments SIP.Transactions\n  * @class Non Invite Client Transaction\n  * @param {SIP.RequestSender} request_sender\n  * @param {SIP.OutgoingRequest} request\n  * @param {SIP.Transport} transport\n  */\n  var NonInviteClientTransaction = function NonInviteClientTransaction(request_sender, request, transport) {\n    var via;\n\n    this.type = C.NON_INVITE_CLIENT;\n    this.transport = transport;\n    this.transport.on('transportError', this.onTransportError.bind(this));\n    this.id = 'z9hG4bK' + Math.floor(Math.random() * 10000000);\n    this.request_sender = request_sender;\n    this.request = request;\n\n    this.logger = request_sender.ua.getLogger('sip.transaction.nict', this.id);\n\n    via = buildViaHeader(request_sender, transport, this.id);\n    this.request.setHeader('via', via);\n\n    this.request_sender.ua.newTransaction(this);\n  };\n  NonInviteClientTransaction.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  NonInviteClientTransaction.prototype.stateChanged = function (state) {\n    this.state = state;\n    this.emit('stateChanged');\n  };\n\n  NonInviteClientTransaction.prototype.send = function () {\n    var tr = this;\n\n    this.stateChanged(C.STATUS_TRYING);\n    this.F = SIP.Timers.setTimeout(tr.timer_F.bind(tr), SIP.Timers.TIMER_F);\n\n    if (!this.transport.send(this.request)) {\n      this.onTransportError();\n    }\n  };\n\n  NonInviteClientTransaction.prototype.onTransportError = function () {\n    this.logger.log('transport error occurred, deleting non-INVITE client transaction ' + this.id);\n    SIP.Timers.clearTimeout(this.F);\n    SIP.Timers.clearTimeout(this.K);\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.request_sender.ua.destroyTransaction(this);\n    this.request_sender.onTransportError();\n  };\n\n  NonInviteClientTransaction.prototype.timer_F = function () {\n    this.logger.debug('Timer F expired for non-INVITE client transaction ' + this.id);\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.request_sender.ua.destroyTransaction(this);\n    this.request_sender.onRequestTimeout();\n  };\n\n  NonInviteClientTransaction.prototype.timer_K = function () {\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.request_sender.ua.destroyTransaction(this);\n  };\n\n  NonInviteClientTransaction.prototype.receiveResponse = function (response) {\n    var tr = this,\n        status_code = response.status_code;\n\n    if (status_code < 200) {\n      switch (this.state) {\n        case C.STATUS_TRYING:\n        case C.STATUS_PROCEEDING:\n          this.stateChanged(C.STATUS_PROCEEDING);\n          this.request_sender.receiveResponse(response);\n          break;\n      }\n    } else {\n      switch (this.state) {\n        case C.STATUS_TRYING:\n        case C.STATUS_PROCEEDING:\n          this.stateChanged(C.STATUS_COMPLETED);\n          SIP.Timers.clearTimeout(this.F);\n\n          if (status_code === 408) {\n            this.request_sender.onRequestTimeout();\n          } else {\n            this.request_sender.receiveResponse(response);\n          }\n\n          this.K = SIP.Timers.setTimeout(tr.timer_K.bind(tr), SIP.Timers.TIMER_K);\n          break;\n        case C.STATUS_COMPLETED:\n          break;\n      }\n    }\n  };\n\n  /**\n  * @augments SIP.Transactions\n  * @class Invite Client Transaction\n  * @param {SIP.RequestSender} request_sender\n  * @param {SIP.OutgoingRequest} request\n  * @param {SIP.Transport} transport\n  */\n  var InviteClientTransaction = function InviteClientTransaction(request_sender, request, transport) {\n    var via,\n        tr = this;\n\n    this.type = C.INVITE_CLIENT;\n    this.transport = transport;\n    this.transport.on('transportError', this.onTransportError.bind(this));\n    this.id = 'z9hG4bK' + Math.floor(Math.random() * 10000000);\n    this.request_sender = request_sender;\n    this.request = request;\n\n    this.logger = request_sender.ua.getLogger('sip.transaction.ict', this.id);\n\n    via = buildViaHeader(request_sender, transport, this.id);\n    this.request.setHeader('via', via);\n\n    this.request_sender.ua.newTransaction(this);\n\n    // Add the cancel property to the request.\n    //Will be called from the request instance, not the transaction itself.\n    this.request.cancel = function (reason, extraHeaders) {\n      extraHeaders = (extraHeaders || []).slice();\n      var length = extraHeaders.length;\n      var extraHeadersString = null;\n      for (var idx = 0; idx < length; idx++) {\n        extraHeadersString = (extraHeadersString || '') + extraHeaders[idx].trim() + '\\r\\n';\n      }\n\n      tr.cancel_request(tr, reason, extraHeadersString);\n    };\n  };\n  InviteClientTransaction.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  InviteClientTransaction.prototype.stateChanged = function (state) {\n    this.state = state;\n    this.emit('stateChanged');\n  };\n\n  InviteClientTransaction.prototype.send = function () {\n    var tr = this;\n    this.stateChanged(C.STATUS_CALLING);\n    this.B = SIP.Timers.setTimeout(tr.timer_B.bind(tr), SIP.Timers.TIMER_B);\n\n    if (!this.transport.send(this.request)) {\n      this.onTransportError();\n    }\n  };\n\n  InviteClientTransaction.prototype.onTransportError = function () {\n    this.logger.log('transport error occurred, deleting INVITE client transaction ' + this.id);\n    SIP.Timers.clearTimeout(this.B);\n    SIP.Timers.clearTimeout(this.D);\n    SIP.Timers.clearTimeout(this.M);\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.request_sender.ua.destroyTransaction(this);\n\n    if (this.state !== C.STATUS_ACCEPTED) {\n      this.request_sender.onTransportError();\n    }\n  };\n\n  // RFC 6026 7.2\n  InviteClientTransaction.prototype.timer_M = function () {\n    this.logger.debug('Timer M expired for INVITE client transaction ' + this.id);\n\n    if (this.state === C.STATUS_ACCEPTED) {\n      SIP.Timers.clearTimeout(this.B);\n      this.stateChanged(C.STATUS_TERMINATED);\n      this.request_sender.ua.destroyTransaction(this);\n    }\n  };\n\n  // RFC 3261 17.1.1\n  InviteClientTransaction.prototype.timer_B = function () {\n    this.logger.debug('Timer B expired for INVITE client transaction ' + this.id);\n    if (this.state === C.STATUS_CALLING) {\n      this.stateChanged(C.STATUS_TERMINATED);\n      this.request_sender.ua.destroyTransaction(this);\n      this.request_sender.onRequestTimeout();\n    }\n  };\n\n  InviteClientTransaction.prototype.timer_D = function () {\n    this.logger.debug('Timer D expired for INVITE client transaction ' + this.id);\n    SIP.Timers.clearTimeout(this.B);\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.request_sender.ua.destroyTransaction(this);\n  };\n\n  InviteClientTransaction.prototype.sendACK = function (options) {\n    // TODO: Move PRACK stuff into the transaction layer. That is really where it should be\n\n    var self = this,\n        ruri;\n    options = options || {};\n\n    if (this.response.getHeader('contact')) {\n      ruri = this.response.parseHeader('contact').uri;\n    } else {\n      ruri = this.request.ruri;\n    }\n    var ack = new SIP.OutgoingRequest(\"ACK\", ruri, this.request.ua, {\n      cseq: this.response.cseq,\n      call_id: this.response.call_id,\n      from_uri: this.response.from.uri,\n      from_tag: this.response.from_tag,\n      to_uri: this.response.to.uri,\n      to_tag: this.response.to_tag,\n      route_set: this.response.getHeaders('record-route').reverse()\n    }, options.extraHeaders || [], options.body);\n\n    this.ackSender = new SIP.RequestSender({\n      request: ack,\n      onRequestTimeout: this.request_sender.applicant.applicant ? this.request_sender.applicant.applicant.onRequestTimeout : function () {\n        self.logger.warn(\"ACK Request timed out\");\n      },\n      onTransportError: this.request_sender.applicant.applicant ? this.request_sender.applicant.applicant.onRequestTransportError : function () {\n        self.logger.warn(\"ACK Request had a transport error\");\n      },\n      receiveResponse: options.receiveResponse || function () {\n        self.logger.warn(\"Received a response to an ACK which was unexpected. Dropping Response.\");\n      }\n    }, this.request.ua).send();\n\n    return ack;\n  };\n\n  InviteClientTransaction.prototype.cancel_request = function (tr, reason, extraHeaders) {\n    var request = tr.request;\n\n    this.cancel = SIP.C.CANCEL + ' ' + request.ruri + ' SIP/2.0\\r\\n';\n    this.cancel += 'Via: ' + request.headers['Via'].toString() + '\\r\\n';\n\n    if (this.request.headers['Route']) {\n      this.cancel += 'Route: ' + request.headers['Route'].toString() + '\\r\\n';\n    }\n\n    this.cancel += 'To: ' + request.headers['To'].toString() + '\\r\\n';\n    this.cancel += 'From: ' + request.headers['From'].toString() + '\\r\\n';\n    this.cancel += 'Call-ID: ' + request.headers['Call-ID'].toString() + '\\r\\n';\n    this.cancel += 'CSeq: ' + request.headers['CSeq'].toString().split(' ')[0] + ' CANCEL\\r\\n';\n\n    if (reason) {\n      this.cancel += 'Reason: ' + reason + '\\r\\n';\n    }\n\n    if (extraHeaders) {\n      this.cancel += extraHeaders;\n    }\n\n    this.cancel += 'Content-Length: 0\\r\\n\\r\\n';\n\n    // Send only if a provisional response (>100) has been received.\n    if (this.state === C.STATUS_PROCEEDING) {\n      this.transport.send(this.cancel);\n    }\n  };\n\n  InviteClientTransaction.prototype.receiveResponse = function (response) {\n    var tr = this,\n        status_code = response.status_code;\n\n    // This may create a circular dependency...\n    response.transaction = this;\n\n    if (this.response && this.response.status_code === response.status_code && this.response.cseq === response.cseq) {\n      this.logger.debug(\"ICT Received a retransmission for cseq: \" + response.cseq);\n      if (this.ackSender) {\n        this.ackSender.send();\n      }\n      return;\n    }\n    this.response = response;\n\n    if (status_code >= 100 && status_code <= 199) {\n      switch (this.state) {\n        case C.STATUS_CALLING:\n          this.stateChanged(C.STATUS_PROCEEDING);\n          this.request_sender.receiveResponse(response);\n          if (this.cancel) {\n            this.transport.send(this.cancel);\n          }\n          break;\n        case C.STATUS_PROCEEDING:\n          this.request_sender.receiveResponse(response);\n          break;\n      }\n    } else if (status_code >= 200 && status_code <= 299) {\n      switch (this.state) {\n        case C.STATUS_CALLING:\n        case C.STATUS_PROCEEDING:\n          this.stateChanged(C.STATUS_ACCEPTED);\n          this.M = SIP.Timers.setTimeout(tr.timer_M.bind(tr), SIP.Timers.TIMER_M);\n          this.request_sender.receiveResponse(response);\n          break;\n        case C.STATUS_ACCEPTED:\n          this.request_sender.receiveResponse(response);\n          break;\n      }\n    } else if (status_code >= 300 && status_code <= 699) {\n      switch (this.state) {\n        case C.STATUS_CALLING:\n        case C.STATUS_PROCEEDING:\n          this.stateChanged(C.STATUS_COMPLETED);\n          this.sendACK();\n          this.request_sender.receiveResponse(response);\n          break;\n        case C.STATUS_COMPLETED:\n          this.sendACK();\n          break;\n      }\n    }\n  };\n\n  /**\n   * @augments SIP.Transactions\n   * @class ACK Client Transaction\n   * @param {SIP.RequestSender} request_sender\n   * @param {SIP.OutgoingRequest} request\n   * @param {SIP.Transport} transport\n   */\n  var AckClientTransaction = function AckClientTransaction(request_sender, request, transport) {\n    var via;\n\n    this.transport = transport;\n    this.transport.on('transportError', this.onTransportError.bind(this));\n    this.id = 'z9hG4bK' + Math.floor(Math.random() * 10000000);\n    this.request_sender = request_sender;\n    this.request = request;\n\n    this.logger = request_sender.ua.getLogger('sip.transaction.nict', this.id);\n\n    via = buildViaHeader(request_sender, transport, this.id);\n    this.request.setHeader('via', via);\n  };\n  AckClientTransaction.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  AckClientTransaction.prototype.send = function () {\n    if (!this.transport.send(this.request)) {\n      this.onTransportError();\n    }\n  };\n\n  AckClientTransaction.prototype.onTransportError = function () {\n    this.logger.log('transport error occurred, for an ACK client transaction ' + this.id);\n    this.request_sender.onTransportError();\n  };\n\n  /**\n  * @augments SIP.Transactions\n  * @class Non Invite Server Transaction\n  * @param {SIP.IncomingRequest} request\n  * @param {SIP.UA} ua\n  */\n  var NonInviteServerTransaction = function NonInviteServerTransaction(request, ua) {\n    this.type = C.NON_INVITE_SERVER;\n    this.id = request.via_branch;\n    this.request = request;\n    this.transport = request.transport;\n    this.ua = ua;\n    this.last_response = '';\n    request.server_transaction = this;\n\n    this.logger = ua.getLogger('sip.transaction.nist', this.id);\n\n    this.state = C.STATUS_TRYING;\n\n    ua.newTransaction(this);\n  };\n  NonInviteServerTransaction.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  NonInviteServerTransaction.prototype.stateChanged = function (state) {\n    this.state = state;\n    this.emit('stateChanged');\n  };\n\n  NonInviteServerTransaction.prototype.timer_J = function () {\n    this.logger.debug('Timer J expired for non-INVITE server transaction ' + this.id);\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.ua.destroyTransaction(this);\n  };\n\n  NonInviteServerTransaction.prototype.onTransportError = function () {\n    if (!this.transportError) {\n      this.transportError = true;\n\n      this.logger.log('transport error occurred, deleting non-INVITE server transaction ' + this.id);\n\n      SIP.Timers.clearTimeout(this.J);\n      this.stateChanged(C.STATUS_TERMINATED);\n      this.ua.destroyTransaction(this);\n    }\n  };\n\n  NonInviteServerTransaction.prototype.receiveResponse = function (status_code, response) {\n    var tr = this;\n    var deferred = SIP.Utils.defer();\n\n    if (status_code === 100) {\n      /* RFC 4320 4.1\n       * 'A SIP element MUST NOT\n       * send any provisional response with a\n       * Status-Code other than 100 to a non-INVITE request.'\n       */\n      switch (this.state) {\n        case C.STATUS_TRYING:\n          this.stateChanged(C.STATUS_PROCEEDING);\n          if (!this.transport.send(response)) {\n            this.onTransportError();\n          }\n          break;\n        case C.STATUS_PROCEEDING:\n          this.last_response = response;\n          if (!this.transport.send(response)) {\n            this.onTransportError();\n            deferred.reject();\n          } else {\n            deferred.resolve();\n          }\n          break;\n      }\n    } else if (status_code >= 200 && status_code <= 699) {\n      switch (this.state) {\n        case C.STATUS_TRYING:\n        case C.STATUS_PROCEEDING:\n          this.stateChanged(C.STATUS_COMPLETED);\n          this.last_response = response;\n          this.J = SIP.Timers.setTimeout(tr.timer_J.bind(tr), SIP.Timers.TIMER_J);\n          if (!this.transport.send(response)) {\n            this.onTransportError();\n            deferred.reject();\n          } else {\n            deferred.resolve();\n          }\n          break;\n        case C.STATUS_COMPLETED:\n          break;\n      }\n    }\n\n    return deferred.promise;\n  };\n\n  /**\n  * @augments SIP.Transactions\n  * @class Invite Server Transaction\n  * @param {SIP.IncomingRequest} request\n  * @param {SIP.UA} ua\n  */\n  var InviteServerTransaction = function InviteServerTransaction(request, ua) {\n    this.type = C.INVITE_SERVER;\n    this.id = request.via_branch;\n    this.request = request;\n    this.transport = request.transport;\n    this.ua = ua;\n    this.last_response = '';\n    request.server_transaction = this;\n\n    this.logger = ua.getLogger('sip.transaction.ist', this.id);\n\n    this.state = C.STATUS_PROCEEDING;\n\n    ua.newTransaction(this);\n\n    this.resendProvisionalTimer = null;\n\n    request.reply(100);\n  };\n  InviteServerTransaction.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  InviteServerTransaction.prototype.stateChanged = function (state) {\n    this.state = state;\n    this.emit('stateChanged');\n  };\n\n  InviteServerTransaction.prototype.timer_H = function () {\n    this.logger.debug('Timer H expired for INVITE server transaction ' + this.id);\n\n    if (this.state === C.STATUS_COMPLETED) {\n      this.logger.warn('transactions', 'ACK for INVITE server transaction was never received, call will be terminated');\n    }\n\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.ua.destroyTransaction(this);\n  };\n\n  InviteServerTransaction.prototype.timer_I = function () {\n    this.stateChanged(C.STATUS_TERMINATED);\n    this.ua.destroyTransaction(this);\n  };\n\n  // RFC 6026 7.1\n  InviteServerTransaction.prototype.timer_L = function () {\n    this.logger.debug('Timer L expired for INVITE server transaction ' + this.id);\n\n    if (this.state === C.STATUS_ACCEPTED) {\n      this.stateChanged(C.STATUS_TERMINATED);\n      this.ua.destroyTransaction(this);\n    }\n  };\n\n  InviteServerTransaction.prototype.onTransportError = function () {\n    if (!this.transportError) {\n      this.transportError = true;\n\n      this.logger.log('transport error occurred, deleting INVITE server transaction ' + this.id);\n\n      if (this.resendProvisionalTimer !== null) {\n        SIP.Timers.clearInterval(this.resendProvisionalTimer);\n        this.resendProvisionalTimer = null;\n      }\n\n      SIP.Timers.clearTimeout(this.L);\n      SIP.Timers.clearTimeout(this.H);\n      SIP.Timers.clearTimeout(this.I);\n\n      this.stateChanged(C.STATUS_TERMINATED);\n      this.ua.destroyTransaction(this);\n    }\n  };\n\n  InviteServerTransaction.prototype.resend_provisional = function () {\n    if (!this.transport.send(this.last_response)) {\n      this.onTransportError();\n    }\n  };\n\n  // INVITE Server Transaction RFC 3261 17.2.1\n  InviteServerTransaction.prototype.receiveResponse = function (status_code, response) {\n    var tr = this;\n    var deferred = SIP.Utils.defer();\n\n    if (status_code >= 100 && status_code <= 199) {\n      switch (this.state) {\n        case C.STATUS_PROCEEDING:\n          if (!this.transport.send(response)) {\n            this.onTransportError();\n          }\n          this.last_response = response;\n          break;\n      }\n    }\n\n    if (status_code > 100 && status_code <= 199 && this.state === C.STATUS_PROCEEDING) {\n      // Trigger the resendProvisionalTimer only for the first non 100 provisional response.\n      if (this.resendProvisionalTimer === null) {\n        this.resendProvisionalTimer = SIP.Timers.setInterval(tr.resend_provisional.bind(tr), SIP.Timers.PROVISIONAL_RESPONSE_INTERVAL);\n      }\n    } else if (status_code >= 200 && status_code <= 299) {\n      switch (this.state) {\n        case C.STATUS_PROCEEDING:\n          this.stateChanged(C.STATUS_ACCEPTED);\n          this.last_response = response;\n          this.L = SIP.Timers.setTimeout(tr.timer_L.bind(tr), SIP.Timers.TIMER_L);\n\n          if (this.resendProvisionalTimer !== null) {\n            SIP.Timers.clearInterval(this.resendProvisionalTimer);\n            this.resendProvisionalTimer = null;\n          }\n        /* falls through */\n        case C.STATUS_ACCEPTED:\n          // Note that this point will be reached for proceeding tr.state also.\n          // if(!this.transport.send(response)) {\n          //   this.onTransportError();\n          //   deferred.reject();\n          // } else {\n          //   deferred.resolve();\n          // }\n          try {\n            this.transport.send(response);\n          } catch (error) {\n            this.logger.error(error);\n            this.onTransportError();\n            deferred.reject();\n          }\n          deferred.resolve();\n          break;\n      }\n    } else if (status_code >= 300 && status_code <= 699) {\n      switch (this.state) {\n        case C.STATUS_PROCEEDING:\n          if (this.resendProvisionalTimer !== null) {\n            SIP.Timers.clearInterval(this.resendProvisionalTimer);\n            this.resendProvisionalTimer = null;\n          }\n\n          // if(!this.transport.send(response)) {\n          //   this.onTransportError();\n          //   deferred.reject();\n          // } else {\n          try {\n            this.transport.send(response);\n          } catch (error) {\n            this.logger.error(error);\n            this.onTransportError();\n            deferred.reject();\n          }\n          this.stateChanged(C.STATUS_COMPLETED);\n          this.H = SIP.Timers.setTimeout(tr.timer_H.bind(tr), SIP.Timers.TIMER_H);\n          deferred.resolve();\n          break;\n      }\n    }\n\n    return deferred.promise;\n  };\n\n  /**\n   * @function\n   * @param {SIP.UA} ua\n   * @param {SIP.IncomingRequest} request\n   *\n   * @return {boolean}\n   * INVITE:\n   *  _true_ if retransmission\n   *  _false_ new request\n   *\n   * ACK:\n   *  _true_  ACK to non2xx response\n   *  _false_ ACK must be passed to TU (accepted state)\n   *          ACK to 2xx response\n   *\n   * CANCEL:\n   *  _true_  no matching invite transaction\n   *  _false_ matching invite transaction and no final response sent\n   *\n   * OTHER:\n   *  _true_  retransmission\n   *  _false_ new request\n   */\n  var checkTransaction = function checkTransaction(ua, request) {\n    var tr;\n\n    switch (request.method) {\n      case SIP.C.INVITE:\n        tr = ua.transactions.ist[request.via_branch];\n        if (tr) {\n          switch (tr.state) {\n            case C.STATUS_PROCEEDING:\n              tr.transport.send(tr.last_response);\n              break;\n\n            // RFC 6026 7.1 Invite retransmission\n            //received while in C.STATUS_ACCEPTED state. Absorb it.\n            case C.STATUS_ACCEPTED:\n              break;\n          }\n          return true;\n        }\n        break;\n      case SIP.C.ACK:\n        tr = ua.transactions.ist[request.via_branch];\n\n        // RFC 6026 7.1\n        if (tr) {\n          if (tr.state === C.STATUS_ACCEPTED) {\n            return false;\n          } else if (tr.state === C.STATUS_COMPLETED) {\n            tr.stateChanged(C.STATUS_CONFIRMED);\n            tr.I = SIP.Timers.setTimeout(tr.timer_I.bind(tr), SIP.Timers.TIMER_I);\n            return true;\n          }\n        }\n\n        // ACK to 2XX Response.\n        else {\n            return false;\n          }\n        break;\n      case SIP.C.CANCEL:\n        tr = ua.transactions.ist[request.via_branch];\n        if (tr) {\n          request.reply_sl(200);\n          if (tr.state === C.STATUS_PROCEEDING) {\n            return false;\n          } else {\n            return true;\n          }\n        } else {\n          request.reply_sl(481);\n          return true;\n        }\n      default:\n\n        // Non-INVITE Server Transaction RFC 3261 17.2.2\n        tr = ua.transactions.nist[request.via_branch];\n        if (tr) {\n          switch (tr.state) {\n            case C.STATUS_TRYING:\n              break;\n            case C.STATUS_PROCEEDING:\n            case C.STATUS_COMPLETED:\n              tr.transport.send(tr.last_response);\n              break;\n          }\n          return true;\n        }\n        break;\n    }\n  };\n\n  SIP.Transactions = {\n    C: C,\n    checkTransaction: checkTransaction,\n    NonInviteClientTransaction: NonInviteClientTransaction,\n    InviteClientTransaction: InviteClientTransaction,\n    AckClientTransaction: AckClientTransaction,\n    NonInviteServerTransaction: NonInviteServerTransaction,\n    InviteServerTransaction: InviteServerTransaction\n  };\n};\n\n//# sourceURL=webpack://SIP/./src/Transactions.js?");

/***/ }),

/***/ "./src/Transport.js":
/*!**************************!*\
  !*** ./src/Transport.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/* eslint-disable */\n/**\n * @fileoverview Transport\n */\n\n/* Transport\n * @class Abstract transport layer parent class\n * @param {Logger} logger\n * @param {Object} [options]\n */\n\nmodule.exports = function (SIP) {\n  var Transport = function Transport(logger, options) {};\n\n  Transport.prototype = Object.create(SIP.EventEmitter.prototype, {\n\n    /**\n    * Returns the promise designated by the child layer then emits a connected event. Automatically emits an event upon resolution, unless overrideEvent is set. If you override the event in this fashion, you should emit it in your implementation of connectPromise\n    * @param {Object} [options]\n    * @returns {Promise}\n    */\n    connect: { writable: true, value: function connect(options) {\n        options = options || {};\n        return this.connectPromise(options).then(function (overrideEvent) {\n          !overrideEvent && this.emit('connected');\n        }.bind(this));\n      } },\n\n    /**\n    * Called by connect, must return a promise\n    * @abstract\n    * @param {Object} [options]\n    * @returns {Promise}\n    */\n    connectPromise: { writable: true, value: function connectPromise(options) {} },\n\n    /**\n    * Returns true if the transport is connected\n    * @abstract\n    * @returns {Boolean}\n    */\n    isConnected: { writable: true, value: function isConnected() {} },\n\n    /**\n    * Sends a message then emits a sentMsg event. Automatically emits an event upon resolution, unless data.overrideEvent is set. If you override the event in this fashion, you should emit it in your implementation of sendMsgPromise\n    * @param {SIP.OutgoingRequest|String} msg\n    * @param {Object} options\n    * @returns {Promise}\n    */\n    send: { writable: true, value: function send(msg, options) {\n        options = options || {};\n        return this.sendMsgPromise(msg).then(function (data) {\n          !data.overrideEvent && this.emit('sentMsg', data.msg);\n        }.bind(this));\n      } },\n\n    /**\n    * Called by send, must return a promise\n    * @abstract\n    * @param {SIP.OutgoingRequest|String} msg\n    * @param {Object} [options]\n    * @returns {Promise}\n    */\n    sendMsgPromise: { writable: true, value: function sendMsgPromise(msg, options) {} },\n\n    /**\n    * To be called when a message is received\n    * @abstract\n    * @param {Event} e\n    */\n    onMessage: { writable: true, value: function onMessage(e) {} },\n\n    /**\n    * Returns the promise designated by the child layer then emits a disconnected event. Automatically emits an event upon resolution, unless overrideEvent is set. If you override the event in this fashion, you should emit it in your implementation of disconnectPromise\n    * @param {Object} [options]\n    * @returns {Promise}\n    */\n    disconnect: { writable: true, value: function disconnect(options) {\n        options = options || {};\n        return this.disconnectPromise(options).then(function (overrideEvent) {\n          !overrideEvent && this.emit('disconnected');\n        }.bind(this));\n      } },\n\n    /**\n    * Called by disconnect, must return a promise\n    * @abstract\n    * @param {Object} [options]\n    * @returns {Promise}\n    */\n    disconnectPromise: { writable: true, value: function disconnectPromise(options) {} },\n\n    afterConnected: { writable: true, value: function afterConnected(callback) {\n        if (this.isConnected()) {\n          callback();\n        } else {\n          this.once('connected', callback);\n        }\n      } },\n\n    /**\n     * Returns a promise which resolves once the UA is connected.\n     * @returns {Promise}\n     */\n    waitForConnected: { writable: true, value: function waitForConnected() {\n        return new SIP.Utils.Promise(function (resolve) {\n          this.afterConnected(resolve);\n        }.bind(this));\n      } }\n  });\n\n  return Transport;\n};\n\n//# sourceURL=webpack://SIP/./src/Transport.js?");

/***/ }),

/***/ "./src/UA.js":
/*!*******************!*\
  !*** ./src/UA.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {\n/**\n * @augments SIP\n * @class Class creating a SIP User Agent.\n * @param {function returning SIP.sessionDescriptionHandler} [configuration.sessionDescriptionHandlerFactory]\n *        A function will be invoked by each of the UA's Sessions to build the sessionDescriptionHandler for that Session.\n *        If no (or a falsy) value is provided, each Session will use a default (WebRTC) sessionDescriptionHandler.\n *\n * @param {Object} [configuration.media] gets passed to SIP.sessionDescriptionHandler.getDescription as mediaHint\n */\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nmodule.exports = function (SIP, environment) {\n  var UA,\n      C = {\n    // UA status codes\n    STATUS_INIT: 0,\n    STATUS_STARTING: 1,\n    STATUS_READY: 2,\n    STATUS_USER_CLOSED: 3,\n    STATUS_NOT_READY: 4,\n\n    // UA error codes\n    CONFIGURATION_ERROR: 1,\n    NETWORK_ERROR: 2,\n\n    ALLOWED_METHODS: ['ACK', 'CANCEL', 'INVITE', 'MESSAGE', 'BYE', 'OPTIONS', 'INFO', 'NOTIFY', 'REFER'],\n\n    ACCEPTED_BODY_TYPES: ['application/sdp', 'application/dtmf-relay'],\n\n    MAX_FORWARDS: 70,\n    TAG_LENGTH: 10\n  };\n\n  UA = function UA(configuration) {\n    var self = this;\n\n    // Helper function for forwarding events\n    function selfEmit(type) {\n      //registrationFailed handler is invoked with two arguments. Allow event handlers to be invoked with a variable no. of arguments\n      return self.emit.bind(self, type);\n    }\n\n    // Set Accepted Body Types\n    C.ACCEPTED_BODY_TYPES = C.ACCEPTED_BODY_TYPES.toString();\n\n    this.log = new SIP.LoggerFactory();\n    this.logger = this.getLogger('sip.ua');\n\n    this.cache = {\n      credentials: {}\n    };\n\n    this.configuration = {};\n    this.dialogs = {};\n\n    //User actions outside any session/dialog (MESSAGE)\n    this.applicants = {};\n\n    this.data = {};\n    this.sessions = {};\n    this.subscriptions = {};\n    this.earlySubscriptions = {};\n    this.publishers = {};\n    this.transport = null;\n    this.contact = null;\n    this.status = C.STATUS_INIT;\n    this.error = null;\n    this.transactions = {\n      nist: {},\n      nict: {},\n      ist: {},\n      ict: {}\n    };\n\n    this.transportRecoveryTimer = null;\n\n    Object.defineProperties(this, {\n      transactionsCount: {\n        get: function get() {\n          var type,\n              transactions = ['nist', 'nict', 'ist', 'ict'],\n              count = 0;\n\n          for (type in transactions) {\n            count += Object.keys(this.transactions[transactions[type]]).length;\n          }\n\n          return count;\n        }\n      },\n\n      nictTransactionsCount: {\n        get: function get() {\n          return Object.keys(this.transactions['nict']).length;\n        }\n      },\n\n      nistTransactionsCount: {\n        get: function get() {\n          return Object.keys(this.transactions['nist']).length;\n        }\n      },\n\n      ictTransactionsCount: {\n        get: function get() {\n          return Object.keys(this.transactions['ict']).length;\n        }\n      },\n\n      istTransactionsCount: {\n        get: function get() {\n          return Object.keys(this.transactions['ist']).length;\n        }\n      }\n    });\n\n    /**\n     * Load configuration\n     *\n     * @throws {SIP.Exceptions.ConfigurationError}\n     * @throws {TypeError}\n     */\n\n    if (configuration === undefined) {\n      configuration = {};\n    } else if (typeof configuration === 'string' || configuration instanceof String) {\n      configuration = {\n        uri: configuration\n      };\n    }\n\n    // Apply log configuration if present\n    if (configuration.log) {\n      if (configuration.log.hasOwnProperty('builtinEnabled')) {\n        this.log.builtinEnabled = configuration.log.builtinEnabled;\n      }\n\n      if (configuration.log.hasOwnProperty('level')) {\n        this.log.level = configuration.log.level;\n      }\n\n      if (configuration.log.hasOwnProperty('connector')) {\n        this.log.connector = configuration.log.connector;\n      }\n    }\n\n    try {\n      this.loadConfig(configuration);\n    } catch (e) {\n      this.status = C.STATUS_NOT_READY;\n      this.error = C.CONFIGURATION_ERROR;\n      throw e;\n    }\n\n    // Initialize registerContext\n    this.registerContext = new SIP.RegisterContext(this);\n    this.registerContext.on('failed', selfEmit('registrationFailed'));\n    this.registerContext.on('registered', selfEmit('registered'));\n    this.registerContext.on('unregistered', selfEmit('unregistered'));\n\n    if (this.configuration.autostart) {\n      this.start();\n    }\n  };\n  UA.prototype = Object.create(SIP.EventEmitter.prototype);\n\n  //=================\n  //  High Level API\n  //=================\n\n  UA.prototype.register = function (options) {\n    this.configuration.register = true;\n    this.registerContext.register(options);\n\n    return this;\n  };\n\n  /**\n   * Unregister.\n   *\n   * @param {Boolean} [all] unregister all user bindings.\n   *\n   */\n  UA.prototype.unregister = function (options) {\n    this.configuration.register = false;\n\n    var context = this.registerContext;\n    this.transport.afterConnected(context.unregister.bind(context, options));\n\n    return this;\n  };\n\n  UA.prototype.isRegistered = function () {\n    return this.registerContext.registered;\n  };\n\n  /**\n   * Make an outgoing call.\n   *\n   * @param {String} target\n   * @param {Object} views\n   * @param {Object} [options.media] gets passed to SIP.sessionDescriptionHandler.getDescription as mediaHint\n   *\n   * @throws {TypeError}\n   *\n   */\n  UA.prototype.invite = function (target, options, modifiers) {\n    var context = new SIP.InviteClientContext(this, target, options, modifiers);\n    // Delay sending actual invite until the next 'tick' if we are already\n    // connected, so that API consumers can register to events fired by the\n    // the session.\n    this.transport.afterConnected(function () {\n      context.invite();\n      this.emit('inviteSent', context);\n    }.bind(this));\n    return context;\n  };\n\n  UA.prototype.subscribe = function (target, event, options) {\n    var sub = new SIP.Subscription(this, target, event, options);\n\n    this.transport.afterConnected(sub.subscribe.bind(sub));\n    return sub;\n  };\n\n  /**\n   * Send PUBLISH Event State Publication (RFC3903)\n   *\n   * @param {String} target\n   * @param {String} event\n   * @param {String} body\n   * @param {Object} [options]\n   *\n   * @throws {SIP.Exceptions.MethodParameterError}\n   *\n   */\n  UA.prototype.publish = function (target, event, body, options) {\n    var pub = new SIP.PublishContext(this, target, event, options);\n\n    this.transport.afterConnected(pub.publish.bind(pub, body));\n    return pub;\n  };\n\n  /**\n   * Send a message.\n   *\n   * @param {String} target\n   * @param {String} body\n   * @param {Object} [options]\n   *\n   * @throws {TypeError}\n   *\n   */\n  UA.prototype.message = function (target, body, options) {\n    if (body === undefined) {\n      throw new TypeError('Not enough arguments');\n    }\n\n    // There is no Message module, so it is okay that the UA handles defaults here.\n    options = Object.create(options || Object.prototype);\n    options.contentType || (options.contentType = 'text/plain');\n    options.body = body;\n\n    return this.request(SIP.C.MESSAGE, target, options);\n  };\n\n  UA.prototype.request = function (method, target, options) {\n    var req = new SIP.ClientContext(this, method, target, options);\n\n    this.transport.afterConnected(req.send.bind(req));\n    return req;\n  };\n\n  /**\n   * Gracefully close.\n   *\n   */\n  UA.prototype.stop = function () {\n    var session,\n        subscription,\n        applicant,\n        publisher,\n        ua = this;\n\n    function transactionsListener() {\n      if (ua.nistTransactionsCount === 0 && ua.nictTransactionsCount === 0) {\n        ua.removeListener('transactionDestroyed', transactionsListener);\n        ua.transport.disconnect();\n      }\n    }\n\n    this.logger.log('user requested closure...');\n\n    if (this.status === C.STATUS_USER_CLOSED) {\n      this.logger.warn('UA already closed');\n      return this;\n    }\n\n    // Close registerContext\n    this.logger.log('closing registerContext');\n    this.registerContext.close();\n\n    // Run  _terminate_ on every Session\n    for (session in this.sessions) {\n      this.logger.log('closing session ' + session);\n      this.sessions[session].terminate();\n    }\n\n    //Run _close_ on every confirmed Subscription\n    for (subscription in this.subscriptions) {\n      this.logger.log('unsubscribing from subscription ' + subscription);\n      this.subscriptions[subscription].close();\n    }\n\n    //Run _close_ on every early Subscription\n    for (subscription in this.earlySubscriptions) {\n      this.logger.log('unsubscribing from early subscription ' + subscription);\n      this.earlySubscriptions[subscription].close();\n    }\n\n    //Run _close_ on every Publisher\n    for (publisher in this.publishers) {\n      this.logger.log('unpublish ' + publisher);\n      this.publishers[publisher].close();\n    }\n\n    // Run  _close_ on every applicant\n    for (applicant in this.applicants) {\n      this.applicants[applicant].close();\n    }\n\n    this.status = C.STATUS_USER_CLOSED;\n\n    /*\n     * If the remaining transactions are all INVITE transactions, there is no need to\n     * wait anymore because every session has already been closed by this method.\n     * - locally originated sessions where terminated (CANCEL or BYE)\n     * - remotely originated sessions where rejected (4XX) or terminated (BYE)\n     * Remaining INVITE transactions belong tho sessions that where answered. This are in\n     * 'accepted' state due to timers 'L' and 'M' defined in [RFC 6026]\n     */\n    if (this.nistTransactionsCount === 0 && this.nictTransactionsCount === 0) {\n      this.transport.disconnect();\n    } else {\n      this.on('transactionDestroyed', transactionsListener);\n    }\n\n    if (typeof environment.removeEventListener === 'function') {\n      // Google Chrome Packaged Apps don't allow 'unload' listeners:\n      // unload is not available in packaged apps\n      if (!(global.chrome && global.chrome.app && global.chrome.app.runtime)) {\n        environment.removeEventListener('unload', this.environListener);\n      }\n    }\n\n    return this;\n  };\n\n  /**\n   * Connect to the WS server if status = STATUS_INIT.\n   * Resume UA after being closed.\n   *\n   */\n  UA.prototype.start = function () {\n    // var server;\n\n    this.logger.log('user requested startup...');\n    if (this.status === C.STATUS_INIT) {\n      this.status = C.STATUS_STARTING;\n      if (!this.configuration.transportConstructor) {\n        throw new SIP.Exceptions.TransportError(\"Transport constructor not set\");\n      }\n      this.transport = new this.configuration.transportConstructor(this.getLogger('sip.transport'), this.configuration.transportOptions);\n      this.setTransportListeners();\n      this.emit('transportCreated', this.transport);\n      this.transport.connect();\n    } else if (this.status === C.STATUS_USER_CLOSED) {\n      this.logger.log('resuming');\n      this.status = C.STATUS_READY;\n      this.transport.connect();\n    } else if (this.status === C.STATUS_STARTING) {\n      this.logger.log('UA is in STARTING status, not opening new connection');\n    } else if (this.status === C.STATUS_READY) {\n      this.logger.log('UA is in READY status, not resuming');\n    } else {\n      this.logger.error('Connection is down. Auto-Recovery system is trying to connect');\n    }\n\n    if (this.configuration.autostop && typeof environment.addEventListener === 'function') {\n      // Google Chrome Packaged Apps don't allow 'unload' listeners:\n      // unload is not available in packaged apps\n      if (!(global.chrome && global.chrome.app && global.chrome.app.runtime)) {\n        this.environListener = this.stop.bind(this);\n        environment.addEventListener('unload', this.environListener);\n      }\n    }\n\n    return this;\n  };\n\n  /**\n   * Normalize a string into a valid SIP request URI\n   *\n   * @param {String} target\n   *\n   * @returns {SIP.URI|undefined}\n   */\n  UA.prototype.normalizeTarget = function (target) {\n    return SIP.Utils.normalizeTarget(target, this.configuration.hostportParams);\n  };\n\n  //===============================\n  //  Private (For internal use)\n  //===============================\n\n  UA.prototype.saveCredentials = function (credentials) {\n    this.cache.credentials[credentials.realm] = this.cache.credentials[credentials.realm] || {};\n    this.cache.credentials[credentials.realm][credentials.uri] = credentials;\n\n    return this;\n  };\n\n  UA.prototype.getCredentials = function (request) {\n    var realm, credentials;\n\n    realm = request.ruri.host;\n\n    if (this.cache.credentials[realm] && this.cache.credentials[realm][request.ruri]) {\n      credentials = this.cache.credentials[realm][request.ruri];\n      credentials.method = request.method;\n    }\n\n    return credentials;\n  };\n\n  UA.prototype.getLogger = function (category, label) {\n    return this.log.getLogger(category, label);\n  };\n\n  //==============================\n  // Event Handlers\n  //==============================\n\n\n  UA.prototype.onTransportError = function () {\n    if (this.status === C.STATUS_USER_CLOSED) {\n      return;\n    }\n\n    if (!this.error || this.error !== C.NETWORK_ERROR) {\n      this.status = C.STATUS_NOT_READY;\n      this.error = C.NETWORK_ERROR;\n    }\n  };\n\n  /**\n   * Helper function. Sets transport listeners\n   * @private\n   */\n  UA.prototype.setTransportListeners = function () {\n    this.transport.on('connected', this.onTransportConnected.bind(this));\n    this.transport.on('message', this.onTransportReceiveMsg.bind(this));\n    this.transport.on('transportError', this.onTransportError.bind(this));\n  };\n\n  /**\n   * Transport connection event.\n   * @private\n   * @event\n   * @param {SIP.Transport} transport.\n   */\n  UA.prototype.onTransportConnected = function () {\n    if (this.configuration.register) {\n      this.configuration.authenticationFactory.initialize().then(function () {\n        this.registerContext.onTransportConnected();\n      }.bind(this));\n    }\n  };\n\n  /**\n   * Transport message receipt event.\n   * @private\n   * @event\n   * @param {String} message\n   */\n\n  UA.prototype.onTransportReceiveMsg = function (message) {\n    var transaction;\n    message = SIP.Parser.parseMessage(message, this);\n\n    if (this.status === SIP.UA.C.STATUS_USER_CLOSED && message instanceof SIP.IncomingRequest) {\n      this.logger.warn('UA received message when status = USER_CLOSED - aborting');\n      return;\n    }\n    // Do some sanity check\n    if (SIP.sanityCheck(message, this, this.transport)) {\n      if (message instanceof SIP.IncomingRequest) {\n        message.transport = this.transport;\n        this.receiveRequest(message);\n      } else if (message instanceof SIP.IncomingResponse) {\n        /* Unike stated in 18.1.2, if a response does not match\n        * any transaction, it is discarded here and no passed to the core\n        * in order to be discarded there.\n        */\n        switch (message.method) {\n          case SIP.C.INVITE:\n            transaction = this.transactions.ict[message.via_branch];\n            if (transaction) {\n              transaction.receiveResponse(message);\n            }\n            break;\n          case SIP.C.ACK:\n            // Just in case ;-)\n            break;\n          default:\n            transaction = this.transactions.nict[message.via_branch];\n            if (transaction) {\n              transaction.receiveResponse(message);\n            }\n            break;\n        }\n      }\n    }\n  };\n\n  /**\n   * new Transaction\n   * @private\n   * @param {SIP.Transaction} transaction.\n   */\n  UA.prototype.newTransaction = function (transaction) {\n    this.transactions[transaction.type][transaction.id] = transaction;\n    this.emit('newTransaction', { transaction: transaction });\n  };\n\n  /**\n   * destroy Transaction\n   * @private\n   * @param {SIP.Transaction} transaction.\n   */\n  UA.prototype.destroyTransaction = function (transaction) {\n    delete this.transactions[transaction.type][transaction.id];\n    this.emit('transactionDestroyed', {\n      transaction: transaction\n    });\n  };\n\n  //=========================\n  // receiveRequest\n  //=========================\n\n  /**\n   * Request reception\n   * @private\n   * @param {SIP.IncomingRequest} request.\n   */\n  UA.prototype.receiveRequest = function (request) {\n    var dialog,\n        session,\n        message,\n        earlySubscription,\n        method = request.method,\n        replaces,\n        replacedDialog,\n        self = this;\n\n    function ruriMatches(uri) {\n      return uri && uri.user === request.ruri.user;\n    }\n\n    // Check that request URI points to us\n    if (!(ruriMatches(this.configuration.uri) || ruriMatches(this.contact.uri) || ruriMatches(this.contact.pub_gruu) || ruriMatches(this.contact.temp_gruu))) {\n      this.logger.warn('Request-URI does not point to us');\n      if (request.method !== SIP.C.ACK) {\n        request.reply_sl(404);\n      }\n      return;\n    }\n\n    // Check request URI scheme\n    if (request.ruri.scheme === SIP.C.SIPS) {\n      request.reply_sl(416);\n      return;\n    }\n\n    // Check transaction\n    if (SIP.Transactions.checkTransaction(this, request)) {\n      return;\n    }\n\n    /* RFC3261 12.2.2\n     * Requests that do not change in any way the state of a dialog may be\n     * received within a dialog (for example, an OPTIONS request).\n     * They are processed as if they had been received outside the dialog.\n     */\n    if (method === SIP.C.OPTIONS) {\n      new SIP.Transactions.NonInviteServerTransaction(request, this);\n      request.reply(200, null, ['Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString(), 'Accept: ' + C.ACCEPTED_BODY_TYPES]);\n    } else if (method === SIP.C.MESSAGE) {\n      message = new SIP.ServerContext(this, request);\n      message.body = request.body;\n      message.content_type = request.getHeader('Content-Type') || 'text/plain';\n\n      request.reply(200, null);\n      this.emit('message', message);\n    } else if (method !== SIP.C.INVITE && method !== SIP.C.ACK) {\n      // Let those methods pass through to normal processing for now.\n      new SIP.ServerContext(this, request);\n    }\n\n    // Initial Request\n    if (!request.to_tag) {\n      switch (method) {\n        case SIP.C.INVITE:\n          replaces = this.configuration.replaces !== SIP.C.supported.UNSUPPORTED && request.parseHeader('replaces');\n\n          if (replaces) {\n            replacedDialog = this.dialogs[replaces.call_id + replaces.replaces_to_tag + replaces.replaces_from_tag];\n\n            if (!replacedDialog) {\n              //Replaced header without a matching dialog, reject\n              request.reply_sl(481, null);\n              return;\n            } else if (replacedDialog.owner.status === SIP.Session.C.STATUS_TERMINATED) {\n              request.reply_sl(603, null);\n              return;\n            } else if (replacedDialog.state === SIP.Dialog.C.STATUS_CONFIRMED && replaces.early_only) {\n              request.reply_sl(486, null);\n              return;\n            }\n          }\n\n          session = new SIP.InviteServerContext(this, request);\n          session.replacee = replacedDialog && replacedDialog.owner;\n          self.emit('invite', session);\n          break;\n        case SIP.C.BYE:\n          // Out of dialog BYE received\n          request.reply(481);\n          break;\n        case SIP.C.CANCEL:\n          session = this.findSession(request);\n          if (session) {\n            session.receiveRequest(request);\n          } else {\n            this.logger.warn('received CANCEL request for a non existent session');\n          }\n          break;\n        case SIP.C.ACK:\n          /* Absorb it.\n           * ACK request without a corresponding Invite Transaction\n           * and without To tag.\n           */\n          break;\n        case SIP.C.NOTIFY:\n          if (this.configuration.allowLegacyNotifications && this.listeners('notify').length > 0) {\n            request.reply(200, null);\n            self.emit('notify', { request: request });\n          } else {\n            request.reply(481, 'Subscription does not exist');\n          }\n          break;\n        case SIP.C.REFER:\n          this.logger.log('Received an out of dialog refer');\n          if (this.configuration.allowOutOfDialogRefers) {\n            this.logger.log('Allow out of dialog refers is enabled on the UA');\n            var referContext = new SIP.ReferServerContext(this, request);\n            var hasReferListener = this.listeners('outOfDialogReferRequested').length;\n            if (hasReferListener) {\n              this.emit('outOfDialogReferRequested', referContext);\n            } else {\n              this.logger.log('No outOfDialogReferRequest listeners, automatically accepting and following the out of dialog refer');\n              referContext.accept({ followRefer: true });\n            }\n            break;\n          }\n          request.reply(405);\n          break;\n        default:\n          request.reply(405);\n          break;\n      }\n    }\n    // In-dialog request\n    else {\n        dialog = this.findDialog(request);\n\n        if (dialog) {\n          if (method === SIP.C.INVITE) {\n            new SIP.Transactions.InviteServerTransaction(request, this);\n          }\n          dialog.receiveRequest(request);\n        } else if (method === SIP.C.NOTIFY) {\n          session = this.findSession(request);\n          earlySubscription = this.findEarlySubscription(request);\n          if (session) {\n            session.receiveRequest(request);\n          } else if (earlySubscription) {\n            earlySubscription.receiveRequest(request);\n          } else {\n            this.logger.warn('received NOTIFY request for a non existent session or subscription');\n            request.reply(481, 'Subscription does not exist');\n          }\n        }\n        /* RFC3261 12.2.2\n         * Request with to tag, but no matching dialog found.\n         * Exception: ACK for an Invite request for which a dialog has not\n         * been created.\n         */\n        else {\n            if (method !== SIP.C.ACK) {\n              request.reply(481);\n            }\n          }\n      }\n  };\n\n  //=================\n  // Utils\n  //=================\n\n  /**\n   * Get the session to which the request belongs to, if any.\n   * @private\n   * @param {SIP.IncomingRequest} request.\n   * @returns {SIP.OutgoingSession|SIP.IncomingSession|null}\n   */\n  UA.prototype.findSession = function (request) {\n    return this.sessions[request.call_id + request.from_tag] || this.sessions[request.call_id + request.to_tag] || null;\n  };\n\n  /**\n   * Get the dialog to which the request belongs to, if any.\n   * @private\n   * @param {SIP.IncomingRequest}\n   * @returns {SIP.Dialog|null}\n   */\n  UA.prototype.findDialog = function (request) {\n    return this.dialogs[request.call_id + request.from_tag + request.to_tag] || this.dialogs[request.call_id + request.to_tag + request.from_tag] || null;\n  };\n\n  /**\n   * Get the subscription which has not been confirmed to which the request belongs to, if any\n   * @private\n   * @param {SIP.IncomingRequest}\n   * @returns {SIP.Subscription|null}\n   */\n  UA.prototype.findEarlySubscription = function (request) {\n    return this.earlySubscriptions[request.call_id + request.to_tag + request.getHeader('event')] || null;\n  };\n\n  function checkAuthenticationFactory(authenticationFactory) {\n    if (!(authenticationFactory instanceof Function)) {\n      return;\n    }\n    if (!authenticationFactory.initialize) {\n      authenticationFactory.initialize = function initialize() {\n        return SIP.Utils.Promise.resolve();\n      };\n    }\n    return authenticationFactory;\n  }\n\n  /**\n   * Configuration load.\n   * @private\n   * returns {Boolean}\n   */\n  UA.prototype.loadConfig = function (configuration) {\n    // Settings and default values\n    var parameter,\n        value,\n        checked_value,\n        hostportParams,\n        registrarServer,\n        settings = {\n      /* Host address\n      * Value to be set in Via sent_by and host part of Contact FQDN\n      */\n      viaHost: SIP.Utils.createRandomToken(12) + '.invalid',\n\n      uri: new SIP.URI('sip', 'anonymous.' + SIP.Utils.createRandomToken(6), 'anonymous.invalid', null, null),\n\n      //Custom Configuration Settings\n      custom: {},\n\n      //Display name\n      displayName: '',\n\n      // Password\n      password: null,\n\n      // Registration parameters\n      registerExpires: 600,\n      register: true,\n      registrarServer: null,\n\n      // Transport related parameters\n      transportConstructor: __webpack_require__(/*! ./Web/Transport */ \"./src/Web/Transport.js\")(SIP),\n      transportOptions: {},\n\n      //string to be inserted into User-Agent request header\n      userAgentString: SIP.C.USER_AGENT,\n\n      // Session parameters\n      noAnswerTimeout: 60,\n\n      // Hacks\n      hackViaTcp: false,\n      hackIpInContact: false,\n      hackWssInTransport: false,\n      hackAllowUnregisteredOptionTags: false,\n\n      // Session Description Handler Options\n      sessionDescriptionHandlerFactoryOptions: {\n        constraints: {},\n        peerConnectionOptions: {}\n      },\n\n      contactName: SIP.Utils.createRandomToken(8), // user name in user part\n      contactTransport: 'ws',\n      forceRport: false,\n\n      //autostarting\n      autostart: true,\n      autostop: true,\n\n      //Reliable Provisional Responses\n      rel100: SIP.C.supported.UNSUPPORTED,\n\n      // DTMF type: 'info' or 'rtp' (RFC 4733)\n      // RTP Payload Spec: https://tools.ietf.org/html/rfc4733\n      // WebRTC Audio Spec: https://tools.ietf.org/html/rfc7874\n      dtmfType: SIP.C.dtmfType.INFO,\n\n      // Replaces header (RFC 3891)\n      // http://tools.ietf.org/html/rfc3891\n      replaces: SIP.C.supported.UNSUPPORTED,\n\n      sessionDescriptionHandlerFactory: __webpack_require__(/*! ./Web/SessionDescriptionHandler */ \"./src/Web/SessionDescriptionHandler.js\")(SIP).defaultFactory,\n\n      authenticationFactory: checkAuthenticationFactory(function authenticationFactory(ua) {\n        return new SIP.DigestAuthentication(ua);\n      }),\n\n      allowLegacyNotifications: false,\n\n      allowOutOfDialogRefers: false\n    };\n\n    // Pre-Configuration\n    function aliasUnderscored(parameter, logger) {\n      var underscored = parameter.replace(/([a-z][A-Z])/g, function (m) {\n        return m[0] + '_' + m[1].toLowerCase();\n      });\n\n      if (parameter === underscored) {\n        return;\n      }\n\n      var hasParameter = configuration.hasOwnProperty(parameter);\n      if (configuration.hasOwnProperty(underscored)) {\n        logger.warn(underscored + ' is deprecated, please use ' + parameter);\n        if (hasParameter) {\n          logger.warn(parameter + ' overriding ' + underscored);\n        }\n      }\n\n      configuration[parameter] = hasParameter ? configuration[parameter] : configuration[underscored];\n    }\n\n    var configCheck = this.getConfigurationCheck();\n\n    // Check Mandatory parameters\n    for (parameter in configCheck.mandatory) {\n      aliasUnderscored(parameter, this.logger);\n      if (!configuration.hasOwnProperty(parameter)) {\n        throw new SIP.Exceptions.ConfigurationError(parameter);\n      } else {\n        value = configuration[parameter];\n        checked_value = configCheck.mandatory[parameter](value);\n        if (checked_value !== undefined) {\n          settings[parameter] = checked_value;\n        } else {\n          throw new SIP.Exceptions.ConfigurationError(parameter, value);\n        }\n      }\n    }\n\n    // Check Optional parameters\n    for (parameter in configCheck.optional) {\n      aliasUnderscored(parameter, this.logger);\n      if (configuration.hasOwnProperty(parameter)) {\n        value = configuration[parameter];\n\n        // If the parameter value is an empty array, but shouldn't be, apply its default value.\n        if (value instanceof Array && value.length === 0) {\n          continue;\n        }\n\n        // If the parameter value is null, empty string, or undefined then apply its default value.\n        if (value === null || value === \"\" || value === undefined) {\n          continue;\n        }\n        // If it's a number with NaN value then also apply its default value.\n        // NOTE: JS does not allow \"value === NaN\", the following does the work:\n        else if (typeof value === 'number' && isNaN(value)) {\n            continue;\n          }\n\n        checked_value = configCheck.optional[parameter](value);\n        if (checked_value !== undefined) {\n          settings[parameter] = checked_value;\n        } else {\n          throw new SIP.Exceptions.ConfigurationError(parameter, value);\n        }\n      }\n    }\n\n    // Post Configuration Process\n\n    // Allow passing 0 number as displayName.\n    if (settings.displayName === 0) {\n      settings.displayName = '0';\n    }\n\n    // Instance-id for GRUU\n    if (!settings.instanceId) {\n      settings.instanceId = SIP.Utils.newUUID();\n    }\n\n    // sipjsId instance parameter. Static random tag of length 5\n    settings.sipjsId = SIP.Utils.createRandomToken(5);\n\n    // String containing settings.uri without scheme and user.\n    hostportParams = settings.uri.clone();\n    hostportParams.user = null;\n    settings.hostportParams = hostportParams.toRaw().replace(/^sip:/i, '');\n\n    /* Check whether authorizationUser is explicitly defined.\n     * Take 'settings.uri.user' value if not.\n     */\n    if (!settings.authorizationUser) {\n      settings.authorizationUser = settings.uri.user;\n    }\n\n    /* If no 'registrarServer' is set use the 'uri' value without user portion. */\n    if (!settings.registrarServer) {\n      registrarServer = settings.uri.clone();\n      registrarServer.user = null;\n      settings.registrarServer = registrarServer;\n    }\n\n    // User noAnswerTimeout\n    settings.noAnswerTimeout = settings.noAnswerTimeout * 1000;\n\n    // Via Host\n    if (settings.hackIpInContact) {\n      if (typeof settings.hackIpInContact === 'boolean') {\n        settings.viaHost = SIP.Utils.getRandomTestNetIP();\n      } else if (typeof settings.hackIpInContact === 'string') {\n        settings.viaHost = settings.hackIpInContact;\n      }\n    }\n\n    // Contact transport parameter\n    if (settings.hackWssInTransport) {\n      settings.contactTransport = 'wss';\n    }\n\n    this.contact = {\n      pub_gruu: null,\n      temp_gruu: null,\n      uri: new SIP.URI('sip', settings.contactName, settings.viaHost, null, { transport: settings.contactTransport }),\n      toString: function toString(options) {\n        options = options || {};\n\n        var anonymous = options.anonymous || null,\n            outbound = options.outbound || null,\n            contact = '<';\n\n        if (anonymous) {\n          contact += (this.temp_gruu || 'sip:anonymous@anonymous.invalid;transport=' + settings.contactTransport).toString();\n        } else {\n          contact += (this.pub_gruu || this.uri).toString();\n        }\n\n        if (outbound) {\n          contact += ';ob';\n        }\n\n        contact += '>';\n\n        return contact;\n      }\n    };\n\n    var skeleton = {};\n    // Fill the value of the configuration_skeleton\n    for (parameter in settings) {\n      skeleton[parameter] = settings[parameter];\n    }\n\n    Object.assign(this.configuration, skeleton);\n\n    this.logger.log('configuration parameters after validation:');\n    for (parameter in settings) {\n      switch (parameter) {\n        case 'uri':\n        case 'registrarServer':\n        case 'sessionDescriptionHandlerFactory':\n          this.logger.log('· ' + parameter + ': ' + settings[parameter]);\n          break;\n        case 'password':\n          this.logger.log('· ' + parameter + ': ' + 'NOT SHOWN');\n          break;\n        default:\n          this.logger.log('· ' + parameter + ': ' + JSON.stringify(settings[parameter]));\n      }\n    }\n\n    return;\n  };\n\n  /**\n   * Configuration checker.\n   * @private\n   * @return {Boolean}\n   */\n  UA.prototype.getConfigurationCheck = function () {\n    return {\n      mandatory: {},\n\n      optional: {\n\n        uri: function uri(_uri) {\n          var parsed;\n\n          if (!/^sip:/i.test(_uri)) {\n            _uri = SIP.C.SIP + ':' + _uri;\n          }\n          parsed = SIP.URI.parse(_uri);\n\n          if (!parsed) {\n            return;\n          } else if (!parsed.user) {\n            return;\n          } else {\n            return parsed;\n          }\n        },\n\n        transportConstructor: function transportConstructor(_transportConstructor) {\n          if ((typeof _transportConstructor === 'undefined' ? 'undefined' : _typeof(_transportConstructor)) === Function) {\n            return _transportConstructor;\n          }\n        },\n\n        transportOptions: function transportOptions(_transportOptions) {\n          if ((typeof _transportOptions === 'undefined' ? 'undefined' : _typeof(_transportOptions)) === 'object') {\n            return _transportOptions;\n          }\n        },\n\n        authorizationUser: function authorizationUser(_authorizationUser) {\n          if (SIP.Grammar.parse('\"' + _authorizationUser + '\"', 'quoted_string') === -1) {\n            return;\n          } else {\n            return _authorizationUser;\n          }\n        },\n\n        displayName: function displayName(_displayName) {\n          if (SIP.Grammar.parse('\"' + _displayName + '\"', 'displayName') === -1) {\n            return;\n          } else {\n            return _displayName;\n          }\n        },\n\n        dtmfType: function dtmfType(_dtmfType) {\n          switch (_dtmfType) {\n            case SIP.C.dtmfType.RTP:\n              return SIP.C.dtmfType.RTP;\n            case SIP.C.dtmfType.INFO:\n            // Fall through\n            default:\n              return SIP.C.dtmfType.INFO;\n          }\n        },\n\n        hackViaTcp: function hackViaTcp(_hackViaTcp) {\n          if (typeof _hackViaTcp === 'boolean') {\n            return _hackViaTcp;\n          }\n        },\n\n        hackIpInContact: function hackIpInContact(_hackIpInContact) {\n          if (typeof _hackIpInContact === 'boolean') {\n            return _hackIpInContact;\n          } else if (typeof _hackIpInContact === 'string' && SIP.Grammar.parse(_hackIpInContact, 'host') !== -1) {\n            return _hackIpInContact;\n          }\n        },\n\n        hackWssInTransport: function hackWssInTransport(_hackWssInTransport) {\n          if (typeof _hackWssInTransport === 'boolean') {\n            return _hackWssInTransport;\n          }\n        },\n\n        hackAllowUnregisteredOptionTags: function hackAllowUnregisteredOptionTags(_hackAllowUnregisteredOptionTags) {\n          if (typeof _hackAllowUnregisteredOptionTags === 'boolean') {\n            return _hackAllowUnregisteredOptionTags;\n          }\n        },\n\n        contactTransport: function contactTransport(_contactTransport) {\n          if (typeof _contactTransport === 'string') {\n            return _contactTransport;\n          }\n        },\n\n        forceRport: function forceRport(_forceRport) {\n          if (typeof _forceRport === 'boolean') {\n            return _forceRport;\n          }\n        },\n\n        instanceId: function instanceId(_instanceId) {\n          if (typeof _instanceId !== 'string') {\n            return;\n          }\n\n          if (/^uuid:/i.test(_instanceId)) {\n            _instanceId = _instanceId.substr(5);\n          }\n\n          if (SIP.Grammar.parse(_instanceId, 'uuid') === -1) {\n            return;\n          } else {\n            return _instanceId;\n          }\n        },\n\n        noAnswerTimeout: function noAnswerTimeout(_noAnswerTimeout) {\n          var value;\n          if (SIP.Utils.isDecimal(_noAnswerTimeout)) {\n            value = Number(_noAnswerTimeout);\n            if (value > 0) {\n              return value;\n            }\n          }\n        },\n\n        password: function password(_password) {\n          return String(_password);\n        },\n\n        rel100: function rel100(_rel) {\n          if (_rel === SIP.C.supported.REQUIRED) {\n            return SIP.C.supported.REQUIRED;\n          } else if (_rel === SIP.C.supported.SUPPORTED) {\n            return SIP.C.supported.SUPPORTED;\n          } else {\n            return SIP.C.supported.UNSUPPORTED;\n          }\n        },\n\n        replaces: function replaces(_replaces) {\n          if (_replaces === SIP.C.supported.REQUIRED) {\n            return SIP.C.supported.REQUIRED;\n          } else if (_replaces === SIP.C.supported.SUPPORTED) {\n            return SIP.C.supported.SUPPORTED;\n          } else {\n            return SIP.C.supported.UNSUPPORTED;\n          }\n        },\n\n        register: function register(_register) {\n          if (typeof _register === 'boolean') {\n            return _register;\n          }\n        },\n\n        registerExpires: function registerExpires(_registerExpires) {\n          var value;\n          if (SIP.Utils.isDecimal(_registerExpires)) {\n            value = Number(_registerExpires);\n            if (value > 0) {\n              return value;\n            }\n          }\n        },\n\n        registrarServer: function registrarServer(_registrarServer) {\n          var parsed;\n\n          if (typeof _registrarServer !== 'string') {\n            return;\n          }\n\n          if (!/^sip:/i.test(_registrarServer)) {\n            _registrarServer = SIP.C.SIP + ':' + _registrarServer;\n          }\n          parsed = SIP.URI.parse(_registrarServer);\n\n          if (!parsed) {\n            return;\n          } else if (parsed.user) {\n            return;\n          } else {\n            return parsed;\n          }\n        },\n\n        userAgentString: function userAgentString(_userAgentString) {\n          if (typeof _userAgentString === 'string') {\n            return _userAgentString;\n          }\n        },\n\n        autostart: function autostart(_autostart) {\n          if (typeof _autostart === 'boolean') {\n            return _autostart;\n          }\n        },\n\n        autostop: function autostop(_autostop) {\n          if (typeof _autostop === 'boolean') {\n            return _autostop;\n          }\n        },\n\n        sessionDescriptionHandlerFactory: function sessionDescriptionHandlerFactory(_sessionDescriptionHandlerFactory) {\n          if (_sessionDescriptionHandlerFactory instanceof Function) {\n            return _sessionDescriptionHandlerFactory;\n          }\n        },\n\n        sessionDescriptionHandlerFactoryOptions: function sessionDescriptionHandlerFactoryOptions(options) {\n          if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {\n            return options;\n          }\n        },\n\n        authenticationFactory: checkAuthenticationFactory,\n\n        allowLegacyNotifications: function allowLegacyNotifications(_allowLegacyNotifications) {\n          if (typeof _allowLegacyNotifications === 'boolean') {\n            return _allowLegacyNotifications;\n          }\n        },\n\n        custom: function custom(_custom) {\n          if ((typeof _custom === 'undefined' ? 'undefined' : _typeof(_custom)) === 'object') {\n            return _custom;\n          }\n        },\n\n        contactName: function contactName(_contactName) {\n          if (typeof _contactName === 'string') {\n            return _contactName;\n          }\n        }\n      }\n    };\n  };\n\n  UA.C = C;\n  SIP.UA = UA;\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack://SIP/./src/UA.js?");

/***/ }),

/***/ "./src/URI.js":
/*!********************!*\
  !*** ./src/URI.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview SIP URI\n */\n\n/**\n * @augments SIP\n * @class Class creating a SIP URI.\n *\n * @param {String} [scheme]\n * @param {String} [user]\n * @param {String} host\n * @param {String} [port]\n * @param {Object} [parameters]\n * @param {Object} [headers]\n *\n */\n\nmodule.exports = function (SIP) {\n  var URI;\n\n  URI = function URI(scheme, user, host, port, parameters, headers) {\n    var param, header, raw, normal;\n\n    // Checks\n    if (!host) {\n      throw new TypeError('missing or invalid \"host\" parameter');\n    }\n\n    // Initialize parameters\n    scheme = scheme || SIP.C.SIP;\n    this.parameters = {};\n    this.headers = {};\n\n    for (param in parameters) {\n      this.setParam(param, parameters[param]);\n    }\n\n    for (header in headers) {\n      this.setHeader(header, headers[header]);\n    }\n\n    // Raw URI\n    raw = {\n      scheme: scheme,\n      user: user,\n      host: host,\n      port: port\n    };\n\n    // Normalized URI\n    normal = {\n      scheme: scheme.toLowerCase(),\n      user: user,\n      host: host.toLowerCase(),\n      port: port\n    };\n\n    Object.defineProperties(this, {\n      _normal: {\n        get: function get() {\n          return normal;\n        }\n      },\n\n      _raw: {\n        get: function get() {\n          return raw;\n        }\n      },\n\n      scheme: {\n        get: function get() {\n          return normal.scheme;\n        },\n        set: function set(value) {\n          raw.scheme = value;\n          normal.scheme = value.toLowerCase();\n        }\n      },\n\n      user: {\n        get: function get() {\n          return normal.user;\n        },\n        set: function set(value) {\n          normal.user = raw.user = value;\n        }\n      },\n\n      host: {\n        get: function get() {\n          return normal.host;\n        },\n        set: function set(value) {\n          raw.host = value;\n          normal.host = value.toLowerCase();\n        }\n      },\n\n      aor: {\n        get: function get() {\n          return normal.user + '@' + normal.host;\n        }\n      },\n\n      port: {\n        get: function get() {\n          return normal.port;\n        },\n        set: function set(value) {\n          normal.port = raw.port = value === 0 ? value : parseInt(value, 10) || null;\n        }\n      }\n    });\n  };\n\n  URI.prototype = {\n    setParam: function setParam(key, value) {\n      if (key) {\n        this.parameters[key.toLowerCase()] = typeof value === 'undefined' || value === null ? null : value.toString().toLowerCase();\n      }\n    },\n\n    getParam: function getParam(key) {\n      if (key) {\n        return this.parameters[key.toLowerCase()];\n      }\n    },\n\n    hasParam: function hasParam(key) {\n      if (key) {\n        return this.parameters.hasOwnProperty(key.toLowerCase()) && true || false;\n      }\n    },\n\n    deleteParam: function deleteParam(parameter) {\n      var value;\n      parameter = parameter.toLowerCase();\n      if (this.parameters.hasOwnProperty(parameter)) {\n        value = this.parameters[parameter];\n        delete this.parameters[parameter];\n        return value;\n      }\n    },\n\n    clearParams: function clearParams() {\n      this.parameters = {};\n    },\n\n    setHeader: function setHeader(name, value) {\n      this.headers[SIP.Utils.headerize(name)] = value instanceof Array ? value : [value];\n    },\n\n    getHeader: function getHeader(name) {\n      if (name) {\n        return this.headers[SIP.Utils.headerize(name)];\n      }\n    },\n\n    hasHeader: function hasHeader(name) {\n      if (name) {\n        return this.headers.hasOwnProperty(SIP.Utils.headerize(name)) && true || false;\n      }\n    },\n\n    deleteHeader: function deleteHeader(header) {\n      var value;\n      header = SIP.Utils.headerize(header);\n      if (this.headers.hasOwnProperty(header)) {\n        value = this.headers[header];\n        delete this.headers[header];\n        return value;\n      }\n    },\n\n    clearHeaders: function clearHeaders() {\n      this.headers = {};\n    },\n\n    clone: function clone() {\n      return new URI(this._raw.scheme, this._raw.user, this._raw.host, this._raw.port, JSON.parse(JSON.stringify(this.parameters)), JSON.parse(JSON.stringify(this.headers)));\n    },\n\n    toRaw: function toRaw() {\n      return this._toString(this._raw);\n    },\n\n    toString: function toString() {\n      return this._toString(this._normal);\n    },\n\n    _toString: function _toString(uri) {\n      var header,\n          parameter,\n          idx,\n          uriString,\n          headers = [];\n\n      uriString = uri.scheme + ':';\n      // add slashes if it's not a sip(s) URI\n      if (!uri.scheme.toLowerCase().match(\"^sips?$\")) {\n        uriString += \"//\";\n      }\n      if (uri.user) {\n        uriString += SIP.Utils.escapeUser(uri.user) + '@';\n      }\n      uriString += uri.host;\n      if (uri.port || uri.port === 0) {\n        uriString += ':' + uri.port;\n      }\n\n      for (parameter in this.parameters) {\n        uriString += ';' + parameter;\n\n        if (this.parameters[parameter] !== null) {\n          uriString += '=' + this.parameters[parameter];\n        }\n      }\n\n      for (header in this.headers) {\n        for (idx in this.headers[header]) {\n          headers.push(header + '=' + this.headers[header][idx]);\n        }\n      }\n\n      if (headers.length > 0) {\n        uriString += '?' + headers.join('&');\n      }\n\n      return uriString;\n    }\n  };\n\n  /**\n    * Parse the given string and returns a SIP.URI instance or undefined if\n    * it is an invalid URI.\n    * @public\n    * @param {String} uri\n    */\n  URI.parse = function (uri) {\n    uri = SIP.Grammar.parse(uri, 'SIP_URI');\n\n    if (uri !== -1) {\n      return uri;\n    } else {\n      return undefined;\n    }\n  };\n\n  SIP.URI = URI;\n};\n\n//# sourceURL=webpack://SIP/./src/URI.js?");

/***/ }),

/***/ "./src/Utils.js":
/*!**********************!*\
  !*** ./src/Utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * @fileoverview Utils\n */\n\nmodule.exports = function (SIP, environment) {\n  var Utils;\n\n  Utils = {\n\n    Promise: environment.Promise,\n\n    defer: function defer() {\n      var deferred = {};\n      deferred.promise = new Utils.Promise(function (resolve, reject) {\n        deferred.resolve = resolve;\n        deferred.reject = reject;\n      });\n      return deferred;\n    },\n\n    reducePromises: function reducePromises(arr, val) {\n      return arr.reduce(function (acc, fn) {\n        acc = acc.then(fn);\n        return acc;\n      }, SIP.Utils.Promise.resolve(val));\n    },\n\n    augment: function augment(object, constructor, args, override) {\n      var idx, proto;\n\n      // Add public properties from constructor's prototype onto object\n      proto = constructor.prototype;\n      for (idx in proto) {\n        if (override || object[idx] === undefined) {\n          object[idx] = proto[idx];\n        }\n      }\n\n      // Construct the object as though it were just created by constructor\n      constructor.apply(object, args);\n    },\n\n    defaultOptions: function defaultOptions(_defaultOptions, overridingOptions) {\n      _defaultOptions = _defaultOptions || {};\n      overridingOptions = overridingOptions || {};\n      return Object.assign({}, _defaultOptions, overridingOptions);\n    },\n\n    optionsOverride: function optionsOverride(options, winner, loser, isDeprecated, logger, defaultValue) {\n      if (isDeprecated && options[loser]) {\n        logger.warn(loser + ' is deprecated, please use ' + winner + ' instead');\n      }\n\n      if (options[winner] && options[loser]) {\n        logger.warn(winner + ' overriding ' + loser);\n      }\n\n      options[winner] = options[winner] || options[loser] || defaultValue;\n    },\n\n    str_utf8_length: function str_utf8_length(string) {\n      return encodeURIComponent(string).replace(/%[A-F\\d]{2}/g, 'U').length;\n    },\n\n    generateFakeSDP: function generateFakeSDP(body) {\n      if (!body) {\n        return;\n      }\n\n      var start = body.indexOf('o=');\n      var end = body.indexOf('\\r\\n', start);\n\n      return 'v=0\\r\\n' + body.slice(start, end) + '\\r\\ns=-\\r\\nt=0 0\\r\\nc=IN IP4 0.0.0.0';\n    },\n\n    isFunction: function isFunction(fn) {\n      if (fn !== undefined) {\n        return Object.prototype.toString.call(fn) === '[object Function]';\n      } else {\n        return false;\n      }\n    },\n\n    isDecimal: function isDecimal(num) {\n      return !isNaN(num) && parseFloat(num) === parseInt(num, 10);\n    },\n\n    createRandomToken: function createRandomToken(size, base) {\n      var i,\n          r,\n          token = '';\n\n      base = base || 32;\n\n      for (i = 0; i < size; i++) {\n        r = Math.random() * base | 0;\n        token += r.toString(base);\n      }\n\n      return token;\n    },\n\n    newTag: function newTag() {\n      return SIP.Utils.createRandomToken(SIP.UA.C.TAG_LENGTH);\n    },\n\n    // http://stackoverflow.com/users/109538/broofa\n    newUUID: function newUUID() {\n      var UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {\n        var r = Math.random() * 16 | 0,\n            v = c === 'x' ? r : r & 0x3 | 0x8;\n        return v.toString(16);\n      });\n\n      return UUID;\n    },\n\n    hostType: function hostType(host) {\n      if (!host) {\n        return;\n      } else {\n        host = SIP.Grammar.parse(host, 'host');\n        if (host !== -1) {\n          return host.host_type;\n        }\n      }\n    },\n\n    /**\n    * Normalize SIP URI.\n    * NOTE: It does not allow a SIP URI without username.\n    * Accepts 'sip', 'sips' and 'tel' URIs and convert them into 'sip'.\n    * Detects the domain part (if given) and properly hex-escapes the user portion.\n    * If the user portion has only 'tel' number symbols the user portion is clean of 'tel' visual separators.\n    * @private\n    * @param {String} target\n    * @param {String} [domain]\n    */\n    normalizeTarget: function normalizeTarget(target, domain) {\n      var uri, target_array, target_user, target_domain;\n\n      // If no target is given then raise an error.\n      if (!target) {\n        return;\n        // If a SIP.URI instance is given then return it.\n      } else if (target instanceof SIP.URI) {\n        return target;\n\n        // If a string is given split it by '@':\n        // - Last fragment is the desired domain.\n        // - Otherwise append the given domain argument.\n      } else if (typeof target === 'string') {\n        target_array = target.split('@');\n\n        switch (target_array.length) {\n          case 1:\n            if (!domain) {\n              return;\n            }\n            target_user = target;\n            target_domain = domain;\n            break;\n          case 2:\n            target_user = target_array[0];\n            target_domain = target_array[1];\n            break;\n          default:\n            target_user = target_array.slice(0, target_array.length - 1).join('@');\n            target_domain = target_array[target_array.length - 1];\n        }\n\n        // Remove the URI scheme (if present).\n        target_user = target_user.replace(/^(sips?|tel):/i, '');\n\n        // Remove 'tel' visual separators if the user portion just contains 'tel' number symbols.\n        if (/^[\\-\\.\\(\\)]*\\+?[0-9\\-\\.\\(\\)]+$/.test(target_user)) {\n          target_user = target_user.replace(/[\\-\\.\\(\\)]/g, '');\n        }\n\n        // Build the complete SIP URI.\n        target = SIP.C.SIP + ':' + SIP.Utils.escapeUser(target_user) + '@' + target_domain;\n        // Finally parse the resulting URI.\n        uri = SIP.URI.parse(target);\n\n        return uri;\n      } else {\n        return;\n      }\n    },\n\n    /**\n    * Hex-escape a SIP URI user.\n    * @private\n    * @param {String} user\n    */\n    escapeUser: function escapeUser(user) {\n      // Don't hex-escape ':' (%3A), '+' (%2B), '?' (%3F\"), '/' (%2F).\n      return encodeURIComponent(decodeURIComponent(user)).replace(/%3A/ig, ':').replace(/%2B/ig, '+').replace(/%3F/ig, '?').replace(/%2F/ig, '/');\n    },\n\n    headerize: function headerize(string) {\n      var exceptions = {\n        'Call-Id': 'Call-ID',\n        'Cseq': 'CSeq',\n        'Min-Se': 'Min-SE',\n        'Rack': 'RAck',\n        'Rseq': 'RSeq',\n        'Www-Authenticate': 'WWW-Authenticate'\n      },\n          name = string.toLowerCase().replace(/_/g, '-').split('-'),\n          hname = '',\n          parts = name.length,\n          part;\n\n      for (part = 0; part < parts; part++) {\n        if (part !== 0) {\n          hname += '-';\n        }\n        hname += name[part].charAt(0).toUpperCase() + name[part].substring(1);\n      }\n      if (exceptions[hname]) {\n        hname = exceptions[hname];\n      }\n      return hname;\n    },\n\n    sipErrorCause: function sipErrorCause(status_code) {\n      var cause;\n\n      for (cause in SIP.C.SIP_ERROR_CAUSES) {\n        if (SIP.C.SIP_ERROR_CAUSES[cause].indexOf(status_code) !== -1) {\n          return SIP.C.causes[cause];\n        }\n      }\n\n      return SIP.C.causes.SIP_FAILURE_CODE;\n    },\n\n    getReasonPhrase: function getReasonPhrase(code, specific) {\n      return specific || SIP.C.REASON_PHRASE[code] || '';\n    },\n\n    getReasonHeaderValue: function getReasonHeaderValue(code, reason) {\n      reason = SIP.Utils.getReasonPhrase(code, reason);\n      return 'SIP;cause=' + code + ';text=\"' + reason + '\"';\n    },\n\n    getCancelReason: function getCancelReason(code, reason) {\n      if (code && code < 200 || code > 699) {\n        throw new TypeError('Invalid status_code: ' + code);\n      } else if (code) {\n        return SIP.Utils.getReasonHeaderValue(code, reason);\n      }\n    },\n\n    buildStatusLine: function buildStatusLine(code, reason) {\n      code = code || null;\n      reason = reason || null;\n\n      // Validate code and reason values\n      if (!code || code < 100 || code > 699) {\n        throw new TypeError('Invalid status_code: ' + code);\n      } else if (reason && typeof reason !== 'string' && !(reason instanceof String)) {\n        throw new TypeError('Invalid reason_phrase: ' + reason);\n      }\n\n      reason = Utils.getReasonPhrase(code, reason);\n\n      return 'SIP/2.0 ' + code + ' ' + reason + '\\r\\n';\n    },\n\n    /**\n    * Generate a random Test-Net IP (http://tools.ietf.org/html/rfc5735)\n    * @private\n    */\n    getRandomTestNetIP: function getRandomTestNetIP() {\n      function getOctet(from, to) {\n        return Math.floor(Math.random() * (to - from + 1) + from);\n      }\n      return '192.0.2.' + getOctet(1, 254);\n    }\n  };\n\n  SIP.Utils = Utils;\n};\n\n//# sourceURL=webpack://SIP/./src/Utils.js?");

/***/ }),

/***/ "./src/Web/Modifiers.js":
/*!******************************!*\
  !*** ./src/Web/Modifiers.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/**\n * @name SIP\n * @namespace\n */\n\n\nmodule.exports = function (SIP) {\n  var Modifiers;\n\n  Modifiers = {\n    stripTcpCandidates: function stripTcpCandidates(description) {\n      description.sdp = description.sdp.replace(/^a=candidate:\\d+ \\d+ tcp .*?\\r\\n/img, \"\");\n      return SIP.Utils.Promise.resolve(description);\n    },\n\n    stripTelephoneEvent: function stripTelephoneEvent(description) {\n      description.sdp = description.sdp.replace(/^a=rtpmap:\\d+ telephone-event\\/\\d+\\r\\n/img, \"\");\n      return SIP.Utils.Promise.resolve(description);\n    },\n\n    cleanJitsiSdpImageattr: function cleanJitsiSdpImageattr(description) {\n      description.sdp = description.sdp.replace(/^(a=imageattr:.*?)(x|y)=\\[0-/gm, \"$1$2=[1:\");\n      return SIP.Utils.Promise.resolve(description);\n    },\n\n    stripG722: function stripG722(description) {\n      var parts = description.sdp.match(/^m=audio.*$/gm);\n      if (parts) {\n        var mline = parts[0];\n        mline = mline.split(\" \");\n        // Ignore the first 3 parameters of the mline. The codec information is after that\n        for (var i = 3; i < mline.length; i = i + 1) {\n          if (mline[i] === \"9\") {\n            mline.splice(i, 1);\n            var numberOfCodecs = parseInt(mline[1], 10);\n            numberOfCodecs = numberOfCodecs - 1;\n            mline[1] = numberOfCodecs.toString();\n          }\n        }\n        mline = mline.join(\" \");\n        description.sdp = description.sdp.replace(/^m=audio.*$/gm, mline);\n        description.sdp = description.sdp.replace(/^a=rtpmap:.*G722\\/8000\\r\\n?/gm, \"\").replace();\n      }\n      return SIP.Utils.Promise.resolve(description);\n    }\n  };\n\n  return Modifiers;\n};\n\n//# sourceURL=webpack://SIP/./src/Web/Modifiers.js?");

/***/ }),

/***/ "./src/Web/SessionDescriptionHandler.js":
/*!**********************************************!*\
  !*** ./src/Web/SessionDescriptionHandler.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {\n/**\n * @fileoverview SessionDescriptionHandler\n */\n\n/* SessionDescriptionHandler\n * @class PeerConnection helper Class.\n * @param {SIP.Session} session\n * @param {Object} [options]\n */\n\nmodule.exports = function (SIP) {\n\n  // Constructor\n  var SessionDescriptionHandler = function SessionDescriptionHandler(session, observer, options) {\n    // TODO: Validate the options\n    this.options = options || {};\n\n    this.logger = session.ua.getLogger('sip.invitecontext.sessionDescriptionHandler', session.id);\n    this.session = session;\n    this.observer = observer;\n    this.dtmfSender = null;\n\n    this.CONTENT_TYPE = 'application/sdp';\n\n    this.C = {};\n    this.C.DIRECTION = {\n      NULL: null,\n      SENDRECV: \"sendrecv\",\n      SENDONLY: \"sendonly\",\n      RECVONLY: \"recvonly\",\n      INACTIVE: \"inactive\"\n    };\n\n    this.logger.log('SessionDescriptionHandlerOptions: ' + JSON.stringify(this.options));\n\n    this.direction = this.C.DIRECTION.NULL;\n\n    this.modifiers = this.options.modifiers || [];\n    if (!Array.isArray(this.modifiers)) {\n      this.modifiers = [this.modifiers];\n    }\n\n    var environment = global.window || global;\n    this.WebRTC = {\n      MediaStream: environment.MediaStream,\n      getUserMedia: environment.navigator.mediaDevices.getUserMedia.bind(environment.navigator.mediaDevices),\n      RTCPeerConnection: environment.RTCPeerConnection,\n      RTCSessionDescription: environment.RTCSessionDescription\n    };\n\n    this.iceGatheringDeferred = null;\n    this.iceGatheringTimeout = false;\n    this.iceGatheringTimer = null;\n\n    this.initPeerConnection(this.options.peerConnectionOptions);\n\n    this.constraints = this.checkAndDefaultConstraints(this.options.constraints);\n  };\n\n  /**\n   * @param {SIP.Session} session\n   * @param {Object} [options]\n   */\n\n  SessionDescriptionHandler.defaultFactory = function defaultFactory(session, observer, options) {\n    return new SessionDescriptionHandler(session, observer, options);\n  };\n\n  SessionDescriptionHandler.prototype = Object.create(SIP.SessionDescriptionHandler.prototype, {\n    // Functions the sesssion can use\n\n    /**\n     * Destructor\n     */\n    close: { writable: true, value: function value() {\n        this.logger.log('closing PeerConnection');\n        // have to check signalingState since this.close() gets called multiple times\n        if (this.peerConnection && this.peerConnection.signalingState !== 'closed') {\n          if (this.peerConnection.getSenders) {\n            this.peerConnection.getSenders().forEach(function (sender) {\n              if (sender.track) {\n                sender.track.stop();\n              }\n            });\n          } else {\n            this.logger.warn('Using getLocalStreams which is deprecated');\n            this.peerConnection.getLocalStreams().forEach(function (stream) {\n              stream.getTracks().forEach(function (track) {\n                track.stop();\n              });\n            });\n          }\n          if (this.peerConnection.getReceivers) {\n            this.peerConnection.getReceivers().forEach(function (receiver) {\n              if (receiver.track) {\n                receiver.track.stop();\n              }\n            });\n          } else {\n            this.logger.warn('Using getRemoteStreams which is deprecated');\n            this.peerConnection.getRemoteStreams().forEach(function (stream) {\n              stream.getTracks().forEach(function (track) {\n                track.stop();\n              });\n            });\n          }\n          this.resetIceGatheringComplete();\n          this.peerConnection.close();\n        }\n      } },\n\n    /**\n     * Gets the local description from the underlying media implementation\n     * @param {Object} [options] Options object to be used by getDescription\n     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints\n     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options\n     * @param {Array} [modifiers] Array with one time use description modifiers\n     * @returns {Promise} Promise that resolves with the local description to be used for the session\n     */\n    getDescription: { writable: true, value: function value(options, modifiers) {\n        var self = this;\n        var shouldAcquireMedia = true;\n\n        if (this.session.disableRenegotiation) {\n          this.logger.warn(\"The flag \\\"disableRenegotiation\\\" is set to true for this session description handler. We will not try to renegotiate.\");\n          return SIP.Utils.Promise.reject(new SIP.Exceptions.RenegotiationError(\"disableRenegotiation flag set to true for this session description handler\"));\n        }\n\n        options = options || {};\n        if (options.peerConnectionOptions) {\n          this.initPeerConnection(options.peerConnectionOptions);\n        }\n\n        // Merge passed constraints with saved constraints and save\n        var newConstraints = Object.assign({}, this.constraints, options.constraints);\n        newConstraints = this.checkAndDefaultConstraints(newConstraints);\n        if (JSON.stringify(newConstraints) !== JSON.stringify(this.constraints)) {\n          this.constraints = newConstraints;\n        } else {\n          shouldAcquireMedia = false;\n        }\n\n        modifiers = modifiers || [];\n        if (!Array.isArray(modifiers)) {\n          modifiers = [modifiers];\n        }\n        modifiers = modifiers.concat(this.modifiers);\n\n        // Check to see if the peerConnection already has a local description\n        if (!shouldAcquireMedia && this.peerConnection.localDescription && this.peerConnection.localDescription.sdp && this.peerConnection.localDescription.sdp !== '') {\n          return this.createOfferOrAnswer(options.RTCOfferOptions, modifiers).then(function (sdp) {\n            return {\n              body: sdp,\n              contentType: self.CONTENT_TYPE\n            };\n          });\n        }\n\n        // GUM and set myself up\n        self.logger.log('acquiring local media');\n        // TODO: Constraints should be named MediaStreamConstraints\n        return this.acquire(self.constraints).then(function acquireSucceeded(streams) {\n          self.logger.log('acquired local media streams');\n          return streams;\n        }, function acquireFailed(err) {\n          self.logger.error('unable to acquire streams');\n          self.logger.error(err);\n          throw err;\n        }).then(function addStreams(streams) {\n          try {\n            streams = [].concat(streams);\n            streams.forEach(function (stream) {\n              if (self.peerConnection.addTrack) {\n                stream.getTracks().forEach(function (track) {\n                  self.peerConnection.addTrack(track, stream);\n                });\n              } else {\n                // Chrome 59 does not support addTrack\n                self.peerConnection.addStream(stream);\n              }\n            }, this);\n          } catch (e) {\n            self.logger.error('error adding stream');\n            self.logger.error(e);\n            return SIP.Utils.Promise.reject(e);\n          }\n          return SIP.Utils.Promise.resolve();\n        }).then(function streamAdditionSucceeded() {\n          return self.createOfferOrAnswer(options.RTCOfferOptions, modifiers);\n        }).then(function (sdp) {\n          return {\n            body: sdp,\n            contentType: self.CONTENT_TYPE\n          };\n        }).catch(function (e) {\n          this.session.disableRenegotiation = true;\n          throw e;\n        });\n      } },\n\n    /**\n     * Check if the Session Description Handler can handle the Content-Type described by a SIP Message\n     * @param {String} contentType The content type that is in the SIP Message\n     * @returns {boolean}\n     */\n    hasDescription: { writable: true, value: function hasDescription(contentType) {\n        return contentType === this.CONTENT_TYPE;\n      } },\n\n    /**\n     * The modifier that should be used when the session would like to place the call on hold\n     * @param {String} [sdp] The description that will be modified\n     * @returns {Promise} Promise that resolves with modified SDP\n     */\n    holdModifier: { writable: true, value: function holdModifier(description) {\n        if (!/a=(sendrecv|sendonly|recvonly|inactive)/.test(description.sdp)) {\n          description.sdp = description.sdp.replace(/(m=[^\\r]*\\r\\n)/g, '$1a=sendonly\\r\\n');\n        } else {\n          description.sdp = description.sdp.replace(/a=sendrecv\\r\\n/g, 'a=sendonly\\r\\n');\n          description.sdp = description.sdp.replace(/a=recvonly\\r\\n/g, 'a=inactive\\r\\n');\n        }\n        return SIP.Utils.Promise.resolve(description);\n      } },\n\n    /**\n     * Set the remote description to the underlying media implementation\n     * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation\n     * @param {Object} [options] Options object to be used by getDescription\n     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints\n     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer connection with the new options\n     * @param {Array} [modifiers] Array with one time use description modifiers\n     * @returns {Promise} Promise that resolves once the description is set\n     */\n    setDescription: { writable: true, value: function setDescription(sessionDescription, options, modifiers) {\n        var self = this;\n\n        // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser\n        var isFirefox = typeof InstallTrigger !== 'undefined';\n        if (!this.session.disableRenegotiation && isFirefox && this.peerConnection && this.isVideoHold(sessionDescription)) {\n          this.session.disableRenegotiation = true;\n        }\n\n        if (this.session.disableRenegotiation) {\n          this.logger.warn(\"The flag \\\"disableRenegotiation\\\" is set to true for this session description handler. We will not try to renegotiate.\");\n          return SIP.Utils.Promise.reject(new SIP.Exceptions.RenegotiationError(\"disableRenegotiation flag set to true for this session description handler\"));\n        }\n\n        options = options || {};\n        if (options.peerConnectionOptions) {\n          this.initPeerConnection(options.peerConnectionOptions);\n        }\n\n        // Merge passed constraints with saved constraints and save\n        this.constraints = Object.assign({}, this.constraints, options.constraints);\n        this.constraints = this.checkAndDefaultConstraints(this.constraints);\n\n        modifiers = modifiers || [];\n        if (!Array.isArray(modifiers)) {\n          modifiers = [modifiers];\n        }\n        modifiers = modifiers.concat(this.modifiers);\n\n        var description = {\n          type: this.hasOffer('local') ? 'answer' : 'offer',\n          sdp: sessionDescription\n        };\n\n        return SIP.Utils.reducePromises(modifiers, description).catch(function modifierError(e) {\n          self.logger.error(\"The modifiers did not resolve successfully\");\n          self.logger.error(e);\n          throw e;\n        }).then(function (modifiedDescription) {\n          self.emit('setDescription', modifiedDescription);\n          return self.peerConnection.setRemoteDescription(new self.WebRTC.RTCSessionDescription(modifiedDescription));\n        }).catch(function setRemoteDescriptionError(e) {\n          self.session.disableRenegotiation = true;\n          self.logger.error(e);\n          self.emit('peerConnection-setRemoteDescriptionFailed', e);\n          throw e;\n        }).then(function setRemoteDescriptionSuccess() {\n          if (self.peerConnection.getReceivers) {\n            self.emit('setRemoteDescription', self.peerConnection.getReceivers());\n          } else {\n            self.emit('setRemoteDescription', self.peerConnection.getRemoteStreams());\n          }\n          self.emit('confirmed', self);\n        });\n      } },\n\n    /**\n     * Send DTMF via RTP (RFC 4733)\n     * @param {String} tones A string containing DTMF digits\n     * @param {Object} [options] Options object to be used by sendDtmf\n     * @returns {boolean} true if DTMF send is successful, false otherwise\n     */\n    sendDtmf: { writable: true, value: function sendDtmf(tones, options) {\n        if (!this.dtmfSender && this.hasBrowserGetSenderSupport()) {\n          var senders = this.peerConnection.getSenders();\n          if (senders.length > 0) {\n            this.dtmfSender = senders[0].dtmf;\n          }\n        }\n        if (!this.dtmfSender && this.hasBrowserTrackSupport()) {\n          var streams = this.peerConnection.getLocalStreams();\n          if (streams.length > 0) {\n            var audioTracks = streams[0].getAudioTracks();\n            if (audioTracks.length > 0) {\n              this.dtmfSender = this.peerConnection.createDTMFSender(audioTracks[0]);\n            }\n          }\n        }\n        if (!this.dtmfSender) {\n          return false;\n        }\n        try {\n          this.dtmfSender.insertDTMF(tones, options.duration, options.interToneGap);\n        } catch (e) {\n          if (e.type === \"InvalidStateError\" || e.type === \"InvalidCharacterError\") {\n            this.logger.error(e);\n            return false;\n          } else {\n            throw e;\n          }\n        }\n        this.logger.log('DTMF sent via RTP: ' + tones.toString());\n        return true;\n      } },\n\n    getDirection: { writable: true, value: function getDirection() {\n        return this.direction;\n      } },\n\n    // Internal functions\n    createOfferOrAnswer: { writable: true, value: function createOfferOrAnswer(RTCOfferOptions, modifiers) {\n        var self = this;\n        var methodName;\n        var pc = this.peerConnection;\n\n        RTCOfferOptions = RTCOfferOptions || {};\n\n        methodName = self.hasOffer('remote') ? 'createAnswer' : 'createOffer';\n\n        return pc[methodName](RTCOfferOptions).catch(function methodError(e) {\n          self.emit('peerConnection-' + methodName + 'Failed', e);\n          throw e;\n        }).then(function (sdp) {\n          return SIP.Utils.reducePromises(modifiers, self.createRTCSessionDescriptionInit(sdp));\n        }).then(function (sdp) {\n          self.resetIceGatheringComplete();\n          return pc.setLocalDescription(sdp);\n        }).catch(function localDescError(e) {\n          self.emit('peerConnection-SetLocalDescriptionFailed', e);\n          throw e;\n        }).then(function onSetLocalDescriptionSuccess() {\n          return self.waitForIceGatheringComplete();\n        }).then(function readySuccess() {\n          var localDescription = self.createRTCSessionDescriptionInit(self.peerConnection.localDescription);\n          return SIP.Utils.reducePromises(modifiers, localDescription);\n        }).then(function (localDescription) {\n          self.emit('getDescription', localDescription);\n          self.setDirection(localDescription.sdp);\n          return localDescription.sdp;\n        }).catch(function createOfferOrAnswerError(e) {\n          self.logger.error(e);\n          // TODO: Not sure if this is correct\n          throw new SIP.Exceptions.GetDescriptionError(e);\n        });\n      } },\n\n    // Creates an RTCSessionDescriptionInit from an RTCSessionDescription\n    createRTCSessionDescriptionInit: { writable: true, value: function createRTCSessionDescriptionInit(RTCSessionDescription) {\n        return {\n          type: RTCSessionDescription.type,\n          sdp: RTCSessionDescription.sdp\n        };\n      } },\n\n    addDefaultIceCheckingTimeout: { writable: true, value: function addDefaultIceCheckingTimeout(peerConnectionOptions) {\n        if (peerConnectionOptions.iceCheckingTimeout === undefined) {\n          peerConnectionOptions.iceCheckingTimeout = 5000;\n        }\n        return peerConnectionOptions;\n      } },\n\n    addDefaultIceServers: { writable: true, value: function addDefaultIceServers(rtcConfiguration) {\n        if (!rtcConfiguration.iceServers) {\n          rtcConfiguration.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];\n        }\n        return rtcConfiguration;\n      } },\n\n    checkAndDefaultConstraints: { writable: true, value: function checkAndDefaultConstraints(constraints) {\n        var defaultConstraints = { audio: true, video: true };\n        constraints = constraints || defaultConstraints;\n        // Empty object check\n        if (Object.keys(constraints).length === 0 && constraints.constructor === Object) {\n          return defaultConstraints;\n        }\n        return constraints;\n      } },\n\n    hasBrowserTrackSupport: { writable: true, value: function hasBrowserTrackSupport() {\n        return Boolean(this.peerConnection.addTrack);\n      } },\n\n    hasBrowserGetSenderSupport: { writable: true, value: function hasBrowserGetSenderSupport() {\n        return Boolean(this.peerConnection.getSenders);\n      } },\n\n    initPeerConnection: { writable: true, value: function initPeerConnection(options) {\n        var self = this;\n        options = options || {};\n        options = this.addDefaultIceCheckingTimeout(options);\n        options.rtcConfiguration = options.rtcConfiguration || {};\n        options.rtcConfiguration = this.addDefaultIceServers(options.rtcConfiguration);\n\n        this.logger.log('initPeerConnection');\n\n        if (this.peerConnection) {\n          this.logger.log('Already have a peer connection for this session. Tearing down.');\n          this.resetIceGatheringComplete();\n          this.peerConnection.close();\n        }\n\n        this.peerConnection = new this.WebRTC.RTCPeerConnection(options.rtcConfiguration);\n\n        this.logger.log('New peer connection created');\n        this.session.emit('peerConnection-created', this.peerConnection);\n\n        if ('ontrack' in this.peerConnection) {\n          this.peerConnection.addEventListener('track', function (e) {\n            self.logger.log('track added');\n            self.observer.trackAdded();\n            self.emit('addTrack', e);\n          });\n        } else {\n          this.logger.warn('Using onaddstream which is deprecated');\n          this.peerConnection.onaddstream = function (e) {\n            self.logger.log('stream added');\n            self.emit('addStream', e);\n          };\n        }\n\n        this.peerConnection.onicecandidate = function (e) {\n          self.emit('iceCandidate', e);\n          if (e.candidate) {\n            self.logger.log('ICE candidate received: ' + (e.candidate.candidate === null ? null : e.candidate.candidate.trim()));\n          }\n        };\n\n        this.peerConnection.onicegatheringstatechange = function () {\n          self.logger.log('RTCIceGatheringState changed: ' + this.iceGatheringState);\n          switch (this.iceGatheringState) {\n            case 'gathering':\n              self.emit('iceGathering', this);\n              if (!self.iceGatheringTimer && options.iceCheckingTimeout) {\n                self.iceGatheringTimeout = false;\n                self.iceGatheringTimer = SIP.Timers.setTimeout(function () {\n                  self.logger.log('RTCIceChecking Timeout Triggered after ' + options.iceCheckingTimeout + ' milliseconds');\n                  self.iceGatheringTimeout = true;\n                  self.triggerIceGatheringComplete();\n                }, options.iceCheckingTimeout);\n              }\n              break;\n            case 'complete':\n              self.triggerIceGatheringComplete();\n              break;\n          }\n        };\n\n        this.peerConnection.oniceconnectionstatechange = function () {\n          //need e for commented out case\n          var stateEvent;\n\n          switch (this.iceConnectionState) {\n            case 'new':\n              stateEvent = 'iceConnection';\n              break;\n            case 'checking':\n              stateEvent = 'iceConnectionChecking';\n              break;\n            case 'connected':\n              stateEvent = 'iceConnectionConnected';\n              break;\n            case 'completed':\n              stateEvent = 'iceConnectionCompleted';\n              break;\n            case 'failed':\n              stateEvent = 'iceConnectionFailed';\n              break;\n            case 'disconnected':\n              stateEvent = 'iceConnectionDisconnected';\n              break;\n            case 'closed':\n              stateEvent = 'iceConnectionClosed';\n              break;\n            default:\n              self.logger.warn('Unknown iceConnection state:', this.iceConnectionState);\n              return;\n          }\n          self.emit(stateEvent, this);\n        };\n      } },\n\n    acquire: { writable: true, value: function acquire(constraints) {\n        // Default audio & video to true\n        constraints = this.checkAndDefaultConstraints(constraints);\n\n        return new SIP.Utils.Promise(function (resolve, reject) {\n          /*\n           * Make the call asynchronous, so that ICCs have a chance\n           * to define callbacks to `userMediaRequest`\n           */\n          this.emit('userMediaRequest', constraints);\n\n          if (constraints.audio || constraints.video) {\n            this.WebRTC.getUserMedia(constraints).then(function (streams) {\n              this.observer.trackAdded();\n              this.emit('userMedia', streams);\n              resolve(streams);\n            }.bind(this)).catch(function (e) {\n              this.emit('userMediaFailed', e);\n              reject(e);\n            }.bind(this));\n          } else {\n            // Local streams were explicitly excluded.\n            resolve([]);\n          }\n        }.bind(this));\n      } },\n\n    isVideoHold: { writable: true, value: function isVideoHold(description) {\n        if (description.search(/^(m=video.*?)[\\s\\S]*^(a=sendonly?)/gm) !== -1) {\n          return true;\n        }\n        return false;\n      } },\n\n    hasOffer: { writable: true, value: function hasOffer(where) {\n        var offerState = 'have-' + where + '-offer';\n        return this.peerConnection.signalingState === offerState;\n      } },\n\n    // ICE gathering state handling\n\n    isIceGatheringComplete: { writable: true, value: function isIceGatheringComplete() {\n        return this.peerConnection.iceGatheringState === 'complete' || this.iceGatheringTimeout;\n      } },\n\n    resetIceGatheringComplete: { writable: true, value: function resetIceGatheringComplete() {\n        this.iceGatheringTimeout = false;\n\n        if (this.iceGatheringTimer) {\n          SIP.Timers.clearTimeout(this.iceGatheringTimer);\n          this.iceGatheringTimer = null;\n        }\n\n        if (this.iceGatheringDeferred) {\n          this.iceGatheringDeferred.reject();\n          this.iceGatheringDeferred = null;\n        }\n      } },\n\n    setDirection: { writable: true, value: function setDirection(sdp) {\n        var match = sdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);\n        if (match === null) {\n          this.direction = this.C.DIRECTION.NULL;\n          this.observer.directionChanged();\n          return;\n        }\n        var direction = match[1];\n        switch (direction) {\n          case this.C.DIRECTION.SENDRECV:\n          case this.C.DIRECTION.SENDONLY:\n          case this.C.DIRECTION.RECVONLY:\n          case this.C.DIRECTION.INACTIVE:\n            this.direction = direction;\n            break;\n          default:\n            this.direction = this.C.DIRECTION.NULL;\n            break;\n        }\n        this.observer.directionChanged();\n      } },\n\n    triggerIceGatheringComplete: { writable: true, value: function triggerIceGatheringComplete() {\n        if (this.isIceGatheringComplete()) {\n          this.emit('iceGatheringComplete', this);\n\n          if (this.iceGatheringTimer) {\n            SIP.Timers.clearTimeout(this.iceGatheringTimer);\n            this.iceGatheringTimer = null;\n          }\n\n          if (this.iceGatheringDeferred) {\n            this.iceGatheringDeferred.resolve();\n            this.iceGatheringDeferred = null;\n          }\n        }\n      } },\n\n    waitForIceGatheringComplete: { writable: true, value: function waitForIceGatheringComplete() {\n        if (this.isIceGatheringComplete()) {\n          return SIP.Utils.Promise.resolve();\n        } else if (!this.isIceGatheringDeferred) {\n          this.iceGatheringDeferred = SIP.Utils.defer();\n        }\n        return this.iceGatheringDeferred.promise;\n      } }\n  });\n\n  return SessionDescriptionHandler;\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack://SIP/./src/Web/SessionDescriptionHandler.js?");

/***/ }),

/***/ "./src/Web/Simple.js":
/*!***************************!*\
  !*** ./src/Web/Simple.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {\n/**\n * @fileoverview Simple\n */\n\n/* Simple\n * @class Simple\n */\n\nmodule.exports = function (SIP) {\n\n  var C = {\n    STATUS_NULL: 0,\n    STATUS_NEW: 1,\n    STATUS_CONNECTING: 2,\n    STATUS_CONNECTED: 3,\n    STATUS_COMPLETED: 4\n  };\n\n  /*\n   * @param {Object} options\n   */\n  var Simple = function Simple(options) {\n    /*\n     *  {\n     *    media: {\n     *      remote: {\n     *        audio: <DOM element>,\n     *        video: <DOM element>\n     *      },\n     *      local: {\n     *        video: <DOM element>\n     *      }\n     *    },\n     *    ua: {\n     *       <UA Configuration Options>\n     *    }\n     *  }\n     */\n\n    if (options.media.remote.video) {\n      this.video = true;\n    } else {\n      this.video = false;\n    }\n\n    if (options.media.remote.audio) {\n      this.audio = true;\n    } else {\n      this.audio = false;\n    }\n\n    if (!this.audio && !this.video) {\n      // Need to do at least audio or video\n      // Error\n      throw new Error('At least one remote audio or video element is required for Simple.');\n    }\n\n    this.options = options;\n\n    // https://stackoverflow.com/questions/7944460/detect-safari-browser\n    var browserUa = global.navigator.userAgent.toLowerCase();\n    var isSafari = false;\n    if (browserUa.indexOf('safari') > -1 && browserUa.indexOf('chrome') < 0) {\n      isSafari = true;\n    }\n    var sessionDescriptionHandlerFactoryOptions = {};\n    if (isSafari) {\n      sessionDescriptionHandlerFactoryOptions.modifiers = [SIP.Web.Modifiers.stripG722];\n    }\n\n    if (!this.options.ua.uri) {\n      this.anonymous = true;\n    }\n\n    this.ua = new SIP.UA({\n      // User Configurable Options\n      uri: this.options.ua.uri,\n      authorizationUser: this.options.ua.authorizationUser,\n      password: this.options.ua.password,\n      displayName: this.options.ua.displayName,\n      // Undocumented \"Advanced\" Options\n      userAgentString: this.options.ua.userAgentString,\n      // Fixed Options\n      register: true,\n      sessionDescriptionHandlerFactoryOptions: sessionDescriptionHandlerFactoryOptions,\n      transportOptions: { wsServers: this.options.ua.wsServers }\n    });\n\n    this.state = C.STATUS_NULL;\n\n    this.logger = this.ua.getLogger('sip.simple');\n\n    this.ua.on('registered', function () {\n      this.emit('registered', this.ua);\n    }.bind(this));\n\n    this.ua.on('unregistered', function () {\n      this.emit('unregistered', this.ua);\n    }.bind(this));\n\n    this.ua.on('failed', function () {\n      this.emit('unregistered', this.ua);\n    }.bind(this));\n\n    this.ua.on('invite', function (session) {\n      // If there is already an active session reject the incoming session\n      if (this.state !== C.STATUS_NULL && this.state !== C.STATUS_COMPLETED) {\n        this.logger.warn('Rejecting incoming call. Simple only supports 1 call at a time');\n        session.reject();\n        return;\n      }\n      this.session = session;\n      this.setupSession();\n      this.emit('ringing', this.session);\n    }.bind(this));\n\n    this.ua.on('message', function (message) {\n      this.emit('message', message);\n    }.bind(this));\n\n    return this;\n  };\n\n  Simple.prototype = Object.create(SIP.EventEmitter.prototype);\n  Simple.C = C;\n\n  // Public\n\n  Simple.prototype.call = function (destination) {\n    if (!this.ua || !this.checkRegistration()) {\n      this.logger.warn('A registered UA is required for calling');\n      return;\n    }\n    if (this.state !== C.STATUS_NULL && this.state !== C.STATUS_COMPLETED) {\n      this.logger.warn('Cannot make more than a single call with Simple');\n      return;\n    }\n    // Safari hack, because you cannot call .play() from a non user action\n    if (this.options.media.remote.audio) {\n      this.options.media.remote.audio.autoplay = true;\n    }\n    if (this.options.media.remote.video) {\n      this.options.media.remote.video.autoplay = true;\n    }\n    if (this.options.media.local && this.options.media.local.video) {\n      this.options.media.local.video.autoplay = true;\n      this.options.media.local.video.volume = 0;\n    }\n    this.session = this.ua.invite(destination, {\n      sessionDescriptionHandlerOptions: {\n        constraints: {\n          audio: this.audio,\n          video: this.video\n        }\n      }\n    });\n    this.setupSession();\n\n    return this.session;\n  };\n\n  Simple.prototype.answer = function () {\n    if (this.state !== C.STATUS_NEW && this.state !== C.STATUS_CONNECTING) {\n      this.logger.warn('No call to answer');\n      return;\n    }\n    // Safari hack, because you cannot call .play() from a non user action\n    if (this.options.media.remote.audio) {\n      this.options.media.remote.audio.autoplay = true;\n    }\n    if (this.options.media.remote.video) {\n      this.options.media.remote.video.autoplay = true;\n    }\n    return this.session.accept({\n      sessionDescriptionHandlerOptions: {\n        constraints: {\n          audio: this.audio,\n          video: this.video\n        }\n      }\n    });\n    // emit call is active\n  };\n\n  Simple.prototype.reject = function () {\n    if (this.state !== C.STATUS_NEW && this.state !== C.STATUS_CONNECTING) {\n      this.logger.warn('Call is already answered');\n      return;\n    }\n    return this.session.reject();\n  };\n\n  Simple.prototype.hangup = function () {\n    if (this.state !== C.STATUS_CONNECTED && this.state !== C.STATUS_CONNECTING && this.state !== C.STATUS_NEW) {\n      this.logger.warn('No active call to hang up on');\n      return;\n    }\n    if (this.state !== C.STATUS_CONNECTED) {\n      return this.session.cancel();\n    } else {\n      return this.session.bye();\n    }\n  };\n\n  Simple.prototype.hold = function () {\n    if (this.state !== C.STATUS_CONNECTED || this.session.local_hold) {\n      this.logger.warn('Cannot put call on hold');\n      return;\n    }\n    this.mute();\n    this.logger.log('Placing session on hold');\n    return this.session.hold();\n  };\n\n  Simple.prototype.unhold = function () {\n    if (this.state !== C.STATUS_CONNECTED || !this.session.local_hold) {\n      this.logger.warn('Cannot unhold a call that is not on hold');\n      return;\n    }\n    this.unmute();\n    this.logger.log('Placing call off hold');\n    return this.session.unhold();\n  };\n\n  Simple.prototype.mute = function () {\n    if (this.state !== C.STATUS_CONNECTED) {\n      this.logger.warn('An acitve call is required to mute audio');\n      return;\n    }\n    this.logger.log('Muting Audio');\n    this.toggleMute(true);\n    this.emit('mute', this);\n  };\n\n  Simple.prototype.unmute = function () {\n    if (this.state !== C.STATUS_CONNECTED) {\n      this.logger.warn('An active call is required to unmute audio');\n      return;\n    }\n    this.logger.log('Unmuting Audio');\n    this.toggleMute(false);\n    this.emit('unmute', this);\n  };\n\n  Simple.prototype.sendDTMF = function (tone) {\n    if (this.state !== C.STATUS_CONNECTED) {\n      this.logger.warn('An active call is required to send a DTMF tone');\n      return;\n    }\n    this.logger.log('Sending DTMF tone: ' + tone);\n    this.session.dtmf(tone);\n  };\n\n  Simple.prototype.message = function (destination, message) {\n    if (!this.ua || !this.checkRegistration()) {\n      this.logger.warn('A registered UA is required to send a message');\n      return;\n    }\n    if (!destination || !message) {\n      this.logger.warn('A destination and message are required to send a message');\n      return;\n    }\n    this.ua.message(destination, message);\n  };\n\n  // Private Helpers\n\n  Simple.prototype.checkRegistration = function () {\n    return this.anonymous || this.ua && this.ua.isRegistered();\n  };\n\n  Simple.prototype.setupRemoteMedia = function () {\n    // If there is a video track, it will attach the video and audio to the same element\n    var pc = this.session.sessionDescriptionHandler.peerConnection;\n    var remoteStream;\n\n    if (pc.getReceivers) {\n      remoteStream = new global.window.MediaStream();\n      pc.getReceivers().forEach(function (receiver) {\n        var track = receiver.track;\n        if (track) {\n          remoteStream.addTrack(track);\n        }\n      });\n    } else {\n      remoteStream = pc.getRemoteStreams()[0];\n    }\n    if (this.video) {\n      this.options.media.remote.video.srcObject = remoteStream;\n      this.options.media.remote.video.play().catch(function () {\n        this.logger.log('play was rejected');\n      }.bind(this));\n    } else if (this.audio) {\n      this.options.media.remote.audio.srcObject = remoteStream;\n      this.options.media.remote.audio.play().catch(function () {\n        this.logger.log('play was rejected');\n      }.bind(this));\n    }\n  };\n\n  Simple.prototype.setupLocalMedia = function () {\n    if (this.video && this.options.media.local && this.options.media.local.video) {\n      var pc = this.session.sessionDescriptionHandler.peerConnection;\n      var localStream;\n      if (pc.getSenders) {\n        localStream = new global.window.MediaStream();\n        pc.getSenders().forEach(function (sender) {\n          var track = sender.track;\n          if (track && track.kind === 'video') {\n            localStream.addTrack(track);\n          }\n        });\n      } else {\n        localStream = pc.getLocalStreams()[0];\n      }\n      this.options.media.local.video.srcObject = localStream;\n      this.options.media.local.video.volume = 0;\n      this.options.media.local.video.play();\n    }\n  };\n\n  Simple.prototype.cleanupMedia = function () {\n    if (this.video) {\n      this.options.media.remote.video.srcObject = null;\n      this.options.media.remote.video.pause();\n      if (this.options.media.local && this.options.media.local.video) {\n        this.options.media.local.video.srcObject = null;\n        this.options.media.local.video.pause();\n      }\n    }\n    if (this.audio) {\n      this.options.media.remote.audio.srcObject = null;\n      this.options.media.remote.audio.pause();\n    }\n  };\n\n  Simple.prototype.setupSession = function () {\n    this.state = C.STATUS_NEW;\n    this.emit('new', this.session);\n\n    this.session.on('progress', this.onProgress.bind(this));\n    this.session.on('accepted', this.onAccepted.bind(this));\n    this.session.on('rejected', this.onEnded.bind(this));\n    this.session.on('failed', this.onFailed.bind(this));\n    this.session.on('terminated', this.onEnded.bind(this));\n  };\n\n  Simple.prototype.destroyMedia = function () {\n    this.session.sessionDescriptionHandler.close();\n  };\n\n  Simple.prototype.toggleMute = function (mute) {\n    var pc = this.session.sessionDescriptionHandler.peerConnection;\n    if (pc.getSenders) {\n      pc.getSenders().forEach(function (sender) {\n        if (sender.track) {\n          sender.track.enabled = !mute;\n        }\n      });\n    } else {\n      pc.getLocalStreams().forEach(function (stream) {\n        stream.getAudioTracks().forEach(function (track) {\n          track.enabled = !mute;\n        });\n        stream.getVideoTracks().forEach(function (track) {\n          track.enabled = !mute;\n        });\n      });\n    }\n  };\n\n  Simple.prototype.onAccepted = function () {\n    this.state = C.STATUS_CONNECTED;\n    this.emit('connected', this.session);\n\n    this.setupLocalMedia();\n    this.setupRemoteMedia();\n    this.session.sessionDescriptionHandler.on('addTrack', function () {\n      this.logger.log('A track has been added, triggering new remoteMedia setup');\n      this.setupRemoteMedia();\n    }.bind(this));\n\n    this.session.sessionDescriptionHandler.on('addStream', function () {\n      this.logger.log('A stream has been added, trigger new remoteMedia setup');\n      this.setupRemoteMedia();\n    }.bind(this));\n\n    this.session.on('hold', function () {\n      this.emit('hold', this.session);\n    }.bind(this));\n    this.session.on('unhold', function () {\n      this.emit('unhold', this.session);\n    }.bind(this));\n    this.session.on('dtmf', function (tone) {\n      this.emit('dtmf', tone);\n    }.bind(this));\n    this.session.on('bye', this.onEnded.bind(this));\n  };\n\n  Simple.prototype.onProgress = function () {\n    this.state = C.STATUS_CONNECTING;\n    this.emit('connecting', this.session);\n  };\n\n  Simple.prototype.onFailed = function () {\n    this.onEnded();\n  };\n\n  Simple.prototype.onEnded = function () {\n    this.state = C.STATUS_COMPLETED;\n    this.emit('ended', this.session);\n    this.cleanupMedia();\n  };\n\n  return Simple;\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack://SIP/./src/Web/Simple.js?");

/***/ }),

/***/ "./src/Web/Transport.js":
/*!******************************!*\
  !*** ./src/Web/Transport.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {\n/**\n * @fileoverview Transport\n */\n\n/**\n * @augments SIP\n * @class Transport\n * @param {Object} options\n */\n\nmodule.exports = function (SIP) {\n  var Transport,\n      C = {\n    // Transport status codes\n    STATUS_CONNECTING: 0,\n    STATUS_OPEN: 1,\n    STATUS_CLOSING: 2,\n    STATUS_CLOSED: 3\n  };\n\n  var WebSocket = (global.window || global).WebSocket;\n\n  /**\n   * Compute an amount of time in seconds to wait before sending another\n   * keep-alive.\n   * @returns {Number}\n   */\n  function computeKeepAliveTimeout(upperBound) {\n    var lowerBound = upperBound * 0.8;\n    return 1000 * (Math.random() * (upperBound - lowerBound) + lowerBound);\n  }\n\n  Transport = function Transport(logger, options) {\n    options = SIP.Utils.defaultOptions({}, options);\n    this.logger = logger;\n\n    this.ws = null;\n    this.server = null;\n\n    this.connectionPromise = null;\n    this.connectionTimeout = null;\n\n    // Reconnection stuff\n    this.transportRecoverAttempts = 0;\n    this.transportRecoveryTimer = null;\n\n    this.reconnectionAttempts = 0;\n    this.reconnectTimer = null;\n    this.lastTransportError = {};\n\n    // Keep alive\n    this.keepAliveInterval = null;\n    this.keepAliveDebounceTimeout = null;\n\n    this.status = C.STATUS_CONNECTING;\n\n    this.configuration = {};\n\n    try {\n      this.loadConfig(options);\n    } catch (e) {\n      this.status = C.STATUS_NOT_READY;\n      this.error = C.CONFIGURATION_ERROR;\n      throw e;\n    }\n  };\n\n  Transport.prototype = Object.create(SIP.Transport.prototype, {\n\n    /**\n    *\n    * @returns {Boolean}\n    */\n    isConnected: { writable: true, value: function isConnected() {\n        return this.status === C.STATUS_OPEN;\n      } },\n\n    /**\n     * Send a message.\n     * @param {SIP.OutgoingRequest|String} msg\n     * @param {Object} [options]\n     * @returns {Promise}\n     */\n    sendMsgPromise: { writable: true, value: function sendMsgPromise(msg, options) {\n        options = options || {};\n        if (!this.statusAssert(C.STATUS_OPEN, options.force)) {\n          this.onError('unable to send message - WebSocket not open');\n          return SIP.Utils.Promise.reject();\n        }\n\n        var message = msg.toString();\n\n        if (this.ws) {\n          if (this.configuration.traceSip === true) {\n            this.logger.log('sending WebSocket message:\\n\\n' + message + '\\n');\n          }\n          this.ws.send(message);\n          return SIP.Utils.Promise.resolve({ msg: message });\n        } else {\n          this.onError('unable to send message - WebSocket does not exist');\n          return SIP.Utils.Promise.reject();\n        }\n      } },\n\n    /**\n    * Disconnect socket.\n    */\n    disconnectPromise: { writable: true, value: function disconnectPromise(options) {\n        if (!this.statusTransition(C.STATUS_CLOSING, options.force)) {\n          SIP.Utils.Promise.reject();\n        }\n\n        if (this.ws) {\n          // Clear reconnectTimer\n          SIP.Timers.clearTimeout(this.reconnectTimer);\n\n          this.stopSendingKeepAlives();\n\n          this.logger.log('closing WebSocket ' + this.server.ws_uri);\n          this.ws.close(options.code, options.reason);\n        }\n\n        if (this.reconnectTimer) {\n          SIP.Timers.clearTimeout(this.reconnectTimer);\n          this.reconnectTimer = null;\n        }\n        return SIP.Utils.Promise.resolve({ overrideEvent: true });\n      } },\n\n    /**\n    * Connect socket.\n    */\n    connectPromise: { writable: true, value: function connectPromise(options) {\n        if (this.connectionPromise) {\n          return this.connectionPromise;\n        }\n        options = options || {};\n        this.server = this.server || this.getNextWsServer();\n\n        this.connectionPromise = new SIP.Utils.Promise(function (resolve, reject) {\n\n          if ((this.status === C.STATUS_OPEN || this.status === C.STATUS_CLOSING) && !options.force) {\n            this.logger.warn('WebSocket ' + this.server.ws_uri + ' is already connected');\n            reject();\n            return;\n          }\n\n          this.logger.log('connecting to WebSocket ' + this.server.ws_uri);\n          try {\n            this.ws = new WebSocket(this.server.ws_uri, 'sip');\n          } catch (e) {\n            this.ws = null;\n            this.status = C.STATUS_CLOSED; // force status to closed in error case\n            this.onError('error connecting to WebSocket ' + this.server.ws_uri + ':' + e);\n            reject();\n            return;\n          }\n\n          this.transportRecoverAttempts = 0;\n\n          if (!this.ws) {\n            reject();\n            return;\n          }\n\n          this.connectionTimeout = SIP.Timers.setTimeout(function () {\n            this.onError('took too long to connect - exceeded time set in configuration.connectionTimeout: ' + this.configuration.connectionTimeout + 's');\n          }.bind(this), this.configuration.connectionTimeout * 1000);\n\n          this.ws.addEventListener('open', this.onOpen.bind(this, resolve));\n          this.ws.addEventListener('message', this.onMessage.bind(this));\n          this.ws.addEventListener('close', this.onClose.bind(this));\n        }.bind(this));\n\n        return this.connectionPromise;\n      } },\n\n    // Transport Event Handlers\n\n    /**\n    * @event\n    * @param {event} e\n    */\n    onOpen: { writable: true, value: function onOpen(resolve) {\n        this.status = C.STATUS_OPEN; // quietly force status to open\n        this.emit('connected');\n        SIP.Timers.clearTimeout(this.connectionTimeout);\n\n        this.logger.log('WebSocket ' + this.server.ws_uri + ' connected');\n\n        // Clear reconnectTimer since we are not disconnected\n        if (this.reconnectTimer !== null) {\n          SIP.Timers.clearTimeout(this.reconnectTimer);\n          this.reconnectTimer = null;\n        }\n        // Reset reconnectionAttempts\n        this.reconnectionAttempts = 0;\n\n        // Start sending keep-alives\n        this.startSendingKeepAlives();\n        resolve({ overrideEvent: true });\n      } },\n\n    /**\n    * @event\n    * @param {event} e\n    */\n    onClose: { writable: true, value: function onClose(e) {\n        var oldStatus = this.status;\n        this.status = C.STATUS_CLOSED; // quietly force status to closed\n\n        this.logger.log('WebSocket disconnected (code: ' + e.code + (e.reason ? '| reason: ' + e.reason : '') + ')');\n        this.lastTransportError = { code: e.code, reason: e.reason };\n        this.emit('disconnected', this.lastTransportError);\n\n        this.stopSendingKeepAlives();\n        SIP.Timers.clearTimeout(this.connectionTimeout);\n        this.connectionTimeout = null;\n\n        if (this.reconnectionAttempts > 0) {\n          this.logger.log('Reconnection attempt ' + this.reconnectionAttempts + ' failed (code: ' + e.code + (e.reason ? '| reason: ' + e.reason : '') + ')');\n          this.reconnect();\n        } else {\n          if (oldStatus === C.STATUS_OPEN && e.wasClean === false) {\n            this.disposeWs();\n            this.logger.warn('WebSocket abrupt disconnection');\n          }\n          // Check whether the user requested to close.\n          if (oldStatus === C.STATUS_CLOSING) {\n            return;\n          } else {\n            this.emit('transportError');\n            this.reconnect();\n          }\n        }\n      } },\n\n    /**\n    * Removes event listeners and clears the instance ws\n    * @private\n    * @param {event} e\n    */\n    disposeWs: { writable: true, value: function disposeWs() {\n        if (this.ws) {\n          this.ws.removeEventListener('open', this.onOpen.bind(this));\n          this.ws.removeEventListener('message', this.onMessage.bind(this));\n          this.ws.removeEventListener('error', this.onError.bind(this));\n          this.ws.removeEventListener('close', this.onClose.bind(this));\n          this.ws = null;\n        }\n      } },\n\n    /**\n    * @event\n    * @param {event} e\n    */\n    onMessage: { writable: true, value: function onMessage(e) {\n        var data = e.data;\n        // CRLF Keep Alive response from server. Clear our keep alive timeout.\n        if (data === '\\r\\n') {\n          this.clearKeepAliveTimeout();\n\n          if (this.configuration.traceSip === true) {\n            this.logger.log('received WebSocket message with CRLF Keep Alive response');\n          }\n          return;\n        } else if (!data) {\n          this.logger.warn('received empty message, message discarded');\n          return;\n        }\n\n        // WebSocket binary message.\n        else if (typeof data !== 'string') {\n            try {\n              data = String.fromCharCode.apply(null, new Uint8Array(data));\n            } catch (err) {\n              this.logger.warn('received WebSocket binary message failed to be converted into string, message discarded');\n              return;\n            }\n\n            if (this.configuration.traceSip === true) {\n              this.logger.log('received WebSocket binary message:\\n\\n' + data + '\\n');\n            }\n          }\n\n          // WebSocket text message.\n          else {\n              if (this.configuration.traceSip === true) {\n                this.logger.log('received WebSocket text message:\\n\\n' + data + '\\n');\n              }\n            }\n\n        this.emit('message', data);\n      } },\n\n    /**\n    * @event\n    * @param {event} e\n    */\n    onError: { writable: true, value: function onError(e) {\n        this.logger.warn('Transport error: ' + e);\n        this.emit('transportError');\n      } },\n\n    /**\n    * Reconnection attempt logic.\n    * @private\n    */\n    reconnect: { writable: true, value: function reconnect() {\n        if (this.noAvailableServers()) {\n          this.logger.warn('no available ws servers left - going to closed state');\n          this.status = C.STATUS_CLOSED;\n          return;\n        }\n\n        this.connectionPromise = null;\n        if (this.isConnected()) {\n          this.logger.warn('attempted to reconnect while connected - forcing disconnect');\n          this.disconnect({ force: true });\n        }\n        this.status = C.STATUS_CONNECTING; // quietly force status to connecting\n\n        this.reconnectionAttempts += 1;\n\n        if (this.reconnectionAttempts > this.configuration.maxReconnectionAttempts) {\n          this.logger.warn('maximum reconnection attempts for WebSocket ' + this.server.ws_uri);\n          this.logger.log('transport ' + this.server.ws_uri + ' failed | connection state set to \\'error\\'');\n          this.server.isError = true;\n          this.emit('transportError');\n          this.server = this.getNextWsServer();\n          this.reconnectionAttempts = 0;\n          this.reconnect();\n          //recover\n        } else if (this.reconnectionAttempts === 1) {\n          this.logger.log('Connection to WebSocket ' + this.server.ws_uri + ' severed, attempting first reconnect');\n          this.disposeWs();\n          this.connect();\n        } else {\n          this.logger.log('trying to reconnect to WebSocket ' + this.server.ws_uri + ' (reconnection attempt ' + this.reconnectionAttempts + ')');\n\n          this.reconnectTimer = SIP.Timers.setTimeout(function () {\n            this.disposeWs();\n            this.connect();\n            this.reconnectTimer = null;\n          }, this.configuration.reconnectionTimeout * 1000);\n        }\n      } },\n\n    /**\n    * Retrieve the next server to which connect.\n    * @private\n    * @returns {Object} wsServer\n    */\n    getNextWsServer: { writable: true, value: function getNextWsServer() {\n        if (this.noAvailableServers()) {\n          this.logger.warn('attempted to get next ws server but there are no available ws servers left');\n          return;\n        }\n        // Order servers by weight\n        var idx,\n            length,\n            wsServer,\n            candidates = [];\n\n        length = this.configuration.wsServers.length;\n        for (idx = 0; idx < length; idx++) {\n          wsServer = this.configuration.wsServers[idx];\n\n          if (wsServer.isError) {\n            continue;\n          } else if (candidates.length === 0) {\n            candidates.push(wsServer);\n          } else if (wsServer.weight > candidates[0].weight) {\n            candidates = [wsServer];\n          } else if (wsServer.weight === candidates[0].weight) {\n            candidates.push(wsServer);\n          }\n        }\n\n        idx = Math.floor(Math.random() * candidates.length);\n\n        return candidates[idx];\n      } },\n\n    /**\n    * Checks all configuration servers, returns true if all of them have isError: true and false otherwise\n    * @private\n    * @returns {Boolean}\n    */\n    noAvailableServers: { writable: true, value: function noAvailableServers() {\n        var server,\n            isAllError = true;\n        for (server in this.configuration.wsServers) {\n          if (!this.configuration.wsServers[server].isError) {\n            isAllError = false;\n          }\n        }\n        return isAllError;\n      } },\n\n    //==============================\n    // KeepAlive Stuff\n    //==============================\n\n    /**\n     * Send a keep-alive (a double-CRLF sequence).\n     * @private\n     * @returns {Boolean}\n     */\n    sendKeepAlive: { writable: true, value: function sendKeepAlive() {\n        if (this.keepAliveDebounceTimeout) {\n          // We already have an outstanding keep alive, do not send another.\n          return;\n        }\n\n        this.keepAliveDebounceTimeout = SIP.Timers.setTimeout(function () {\n          this.emit('keepAliveDebounceTimeout');\n        }.bind(this), this.configuration.keepAliveDebounce * 1000);\n\n        return this.send('\\r\\n\\r\\n');\n      } },\n\n    clearKeepAliveTimeout: { writable: true, value: function clearKeepAliveTimeout() {\n        SIP.Timers.clearTimeout(this.keepAliveDebounceTimeout);\n        this.keepAliveDebounceTimeout = null;\n      } },\n\n    /**\n     * Start sending keep-alives.\n     * @private\n     */\n    startSendingKeepAlives: { writable: true, value: function startSendingKeepAlives() {\n        if (this.configuration.keepAliveInterval && !this.keepAliveInterval) {\n          this.keepAliveInterval = SIP.Timers.setInterval(function () {\n            this.sendKeepAlive();\n            this.startSendingKeepAlives();\n          }.bind(this), computeKeepAliveTimeout(this.configuration.keepAliveInterval));\n        }\n      } },\n\n    /**\n     * Stop sending keep-alives.\n     * @private\n     */\n    stopSendingKeepAlives: { writable: true, value: function stopSendingKeepAlives() {\n        SIP.Timers.clearInterval(this.keepAliveInterval);\n        SIP.Timers.clearTimeout(this.keepAliveDebounceTimeout);\n        this.keepAliveInterval = null;\n        this.keepAliveDebounceTimeout = null;\n      } },\n\n    //==============================\n    // Status Stuff\n    //==============================\n\n    /**\n    * Checks given status against instance current status. Returns true if they match\n    * @private\n    * @param {Number} status\n    * @param {Boolean} [force]\n    * @returns {Boolean}\n    */\n    statusAssert: { writable: true, value: function statusAssert(status, force) {\n        if (status === this.status) {\n          return true;\n        } else {\n          if (force) {\n            this.logger.warn('Attempted to assert ' + Object.keys(C)[this.status] + ' as ' + Object.keys(C)[status] + '- continuing with option: \\'force\\'');\n            return true;\n          } else {\n            this.logger.warn('Tried to assert ' + Object.keys(C)[status] + ' but is currently ' + Object.keys(C)[this.status]);\n            return false;\n          }\n        }\n      } },\n\n    /**\n    * Transitions the status. Checks for legal transition via assertion beforehand\n    * @private\n    * @param {Number} status\n    * @param {Boolean} [force]\n    * @returns {Boolean}\n    */\n    statusTransition: { writable: true, value: function statusTransition(status, force) {\n        this.logger.log('Attempting to transition status from ' + Object.keys(C)[this.status] + ' to ' + Object.keys(C)[status]);\n        if (status === C.STATUS_OPEN && this.statusAssert(C.STATUS_CONNECTING, force) || status === C.STATUS_CLOSING && this.statusAssert(C.STATUS_OPEN, force) || status === C.STATUS_CLOSED && this.statusAssert(C.STATUS_CLOSING, force)) {\n          this.status = status;\n          return true;\n        } else {\n          this.logger.warn('Status transition failed - result: no-op - reason: either gave an nonexistent status or attempted illegal transition');\n          return false;\n        }\n      } },\n\n    //==============================\n    // Configuration Handling\n    //==============================\n\n    /**\n     * Configuration load.\n     * @private\n     * returns {Boolean}\n     */\n    loadConfig: { writable: true, value: function loadConfig(configuration) {\n        var parameter,\n            value,\n            checked_value,\n            settings = {\n          wsServers: [{\n            scheme: 'WSS',\n            sip_uri: '<sip:edge.sip.onsip.com;transport=ws;lr>',\n            weight: 0,\n            ws_uri: 'wss://edge.sip.onsip.com',\n            isError: false\n          }],\n\n          connectionTimeout: 5,\n\n          maxReconnectionAttempts: 3,\n          reconnectionTimeout: 4,\n\n          keepAliveInterval: 0,\n          keepAliveDebounce: 10,\n\n          // Logging\n          traceSip: false\n        };\n\n        // Pre-Configuration\n        function aliasUnderscored(parameter, logger) {\n          var underscored = parameter.replace(/([a-z][A-Z])/g, function (m) {\n            return m[0] + '_' + m[1].toLowerCase();\n          });\n\n          if (parameter === underscored) {\n            return;\n          }\n\n          var hasParameter = configuration.hasOwnProperty(parameter);\n          if (configuration.hasOwnProperty(underscored)) {\n            logger.warn(underscored + ' is deprecated, please use ' + parameter);\n            if (hasParameter) {\n              logger.warn(parameter + ' overriding ' + underscored);\n            }\n          }\n\n          configuration[parameter] = hasParameter ? configuration[parameter] : configuration[underscored];\n        }\n\n        var configCheck = this.getConfigurationCheck();\n\n        // Check Mandatory parameters\n        for (parameter in configCheck.mandatory) {\n          aliasUnderscored(parameter, this.logger);\n          if (!configuration.hasOwnProperty(parameter)) {\n            throw new SIP.Exceptions.ConfigurationError(parameter);\n          } else {\n            value = configuration[parameter];\n            checked_value = configCheck.mandatory[parameter](value);\n            if (checked_value !== undefined) {\n              settings[parameter] = checked_value;\n            } else {\n              throw new SIP.Exceptions.ConfigurationError(parameter, value);\n            }\n          }\n        }\n\n        // Check Optional parameters\n        for (parameter in configCheck.optional) {\n          aliasUnderscored(parameter, this.logger);\n          if (configuration.hasOwnProperty(parameter)) {\n            value = configuration[parameter];\n\n            // If the parameter value is an empty array, but shouldn't be, apply its default value.\n            if (value instanceof Array && value.length === 0) {\n              continue;\n            }\n\n            // If the parameter value is null, empty string, or undefined then apply its default value.\n            if (value === null || value === '' || value === undefined) {\n              continue;\n            }\n            // If it's a number with NaN value then also apply its default value.\n            // NOTE: JS does not allow \"value === NaN\", the following does the work:\n            else if (typeof value === 'number' && isNaN(value)) {\n                continue;\n              }\n\n            checked_value = configCheck.optional[parameter](value);\n            if (checked_value !== undefined) {\n              settings[parameter] = checked_value;\n            } else {\n              throw new SIP.Exceptions.ConfigurationError(parameter, value);\n            }\n          }\n        }\n\n        // Sanity Checks\n\n        // Connection recovery intervals\n        // if(settings.connectionRecoveryMaxInterval < settings.connectionRecoveryMinInterval) {\n        //   throw new SIP.Exceptions.ConfigurationError('connectionRecoveryMaxInterval', settings.connectionRecoveryMaxInterval);\n        // }\n\n        var skeleton = {};\n        // Fill the value of the configuration_skeleton\n        for (parameter in settings) {\n          skeleton[parameter] = {\n            value: settings[parameter]\n          };\n        }\n\n        Object.defineProperties(this.configuration, skeleton);\n\n        this.logger.log('configuration parameters after validation:');\n        for (parameter in settings) {\n          this.logger.log('· ' + parameter + ': ' + JSON.stringify(settings[parameter]));\n        }\n\n        return;\n      } },\n\n    /**\n     * Configuration checker.\n     * @private\n     * @return {Boolean}\n     */\n    getConfigurationCheck: { writable: true, value: function getConfigurationCheck() {\n        return {\n          mandatory: {},\n\n          optional: {\n\n            //Note: this function used to call 'this.logger.error' but calling 'this' with anything here is invalid\n            wsServers: function wsServers(_wsServers) {\n              var idx, length, url;\n\n              /* Allow defining wsServers parameter as:\n               *  String: \"host\"\n               *  Array of Strings: [\"host1\", \"host2\"]\n               *  Array of Objects: [{ws_uri:\"host1\", weight:1}, {ws_uri:\"host2\", weight:0}]\n               *  Array of Objects and Strings: [{ws_uri:\"host1\"}, \"host2\"]\n               */\n              if (typeof _wsServers === 'string') {\n                _wsServers = [{ ws_uri: _wsServers }];\n              } else if (_wsServers instanceof Array) {\n                length = _wsServers.length;\n                for (idx = 0; idx < length; idx++) {\n                  if (typeof _wsServers[idx] === 'string') {\n                    _wsServers[idx] = { ws_uri: _wsServers[idx] };\n                  }\n                }\n              } else {\n                return;\n              }\n\n              if (_wsServers.length === 0) {\n                return false;\n              }\n\n              length = _wsServers.length;\n              for (idx = 0; idx < length; idx++) {\n                if (!_wsServers[idx].ws_uri) {\n                  return;\n                }\n                if (_wsServers[idx].weight && !Number(_wsServers[idx].weight)) {\n                  return;\n                }\n\n                url = SIP.Grammar.parse(_wsServers[idx].ws_uri, 'absoluteURI');\n\n                if (url === -1) {\n                  return;\n                } else if (['wss', 'ws', 'udp'].indexOf(url.scheme) < 0) {\n                  return;\n                } else {\n                  _wsServers[idx].sip_uri = '<sip:' + url.host + (url.port ? ':' + url.port : '') + ';transport=' + url.scheme.replace(/^wss$/i, 'ws') + ';lr>';\n\n                  if (!_wsServers[idx].weight) {\n                    _wsServers[idx].weight = 0;\n                  }\n\n                  _wsServers[idx].isError = false;\n                  _wsServers[idx].scheme = url.scheme.toUpperCase();\n                }\n              }\n              return _wsServers;\n            },\n\n            keepAliveInterval: function keepAliveInterval(_keepAliveInterval) {\n              var value;\n              if (SIP.Utils.isDecimal(_keepAliveInterval)) {\n                value = Number(_keepAliveInterval);\n                if (value > 0) {\n                  return value;\n                }\n              }\n            },\n\n            keepAliveDebounce: function keepAliveDebounce(_keepAliveDebounce) {\n              var value;\n              if (SIP.Utils.isDecimal(_keepAliveDebounce)) {\n                value = Number(_keepAliveDebounce);\n                if (value > 0) {\n                  return value;\n                }\n              }\n            },\n\n            traceSip: function traceSip(_traceSip) {\n              if (typeof _traceSip === 'boolean') {\n                return _traceSip;\n              }\n            },\n\n            connectionTimeout: function connectionTimeout(_connectionTimeout) {\n              var value;\n              if (SIP.Utils.isDecimal(_connectionTimeout)) {\n                value = Number(_connectionTimeout);\n                if (value > 0) {\n                  return value;\n                }\n              }\n            },\n\n            maxReconnectionAttempts: function maxReconnectionAttempts(_maxReconnectionAttempts) {\n              var value;\n              if (SIP.Utils.isDecimal(_maxReconnectionAttempts)) {\n                value = Number(_maxReconnectionAttempts);\n                if (value >= 0) {\n                  return value;\n                }\n              }\n            },\n\n            reconnectionTimeout: function reconnectionTimeout(_reconnectionTimeout) {\n              var value;\n              if (SIP.Utils.isDecimal(_reconnectionTimeout)) {\n                value = Number(_reconnectionTimeout);\n                if (value > 0) {\n                  return value;\n                }\n              }\n            }\n\n          }\n        };\n      } }\n  });\n\n  Transport.C = C;\n  SIP.Web.Transport = Transport;\n  return Transport;\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack://SIP/./src/Web/Transport.js?");

/***/ }),

/***/ "./src/environment_browser.js":
/*!************************************!*\
  !*** ./src/environment_browser.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {\n\nvar toplevel = global.window || global;\n\nfunction getPrefixedProperty(object, name) {\n  if (object == null) {\n    return;\n  }\n  var capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);\n  var prefixedNames = [name, 'webkit' + capitalizedName, 'moz' + capitalizedName];\n  for (var i in prefixedNames) {\n    var property = object[prefixedNames[i]];\n    if (property) {\n      return property.bind(object);\n    }\n  }\n}\n\nmodule.exports = {\n  WebSocket: toplevel.WebSocket,\n  Transport: __webpack_require__(/*! ./Transport */ \"./src/Transport.js\"),\n  open: toplevel.open,\n  Promise: toplevel.Promise,\n  timers: toplevel,\n\n  // Console is not defined in ECMAScript, so just in case...\n  console: toplevel.console || {\n    debug: function debug() {},\n    log: function log() {},\n    warn: function warn() {},\n    error: function error() {}\n  },\n\n  addEventListener: getPrefixedProperty(toplevel, 'addEventListener'),\n  removeEventListener: getPrefixedProperty(toplevel, 'removeEventListener')\n};\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack://SIP/./src/environment_browser.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = __webpack_require__(/*! ./SIP */ \"./src/SIP.js\")(__webpack_require__(/*! ./environment */ \"./src/environment_browser.js\"));\n\n//# sourceURL=webpack://SIP/./src/index.js?");

/***/ })

/******/ });
});

/***/ }),

/***/ 40:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export HOST */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return API_HOST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return UPLOAD_HOST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ANDROID_DOWNLOAD_URL; });
//服务器地址
// export const HOST = 'http://192.168.0.106:3000';
var HOST = 'http://192.168.2.101:8008';
//api根地址
var API_HOST = HOST + '/api/v1';
//上传文件地址
var UPLOAD_HOST = HOST + '';
//apk地址
var ANDROID_DOWNLOAD_URL = HOST + '/ionic-uuchat.apk';
//# sourceMappingURL=config.js.map

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatContentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_media__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_msg__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_backend__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_filter__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__config_config__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__user_detail_user_detail__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__reorder_reorder__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__utils_utils__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__utils_file_utils__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_rxjs_BehaviorSubject__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_keyboard__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_file__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




















var ChatContentPage = /** @class */ (function () {
    function ChatContentPage(_ngZone, _ref, navCtrl, actionSheetCtrl, params, fb, renderer, platform, storage, media, keyboard, cordovaFile, userService, msgService, systemService, myHttp, backEnd) {
        this._ngZone = _ngZone;
        this._ref = _ref;
        this.navCtrl = navCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.params = params;
        this.fb = fb;
        this.renderer = renderer;
        this.platform = platform;
        this.storage = storage;
        this.media = media;
        this.keyboard = keyboard;
        this.cordovaFile = cordovaFile;
        this.userService = userService;
        this.msgService = msgService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.backEnd = backEnd;
        this.isAudio = false;
        this.isLoading = false;
        this.isShowFace = false;
        this.msgList = [];
        this.faceItems = [];
        this.pageIndexSubject = new __WEBPACK_IMPORTED_MODULE_16_rxjs_BehaviorSubject__["BehaviorSubject"](1);
        this.pageTitle = '';
        this.apikey = '';
        //语音
        this.recordFileSrc = 'record.mp3';
        this.recording = false;
        this.recordDuration = 0;
        this.relationId = params.data.relationId;
        this.pageTitle = params.data.chatName;
        this.ownId = backEnd.getOwnId();
        // 
        this.form = fb.group({
            content: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]
        });
        //
    }
    ChatContentPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, _b, token, ownId, username, checkInfo, rest, i, suffix, ex_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        _a = this;
                        return [4 /*yield*/, this.storage.get('apikey')];
                    case 1:
                        _a.apikey = _c.sent();
                        return [4 /*yield*/, this.getToken()];
                    case 2:
                        _b = _c.sent(), token = _b[0], ownId = _b[1], username = _b[2];
                        if (!this.apikey) return [3 /*break*/, 10];
                        checkInfo = null;
                        if (!token) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkVisitorToken(this.apikey, token)];
                    case 3:
                        checkInfo = _c.sent();
                        _c.label = 4;
                    case 4:
                        if (!checkInfo) return [3 /*break*/, 5];
                        console.log('当前用户之前联系过我:', token, ownId);
                        this.relationId = checkInfo.tenantId;
                        this.pageTitle = checkInfo.companyName || checkInfo.tenantId;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.createNewVistor()];
                    case 6:
                        rest = _c.sent();
                        console.log('成功创建新访客:', rest);
                        token = rest[0];
                        ownId = rest[1];
                        this.relationId = rest[2];
                        this.pageTitle = rest[3];
                        username = rest[4];
                        _c.label = 7;
                    case 7:
                        console.log('indexpage:', this.relationId, this.pageTitle);
                        return [4 /*yield*/, this.backEnd.connect(token, ownId, this.relationId, username)];
                    case 8:
                        _c.sent();
                        this.ownId = ownId;
                        return [4 /*yield*/, this.msgService.getMsgList()];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10:
                        for (i = 100; i <= 219; i++) {
                            suffix = i < 200 ? '.gif' : '.png';
                            this.faceItems.push({
                                src: './assets/img/face/wechat/' + i + suffix,
                                name: '表情' + i
                            });
                        }
                        this.msgListSubscription =
                            __WEBPACK_IMPORTED_MODULE_15_rxjs_Observable__["Observable"].combineLatest(this.msgService.msgList$, this.pageIndexSubject)
                                .subscribe(function (combine) {
                                var msgList = combine[0];
                                var pageIndex = combine[1];
                                msgList = msgList.filter(function (msg) {
                                    return msg.relationId === _this.relationId;
                                });
                                msgList = msgList.filter(function (msg, i) {
                                    return i > (msgList.length - 1) - pageIndex * 10;
                                });
                                _this.msgList = msgList;
                                // let scrollHeight = this.contentComponent.scrollHeight;
                                // this._ref.detectChanges();
                                // if(first){
                                //     this.scrollToBottom();
                                //     first = false;
                                // }
                                _this.updateDiff();
                                // setTimeout(()=> {
                                //     this.contentComponent.resize();
                                //     this.contentComponent.scrollTo(null, this.contentComponent.scrollHeight- scrollHeight );
                                //     this.isLoading = false;
                                // }, 3000);
                            });
                        this.newMsgSubscription = this.msgService.newMsg$
                            .filter(function (msg) { return msg.relationId === _this.relationId; })
                            .subscribe(function (msg) {
                            if (msg.length === 0)
                                return;
                            _this.scrollToBottom();
                        });
                        this.contentComponent.ionScrollStart.subscribe(function (e) {
                            _this.hideFace();
                        }, function (err) {
                            console.log(err);
                        });
                        this.contentComponent.ionScrollEnd.subscribe(function (e) {
                            var scrollTop = _this.contentComponent.scrollTop;
                            if (scrollTop < 10 && !_this.isLoading) {
                                _this.isLoading = true;
                                _this.pageIndexSubject.next(_this.pageIndexSubject.getValue() + 1);
                            }
                        }, function (err) {
                            console.log(err);
                        });
                        this.timer = setInterval(function () {
                            _this.updateDiff();
                        }, 60000);
                        return [3 /*break*/, 12];
                    case 11:
                        ex_1 = _c.sent();
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ChatContentPage.prototype.getToken = function () {
        var p1 = this.storage.get('token');
        var p2 = this.storage.get('ownId');
        var p3 = this.storage.get('username');
        return Promise.all([p1, p2, p3]);
    };
    ChatContentPage.prototype.createNewVistor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var token_1, ownId_1, tenantId_1, companyName_1, username_1, result, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.userService.signVisitor(_this.apikey)
                                    .mergeMap(function (res) {
                                    //本地保存token
                                    token_1 = res.data.token;
                                    username_1 = res.data.username;
                                    tenantId_1 = res.data.tenantId;
                                    companyName_1 = res.data.tenantName;
                                    ownId_1 = res.data.user._id;
                                    return _this.saveToken(token_1, ownId_1, username_1);
                                })
                                    .subscribe(function () {
                                    //保存登录名，下次登录返显处来
                                    _this.storage.set('latestUsername', ownId_1);
                                    resolve([token_1, ownId_1, tenantId_1, companyName_1, username_1]);
                                }, function (err) { _this.myHttp.handleError(err, '登录失败'); reject(err); });
                            })];
                    case 1:
                        result = _a.sent();
                        console.log('11111', token_1, ownId_1, username_1, tenantId_1, companyName_1);
                        return [2 /*return*/, Promise.resolve(result)];
                    case 2:
                        ex_2 = _a.sent();
                        return [2 /*return*/, Promise.reject(ex_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatContentPage.prototype.checkVisitorToken = function (apikey, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var ex_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.userService.checkVisitorToken(apikey, token)
                                    .subscribe(function (res) {
                                    if (res.meta.code === 200 || res.meta.code === 435) {
                                        resolve(res.data);
                                    }
                                    else {
                                        reject(res.meta.message);
                                    }
                                }, function (err) { _this.myHttp.handleError(err, '登录验证失败'); reject(err); });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        ex_3 = _a.sent();
                        return [2 /*return*/, Promise.reject(ex_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatContentPage.prototype.saveToken = function (token, ownId, username) {
        var p1 = this.storage.set('token', token);
        var p2 = this.storage.set('ownId', ownId);
        var p3 = this.storage.set('username', username);
        var pAll = Promise.all([p1, p2, p3]);
        return __WEBPACK_IMPORTED_MODULE_15_rxjs_Observable__["Observable"].fromPromise(pAll);
    };
    // ngAfterViewInit() {
    //     //input自动得焦
    //     setTimeout(() => {
    //         this.renderer.setElementAttribute(this.input.input.nativeElement, 'autofocus','autofocus');
    //         this.renderer.invokeElementMethod(this.input.input.nativeElement, 'focus');
    //     }, 1000);
    // }
    ChatContentPage.prototype.ngOnDestroy = function () {
        this.msgListSubscription.unsubscribe();
        this.newMsgSubscription.unsubscribe();
        clearInterval(this.timer);
    };
    ChatContentPage.prototype.ionViewWillEnter = function () {
        //读取消息
        this.msgService.readChat(this.relationId);
    };
    ChatContentPage.prototype.ionViewWillLeave = function () {
        //取消已读
        this.msgService.stopReadChat();
    };
    ChatContentPage.prototype.updateDiff = function () {
        this.msgList.forEach(function (item) {
            item['timediff'] = Object(__WEBPACK_IMPORTED_MODULE_13__utils_utils__["d" /* getDiff */])(item.sendTime);
            return item;
        });
    };
    //语音
    ChatContentPage.prototype.recordToggle = function () {
        var _this = this;
        var supportCordova = this.platform.is('cordova');
        if (!supportCordova)
            return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');
        //语音
        if (!this.recording) {
            this.cordovaFile.createFile(this.cordovaFile.dataDirectory, this.recordFileSrc, true).then(function () {
                _this.recording = true;
                _this.recordFile = _this.media.create(_this.cordovaFile.dataDirectory.replace(/^file:\/\//, '') + _this.recordFileSrc);
                _this.recordFile.startRecord();
                _this.startTime();
                _this.setVolumeImgSrc(0);
                _this.media_timer = setInterval(function () {
                    // get media amplitude
                    _this.recordFile.getCurrentAmplitude()
                        .then(function (amp) {
                        console.log(amp * 100);
                        _this.setVolumeImgSrc(amp * 100);
                    })
                        .catch(function (err) {
                        console.log("Error getting amp=" + err);
                    });
                }, 200);
            });
        }
        else {
            clearInterval(this.media_timer);
            this.recording = false;
            this.recordFile.stopRecord();
            this.stopTime();
            this.msgService.sendAudioMsg(this.relationId, this.cordovaFile.dataDirectory.replace(/^file:\/\//, '') + this.recordFileSrc, this.recordDuration);
            //释放内存
            this.recordFile.release();
            this.cordovaFile.removeFile(this.cordovaFile.dataDirectory, this.recordFileSrc);
            this.recordFile = null;
        }
    };
    //取消录音
    ChatContentPage.prototype.cancelRecord = function () {
        if (this.recordFile && this.recording) {
            this.recording = false;
            this.recordFile.stopRecord();
            this.stopTime();
            this.recordFile.release();
        }
    };
    ChatContentPage.prototype.playRecord = function (audioSrc) {
        this.audio.nativeElement.src = __WEBPACK_IMPORTED_MODULE_10__config_config__["c" /* UPLOAD_HOST */] + audioSrc;
    };
    ChatContentPage.prototype.setVolumeImgSrc = function (persents) {
        persents = persents * 4; //优化点
        persents = Math.max(0, Math.min(persents, 100));
        var i = Math.ceil(persents * 0.6 / 60 * 6);
        this.volumeImgSrc = "assets/img/volume" + i + ".png";
    };
    //录音计时
    ChatContentPage.prototype.startTime = function () {
        var _this = this;
        this.recordDuration = 0;
        this.recordDuration_timer = setInterval(function () {
            _this.recordDuration++;
        }, 1000);
    };
    //录音停止计时
    ChatContentPage.prototype.stopTime = function () {
        clearInterval(this.recordDuration_timer);
    };
    //切换语音或文本
    ChatContentPage.prototype.switchInput = function () {
        this.isAudio = !this.isAudio;
        this.cancelRecord();
        this.hideFace();
    };
    ChatContentPage.prototype.scrollToBottom = function () {
        this.contentComponent.scrollToBottom();
    };
    ChatContentPage.prototype.onInputFocus = function () {
        // this.scrollToBottom();
        var _this = this;
        //解决手机键盘弹出后遮挡住输入框
        if (this.platform.is('mobileweb')) {
            setTimeout(function () {
                _this.input.input.nativeElement.scrollIntoView(true);
                _this.input.input.nativeElement.scrollIntoViewIfNeeded();
            }, 200);
        }
    };
    ChatContentPage.prototype.sendMsg = function () {
        var _this = this;
        if (this.form.invalid)
            return;
        var content = this.form.value.content;
        if (/^\s+$/g.test(content))
            return this.systemService.showToast('不能发送空白消息');
        this.msgService.sendMsg(this.relationId, this.encodeMsgContent(content));
        this.form.controls['content'].setValue('');
        // this.scrollToBottom();
        //得焦
        setTimeout(function () {
            _this.renderer.invokeElementMethod(_this.input.input.nativeElement, 'focus');
        }, 0);
    };
    ChatContentPage.prototype.gotoReorderPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__reorder_reorder__["a" /* ReorderPage */]);
    };
    ChatContentPage.prototype.gotoUserDetailPage = function (userId) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__user_detail_user_detail__["a" /* UserDetailPage */], { userId: userId });
    };
    //上传图片
    ChatContentPage.prototype.presentActionSheet = function () {
        var _this = this;
        if (this.platform.is('cordova')) {
            var actionSheet = this.actionSheetCtrl.create({
                buttons: [
                    {
                        text: '拍照',
                        handler: function () {
                            _this.setByPhotograph();
                        }
                    }, {
                        text: '从手机相册选择',
                        handler: function () {
                            _this.setByAlbum();
                        }
                    }, {
                        text: '取消',
                        role: 'cancel',
                        handler: function () {
                        }
                    }
                ]
            });
            actionSheet.present();
        }
        else {
            this.setByAlbum_html5();
        }
    };
    //通过拍照设置头像
    ChatContentPage.prototype.setByPhotograph = function () {
    };
    //通过手机相册设置头像
    ChatContentPage.prototype.setByAlbum = function () {
    };
    ChatContentPage.prototype.setByAlbum_html5 = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_14__utils_file_utils__["a" /* fileUtils */].openAlbum()
            .then(function (file) {
            _this.msgService.sendImgMsg(_this.relationId, file);
        });
    };
    ChatContentPage.prototype.showFace = function () {
        this.isShowFace = true;
        this.contentComponent.resize();
    };
    ChatContentPage.prototype.hideFace = function () {
        this.isShowFace = false;
        this.contentComponent.resize();
    };
    ChatContentPage.prototype.toggleFace = function () {
        this.isShowFace = !this.isShowFace;
        this.contentComponent.resize();
    };
    ChatContentPage.prototype.insertFace = function (src) {
        this.input.insertImg(src);
    };
    ChatContentPage.prototype.encodeMsgContent = function (content) {
        var _this = this;
        if (content === void 0) { content = ''; }
        content = content.replace(/<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*["']?[\s\t\r\n]*([^\s\t\r\n"'<>]*)[^<>]*?\/?[\s\t\r\n]*>/gi, function (match, src) {
            var faceItem = _this.faceItems.filter(function (item) { return item.src == src; })[0];
            if (faceItem) {
                return '[' + faceItem.name + ']';
            }
            else {
                return match;
            }
        });
        content = content.replace(/&nbsp;?/gi, function (match) {
            return ' ';
        });
        return content;
    };
    ChatContentPage.prototype.decodeMsgContent = function (content) {
        var _this = this;
        if (content === void 0) { content = ''; }
        content = content.replace(/\s/gi, function (match) {
            return '&nbsp;';
        });
        content = content.replace(/\[([^\]]*)\]/gi, function (match, name) {
            var faceItem = _this.faceItems.filter(function (item) { return item.name == name; })[0];
            if (faceItem) {
                return '<img src="' + faceItem.src + '" />';
            }
            else {
                return match;
            }
        });
        return content;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* Content */]),
        __metadata("design:type", Object)
    ], ChatContentPage.prototype, "contentComponent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('header'),
        __metadata("design:type", Object)
    ], ChatContentPage.prototype, "header", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('input'),
        __metadata("design:type", Object)
    ], ChatContentPage.prototype, "input", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('audio'),
        __metadata("design:type", Object)
    ], ChatContentPage.prototype, "audio", void 0);
    ChatContentPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-chat-content-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\chat-content\chat-content.html"*/'<ion-header #header>\n\n  <ion-navbar>\n    <ion-title>{{pageTitle}}</ion-title>\n    <!--<ion-buttons end>\n      <button ion-button icon-only (click)="gotoReorderPage()">\n          <ion-icon name="more"></ion-icon>\n      </button>\n    </ion-buttons>-->\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding-vertical>\n\n\n  <div *ngFor="let msg of msgList">\n    <!--发送时间-->\n    <div class="send-time-wrap"><span class="send-time">{{msg.timediff | timediff}}</span></div>\n    <!--消息-->\n    <div class="msg-wrap {{ msg.fromUserId === ownId?\'me-msg\':\'other-msg\' }}">\n      <!--头像-->\n\n      <ion-thumbnail>\n        <cy-img [src]="msg._fromUser && msg._fromUser.avatarSrc | avatarSrc" (click)="gotoUserDetailPage(msg._fromUser._id)"  style="width:56px;height:56px;"></cy-img>\n        <!-- <cy-img [src]="msg._fromUser && msg._fromUser.avatarSrc | avatarSrc"  style="width:56px;"></cy-img> -->\n      </ion-thumbnail>\n\n      <!--文本消息-->\n      <p class="msg-content" *ngIf="msg.type===0" [innerHTML]="decodeMsgContent(msg.content)"></p>\n\n      <!--图片消息-->\n      <p *ngIf="msg.type===1" style="padding: 0 10px;">\n        <cy-img [src]="msg.content | imgSrc:200" [zoom]="true" style="max-width:100px;max-height:100px;"></cy-img>\n      </p>\n\n      <!--语音消息-->\n      <p class="msg-content" *ngIf="msg.type===3" (click)="playRecord(msg.content)">\n        <ion-icon class="audio-icon" name="wifi"></ion-icon>\n      </p>\n\n      <span class="audio-duartion" *ngIf="msg.type===3">{{msg.audioDuration}}"</span>\n\n      <ion-spinner *ngIf="msg.fromUserId === ownId && msg.pending"></ion-spinner>\n\n    </div>\n  </div>\n  <div class="record-volume-wrap" *ngIf="recording">\n    <div class="title">开始说话</div>\n    <img class="volume-img" [src]="volumeImgSrc" />\n    <div class="">{{recordDuration}}s</div>\n  </div>\n  <audio #audio autoplay="autoplay"></audio>\n</ion-content>\n\n<ion-footer>\n  <ion-toolbar>\n    <div class="foot-wrapper">\n      <!--切换按钮-->\n      <a ion-button icon-only outline small (click)="switchInput()">\n        <ion-icon *ngIf="!isAudio" name="wifi" class="switch-toggle"></ion-icon>\n        <ion-icon *ngIf="isAudio" name="barcode"></ion-icon>\n      </a>\n      <!--文本-->\n      <div *ngIf="!isAudio" class="msg-input-wrapper">\n        <form [formGroup]="form" (ngSubmit)="sendMsg()">\n          <!-- <input #input type="text" formControlName="content" (focus)="onInputFocus()" /> -->\n          <cy-content-input #input formControlName="content" (focus)="onInputFocus()"></cy-content-input>\n          <a ion-button icon-only clear small (click)="presentActionSheet()">        \n            <ion-icon name="image-outline"></ion-icon>\n          </a>\n          <a ion-button icon-only clear small (click)="toggleFace()">        \n              <ion-icon [name]="isShowFace?\'happy\':\'happy-outline\'"></ion-icon>\n            </a>\n          <button type="submit" ion-button outline [disabled]="form.invalid">发送</button>\n        </form>\n      </div>\n      <!--语音-->\n      <div *ngIf="isAudio" class="audio-msg-wrapper">\n        <a ion-button block outline small (click)="recordToggle()">{{recording? \'停止录音\':\'开始录音\'}}</a>\n      </div>\n\n      <!--<button ion-button icon-only outline small><ion-icon name="add-outline"></ion-icon></button>-->\n    </div>\n  </ion-toolbar>\n    <!-- 表情栏 -->\n    <div class="face-wrap" [hidden]="!isShowFace">\n      <div class="face-item" *ngFor="let item of faceItems;" (click)="insertFace(item.src)">\n        <img src="{{item.src}}" />\n      </div>\n    </div>\n</ion-footer>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\chat-content\chat-content.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["P" /* NgZone */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* ChangeDetectorRef */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_media__["a" /* Media */],
            __WEBPACK_IMPORTED_MODULE_17__ionic_native_keyboard__["a" /* Keyboard */],
            __WEBPACK_IMPORTED_MODULE_18__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_5__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_4__services_msg__["a" /* MsgService */],
            __WEBPACK_IMPORTED_MODULE_6__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_19__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_7__providers_backend__["a" /* BackEnd */]])
    ], ChatContentPage);
    return ChatContentPage;
}());

//# sourceMappingURL=chat-content.js.map

/***/ }),

/***/ 627:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return patterns; });
var patterns = {
    username: /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/,
    password: /^[a-zA-Z0-9_]{6,18}$/ //6-18个字符，字母、数字或_
};
//# sourceMappingURL=patterns.js.map

/***/ }),

/***/ 628:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DailyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DailyPage = /** @class */ (function () {
    function DailyPage() {
        this.items = [];
        for (var i = 0; i < 20; i++) {
            this.items.push(this.items.length);
        }
    }
    DailyPage.prototype.doRefresh = function (refresher) {
        setTimeout(function () {
            refresher.complete();
        }, 2000);
    };
    DailyPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-daily-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\daily\daily.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Daily</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content></ion-refresher-content>\n  </ion-refresher>\n\n   \n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\daily\daily.html"*/,
        }),
        __metadata("design:paramtypes", [])
    ], DailyPage);
    return DailyPage;
}());

//# sourceMappingURL=daily.js.map

/***/ }),

/***/ 629:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShopPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ShopPage = /** @class */ (function () {
    function ShopPage() {
    }
    ShopPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-shop-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\shop\shop.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Shop</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-slides autoplay>\n		<ion-slide><div><img src="assets/img/fengjing1.jpg"/></div></ion-slide>\n		<ion-slide><div><img src="assets/img/fengjing2.jpg"/></div></ion-slide>\n		<ion-slide><div><img src="assets/img/fengjing3.jpg"/></div></ion-slide>\n	</ion-slides>\n\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\shop\shop.html"*/,
        }),
        __metadata("design:paramtypes", [])
    ], ShopPage);
    return ShopPage;
}());

//# sourceMappingURL=shop.js.map

/***/ }),

/***/ 630:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = myHttpFactory;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_my_http__ = __webpack_require__(11);

function myHttpFactory(backend, defaultOptions, loadingCtrl, systemService, fileTransfer) {
    return new __WEBPACK_IMPORTED_MODULE_0__providers_my_http__["a" /* MyHttp */](backend, defaultOptions, loadingCtrl, systemService, fileTransfer);
}
//# sourceMappingURL=factorys.js.map

/***/ }),

/***/ 631:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_img__ = __webpack_require__(632);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__content_input_content_input__ = __webpack_require__(635);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__qrcode_qrcode__ = __webpack_require__(636);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_1__img_img__["a" /* ImgComponent */],
                __WEBPACK_IMPORTED_MODULE_2__content_input_content_input__["a" /* ContentInputComponent */],
                __WEBPACK_IMPORTED_MODULE_3__qrcode_qrcode__["a" /* QrcodeComponent */]
            ],
            imports: [],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__img_img__["a" /* ImgComponent */],
                __WEBPACK_IMPORTED_MODULE_2__content_input_content_input__["a" /* ContentInputComponent */],
                __WEBPACK_IMPORTED_MODULE_3__qrcode_qrcode__["a" /* QrcodeComponent */]
            ]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());

//# sourceMappingURL=components.module.js.map

/***/ }),

/***/ 632:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImgComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__ = __webpack_require__(633);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ImgComponent = /** @class */ (function () {
    function ImgComponent(elemRef, renderer) {
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.naturalWidth = 0;
        this.naturalHeight = 0;
        this.naturalRatio = 0;
        this.zoom = false;
    }
    Object.defineProperty(ImgComponent.prototype, "width", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getWidth(this.elemRef.nativeElement);
        },
        set: function (value) {
            this.renderer.setElementStyle(this.elemRef.nativeElement, 'width', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImgComponent.prototype, "height", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getHeight(this.elemRef.nativeElement);
        },
        set: function (value) {
            this.renderer.setElementStyle(this.elemRef.nativeElement, 'height', value);
        },
        enumerable: true,
        configurable: true
    });
    ImgComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.renderer.setElementStyle(this.img.nativeElement, 'display', 'none');
        this.img.nativeElement.onload = function () {
            _this.onLoaded();
        };
        this.img.nativeElement.onerror = function () {
            console.log('img onerror');
        };
    };
    ImgComponent.prototype.onLoaded = function () {
        var position = __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getStyle(this.elemRef.nativeElement, 'position');
        //图片初始大小
        this.naturalWidth = this.img.nativeElement.naturalWidth;
        this.naturalHeight = this.img.nativeElement.naturalHeight;
        this.naturalRatio = this.naturalWidth / this.naturalHeight;
        if (position === 'static')
            this.renderer.setElementStyle(this.elemRef.nativeElement, 'position', 'relative');
        this.resize();
        this.renderer.setElementStyle(this.img.nativeElement, 'display', '');
    };
    ImgComponent.prototype.resize = function () {
        var elem = this.elemRef.nativeElement;
        var width = __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getWidth(elem);
        var height = __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getHeight(elem);
        if (!width && !height) {
            this.width = this.naturalWidth + 'px';
            this.height = this.naturalHeight + 'px';
        }
        else if (width && !height) {
            this.width = width;
            this.height = (this.width / this.naturalRatio) + 'px';
        }
        else if (!width && height) {
            this.height = height;
            this.width = (this.height * this.naturalRatio) + 'px';
        }
        else {
            this.width = width;
            this.height = height;
        }
        var ratio = this.width / this.height;
        //0-全屏填充, 1-适应填充
        var fillMode = 0;
        if (ratio > this.naturalRatio) {
            if (fillMode == 0) {
                this.renderer.setElementClass(elem, 'img-portrait', true);
                this.renderer.setElementClass(elem, 'img-landscape', false);
            }
            else if (fillMode == 1) {
                this.renderer.setElementClass(elem, 'img-landscape', true);
                this.renderer.setElementClass(elem, 'img-portrait', false);
            }
        }
        else {
            if (fillMode == 0) {
                this.renderer.setElementClass(elem, 'img-landscape', true);
                this.renderer.setElementClass(elem, 'img-portrait', false);
            }
            else if (fillMode == 1) {
                this.renderer.setElementClass(elem, 'img-portrait', true);
                this.renderer.setElementClass(elem, 'img-landscape', false);
            }
        }
    };
    ImgComponent.prototype.onResize = function () {
        this.resize();
    };
    ImgComponent.prototype.onClick = function () {
        var _this = this;
        if (!this.zoom)
            return;
        var overlay = document.createElement('div');
        overlay.className = 'cy-img-overlay';
        overlay.addEventListener('click', function () {
            if (!_this.zoom)
                return;
            zoomOut();
        });
        var elem = this.elemRef.nativeElement;
        var offset = __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getOffset(elem);
        var clone = __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].cloneDom(elem).css({
            minWidth: 'initial',
            maxWidth: 'initial',
            minHeight: 'initial',
            maxHeight: 'initial'
        });
        document.body.appendChild(overlay);
        overlay.appendChild(clone[0]);
        var overlayWidth = __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getWidth(overlay);
        var overlayHeight = __WEBPACK_IMPORTED_MODULE_1__utils_dom_utils__["a" /* DomUtils */].getHeight(overlay);
        var beginWidth = this.width;
        var beginHeight = this.height;
        var beginTop = offset.top;
        var beginLeft = offset.left;
        var endWidth = overlayWidth;
        var endHeight = endWidth / this.naturalRatio;
        var endTop = (overlayHeight - endHeight) / 2;
        var endLeft = 0;
        if (endTop < 0)
            endTop = 0;
        zoomIn();
        function zoomIn() {
            clone
                .css({
                position: 'absolute',
                top: beginTop,
                left: beginLeft,
                width: beginWidth,
                height: beginHeight
            })
                .animate({
                top: endTop,
                left: endLeft,
                width: endWidth,
                height: endHeight
            }, 200, function () {
                //显示原图
                var src = clone.children('img').attr('src');
                clone.children('img').attr('src', src.substring(0, src.lastIndexOf('@')));
            });
        }
        function zoomOut() {
            clone.animate({
                top: beginTop,
                left: beginLeft,
                width: beginWidth,
                height: beginHeight
            }, 200, function () {
                document.body.removeChild(overlay);
            });
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])('src'),
        __metadata("design:type", String)
    ], ImgComponent.prototype, "src", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])('width'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ImgComponent.prototype, "width", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])('height'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ImgComponent.prototype, "height", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])('zoom'),
        __metadata("design:type", Boolean)
    ], ImgComponent.prototype, "zoom", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('img'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
    ], ImgComponent.prototype, "img", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostListener */])('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ImgComponent.prototype, "onResize", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostListener */])('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ImgComponent.prototype, "onClick", null);
    ImgComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-img',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\components\img\img.html"*/'<img #img [src]="src">\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\components\img\img.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer */]])
    ], ImgComponent);
    return ImgComponent;
}());

//# sourceMappingURL=img.js.map

/***/ }),

/***/ 633:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DomUtils; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(634);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);

var DomUtils = /** @class */ (function () {
    function DomUtils() {
    }
    DomUtils.getStyle = function (dom, name) {
        return __WEBPACK_IMPORTED_MODULE_0_jquery___default()(dom).css(name);
    };
    DomUtils.getAttr = function (dom, name) {
        return __WEBPACK_IMPORTED_MODULE_0_jquery___default()(dom).attr(name);
    };
    DomUtils.getWidth = function (dom) {
        return __WEBPACK_IMPORTED_MODULE_0_jquery___default()(dom).width();
    };
    DomUtils.getHeight = function (dom) {
        return __WEBPACK_IMPORTED_MODULE_0_jquery___default()(dom).height();
    };
    DomUtils.getOffset = function (dom) {
        return __WEBPACK_IMPORTED_MODULE_0_jquery___default()(dom).offset();
    };
    DomUtils.getPosition = function (dom) {
        return __WEBPACK_IMPORTED_MODULE_0_jquery___default()(dom).position();
    };
    DomUtils.cloneDom = function (dom) {
        return __WEBPACK_IMPORTED_MODULE_0_jquery___default()(dom).clone();
    };
    return DomUtils;
}());

//# sourceMappingURL=dom-utils.js.map

/***/ }),

/***/ 635:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentInputComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContentInputComponent = /** @class */ (function () {
    function ContentInputComponent(renderer) {
        this.renderer = renderer;
        this._onChange = function (value) { };
        this.focus = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    ContentInputComponent_1 = ContentInputComponent;
    ContentInputComponent.prototype.writeValue = function (value) {
        this.renderer.setElementProperty(this.input.nativeElement, 'innerHTML', value);
    };
    ContentInputComponent.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    ContentInputComponent.prototype.registerOnTouched = function (fn) {
    };
    ContentInputComponent.prototype.saveLastEditRange = function () {
        try {
            // 获取选定对象
            var selection = getSelection();
            // 设置最后光标对象
            this.lastEditRange = selection.getRangeAt(0);
        }
        catch (e) {
            console.log(e);
        }
    };
    ContentInputComponent.prototype.onKeypress = function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var event = new Event('submit');
            event.initEvent('submit', true, true);
            document.forms[0].dispatchEvent(event);
        }
    };
    ContentInputComponent.prototype.onInput = function (e) {
        this._onChange(e.target.innerHTML);
    };
    ContentInputComponent.prototype.insertImg = function (src) {
        // 获取编辑框对象
        var inputEl = this.input.nativeElement;
        //表情图片
        var img = new Image();
        img.src = src;
        var range = this.lastEditRange;
        // 判断是否有最后光标对象存在
        if (!range) {
            range = document.createRange();
            range.setStart(inputEl, 0);
        }
        // 判断选定对象范围是编辑框还是文本节点
        if (range.startContainer.nodeName != '#text') {
            var childNodes = inputEl.childNodes;
            var anchorOffset = range.startOffset;
            var extentOffset = range.endOffset;
            //移除选中部分
            for (var i = anchorOffset; i < extentOffset; i++) {
                inputEl.removeChild(childNodes[i]);
                i--;
                extentOffset--;
            }
            // 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入表情节点
            if (inputEl.childNodes.length > 0 && childNodes.length > anchorOffset) {
                for (var i = 0; i < childNodes.length; i++) {
                    if (i == anchorOffset) {
                        inputEl.insertBefore(img, childNodes[i]);
                        break;
                    }
                }
            }
            else {
                // 否则直接插入一个表情元素
                inputEl.appendChild(img);
            }
            // 创建新的光标对象
            range = document.createRange();
            // 光标位置定位在表情节点的最大长度
            range.setStart(inputEl, anchorOffset + 1);
        }
        else {
            // 获取光标对象的范围界定对象，一般就是textNode对象
            var textNode = range.startContainer;
            // 获取光标位置
            var rangeStartOffset = range.startOffset;
            //删除选择内容
            textNode.deleteData(range.startOffset, range.endOffset - range.startOffset);
            //分割文本节点
            var textNodeSplited = textNode.splitText(range.startOffset);
            //插入图片
            textNodeSplited.parentElement.insertBefore(img, textNodeSplited);
            // 光标移动到到原来的位置加上新内容的长度
            range.setStart(textNodeSplited, 0);
        }
        // 无论如何都要记录最后光标对象
        this.lastEditRange = range;
        this._onChange(inputEl.innerHTML);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('input'),
        __metadata("design:type", Object)
    ], ContentInputComponent.prototype, "input", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["S" /* Output */])('focus'),
        __metadata("design:type", Object)
    ], ContentInputComponent.prototype, "focus", void 0);
    ContentInputComponent = ContentInputComponent_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-content-input',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\components\content-input\content-input.html"*/'<div contenteditable="true" #input (click)="saveLastEditRange()" (keyup)="saveLastEditRange()" (keypress)="onKeypress($event);" (input)="onInput($event)" (focus)="focus.emit($event)"></div>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\components\content-input\content-input.html"*/,
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* NG_VALUE_ACCESSOR */], useExisting: Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_22" /* forwardRef */])(function () { return ContentInputComponent_1; }), multi: true }
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer */]])
    ], ContentInputComponent);
    return ContentInputComponent;
    var ContentInputComponent_1;
}());

//# sourceMappingURL=content-input.js.map

/***/ }),

/***/ 636:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QrcodeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var QRCode = __webpack_require__(637);
var QrcodeComponent = /** @class */ (function () {
    function QrcodeComponent(_elementRef) {
        this._elementRef = _elementRef;
    }
    QrcodeComponent.prototype.ngOnInit = function () {
        var qrcode = new QRCode(this._elementRef.nativeElement, {
            text: this.text,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])('text'),
        __metadata("design:type", String)
    ], QrcodeComponent.prototype, "text", void 0);
    QrcodeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-qrcode',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\components\qrcode\qrcode.html"*/'\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\components\qrcode\qrcode.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */]])
    ], QrcodeComponent);
    return QrcodeComponent;
}());

//# sourceMappingURL=qrcode.js.map

/***/ }),

/***/ 637:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @fileoverview
 * - Using the 'QRCode for Javascript library'
 * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
 * - this library has no dependencies.
 * 
 * @author davidshimjs
 * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
 * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
 */
var QRCode;

(function () {
  //---------------------------------------------------------------------
  // QRCode for JavaScript
  //
  // Copyright (c) 2009 Kazuhiko Arase
  //
  // URL: http://www.d-project.com/
  //
  // Licensed under the MIT license:
  //   http://www.opensource.org/licenses/mit-license.php
  //
  // The word "QR Code" is registered trademark of 
  // DENSO WAVE INCORPORATED
  //   http://www.denso-wave.com/qrcode/faqpatent-e.html
  //
  //---------------------------------------------------------------------
  function QR8bitByte(data) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = data;
    this.parsedData = [];

    // Added to support UTF-8 Characters
    for (var i = 0, l = this.data.length; i < l; i++) {
      var byteArray = [];
      var code = this.data.charCodeAt(i);

      if (code > 0x10000) {
        byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
        byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
        byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
        byteArray[3] = 0x80 | (code & 0x3F);
      } else if (code > 0x800) {
        byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
        byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
        byteArray[2] = 0x80 | (code & 0x3F);
      } else if (code > 0x80) {
        byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
        byteArray[1] = 0x80 | (code & 0x3F);
      } else {
        byteArray[0] = code;
      }

      this.parsedData.push(byteArray);
    }

    this.parsedData = Array.prototype.concat.apply([], this.parsedData);

    if (this.parsedData.length != this.data.length) {
      this.parsedData.unshift(191);
      this.parsedData.unshift(187);
      this.parsedData.unshift(239);
    }
  }

  QR8bitByte.prototype = {
    getLength: function (buffer) {
      return this.parsedData.length;
    },
    write: function (buffer) {
      for (var i = 0, l = this.parsedData.length; i < l; i++) {
        buffer.put(this.parsedData[i], 8);
      }
    }
  };

  function QRCodeModel(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }

  QRCodeModel.prototype = {
    addData: function (data) {
      var newData = new QR8bitByte(data);
      this.dataList.push(newData);
      this.dataCache = null;
    },
    isDark: function (row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(row + "," + col);
      }
      return this.modules[row][col];
    },
    getModuleCount: function () {
      return this.moduleCount;
    },
    make: function () {
      this.makeImpl(false, this.getBestMaskPattern());
    },
    makeImpl: function (test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (var row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (var col = 0; col < this.moduleCount; col++) {
          this.modules[row][col] = null;
        }
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      if (this.typeNumber >= 7) {
        this.setupTypeNumber(test);
      }
      if (this.dataCache == null) {
        this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
      }
      this.mapData(this.dataCache, maskPattern);
    },
    setupPositionProbePattern: function (row, col) {
      for (var r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (var c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    getBestMaskPattern: function () {
      var minLostPoint = 0;
      var pattern = 0;
      for (var i = 0; i < 8; i++) {
        this.makeImpl(true, i);
        var lostPoint = QRUtil.getLostPoint(this);
        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }
      return pattern;
    },
    createMovieClip: function (target_mc, instance_name, depth) {
      var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
      var cs = 1;
      this.make();
      for (var row = 0; row < this.modules.length; row++) {
        var y = row * cs;
        for (var col = 0; col < this.modules[row].length; col++) {
          var x = col * cs;
          var dark = this.modules[row][col];
          if (dark) {
            qr_mc.beginFill(0, 100);
            qr_mc.moveTo(x, y);
            qr_mc.lineTo(x + cs, y);
            qr_mc.lineTo(x + cs, y + cs);
            qr_mc.lineTo(x, y + cs);
            qr_mc.endFill();
          }
        }
      }
      return qr_mc;
    },
    setupTimingPattern: function () {
      for (var r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] != null) {
          continue;
        }
        this.modules[r][6] = (r % 2 == 0);
      }
      for (var c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] != null) {
          continue;
        }
        this.modules[6][c] = (c % 2 == 0);
      }
    },
    setupPositionAdjustPattern: function () {
      var pos = QRUtil.getPatternPosition(this.typeNumber);
      for (var i = 0; i < pos.length; i++) {
        for (var j = 0; j < pos.length; j++) {
          var row = pos[i];
          var col = pos[j];
          if (this.modules[row][col] != null) {
            continue;
          }
          for (var r = -2; r <= 2; r++) {
            for (var c = -2; c <= 2; c++) {
              if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    setupTypeNumber: function (test) {
      var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
      for (var i = 0; i < 18; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
      }
      for (var i = 0; i < 18; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    },
    setupTypeInfo: function (test, maskPattern) {
      var data = (this.errorCorrectLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);
      for (var i = 0; i < 15; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        if (i < 6) {
          this.modules[i][8] = mod;
        } else if (i < 8) {
          this.modules[i + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i][8] = mod;
        }
      }
      for (var i = 0; i < 15; i++) {
        var mod = (!test && ((bits >> i) & 1) == 1);
        if (i < 8) {
          this.modules[8][this.moduleCount - i - 1] = mod;
        } else if (i < 9) {
          this.modules[8][15 - i - 1 + 1] = mod;
        } else {
          this.modules[8][15 - i - 1] = mod;
        }
      }
      this.modules[this.moduleCount - 8][8] = (!test);
    },
    mapData: function (data, maskPattern) {
      var inc = -1;
      var row = this.moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      for (var col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col--;
        while (true) {
          for (var c = 0; c < 2; c++) {
            if (this.modules[row][col - c] == null) {
              var dark = false;
              if (byteIndex < data.length) {
                dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
              }
              var mask = QRUtil.getMask(maskPattern, row, col - c);
              if (mask) {
                dark = !dark;
              }
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex == -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
  };
  QRCodeModel.PAD0 = 0xEC;
  QRCodeModel.PAD1 = 0x11;
  QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
    var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    var buffer = new QRBitBuffer();
    for (var i = 0; i < dataList.length; i++) {
      var data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    }
    var totalDataCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error("code length overflow. (" +
        buffer.getLengthInBits() +
        ">" +
        totalDataCount * 8 +
        ")");
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QRCodeModel.PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QRCodeModel.PAD1, 8);
    }
    return QRCodeModel.createBytes(buffer, rsBlocks);
  };
  QRCodeModel.createBytes = function (buffer, rsBlocks) {
    var offset = 0;
    var maxDcCount = 0;
    var maxEcCount = 0;
    var dcdata = new Array(rsBlocks.length);
    var ecdata = new Array(rsBlocks.length);
    for (var r = 0; r < rsBlocks.length; r++) {
      var dcCount = rsBlocks[r].dataCount;
      var ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (var i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += dcCount;
      var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      var modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (var i = 0; i < ecdata[r].length; i++) {
        var modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
      }
    }
    var totalCodeCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    var data = new Array(totalCodeCount);
    var index = 0;
    for (var i = 0; i < maxDcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }
    for (var i = 0; i < maxEcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }
    return data;
  };
  var QRMode = {
    MODE_NUMBER: 1 << 0,
    MODE_ALPHA_NUM: 1 << 1,
    MODE_8BIT_BYTE: 1 << 2,
    MODE_KANJI: 1 << 3
  };
  var QRErrorCorrectLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
  };
  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
  };
  var QRUtil = {
    PATTERN_POSITION_TABLE: [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ],
    G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
    getBCHTypeInfo: function (data) {
      var d = data << 10;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
        d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
      }
      return ((data << 10) | d) ^ QRUtil.G15_MASK;
    },
    getBCHTypeNumber: function (data) {
      var d = data << 12;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
        d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18)));
      }
      return (data << 12) | d;
    },
    getBCHDigit: function (data) {
      var digit = 0;
      while (data != 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    },
    getPatternPosition: function (typeNumber) {
      return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },
    getMask: function (maskPattern, i, j) {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return (i + j) % 2 == 0;
        case QRMaskPattern.PATTERN001:
          return i % 2 == 0;
        case QRMaskPattern.PATTERN010:
          return j % 3 == 0;
        case QRMaskPattern.PATTERN011:
          return (i + j) % 3 == 0;
        case QRMaskPattern.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
        case QRMaskPattern.PATTERN101:
          return (i * j) % 2 + (i * j) % 3 == 0;
        case QRMaskPattern.PATTERN110:
          return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
        case QRMaskPattern.PATTERN111:
          return ((i * j) % 3 + (i + j) % 2) % 2 == 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    },
    getErrorCorrectPolynomial: function (errorCorrectLength) {
      var a = new QRPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    },
    getLengthInBits: function (mode, type) {
      if (1 <= type && type < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw new Error("mode:" + mode);
        }
      } else if (type < 27) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 12;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 10;
          default:
            throw new Error("mode:" + mode);
        }
      } else if (type < 41) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 13;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw new Error("mode:" + mode);
        }
      } else {
        throw new Error("type:" + type);
      }
    },
    getLostPoint: function (qrCode) {
      var moduleCount = qrCode.getModuleCount();
      var lostPoint = 0;
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount; col++) {
          var sameCount = 0;
          var dark = qrCode.isDark(row, col);
          for (var r = -1; r <= 1; r++) {
            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }
            for (var c = -1; c <= 1; c++) {
              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }
              if (r == 0 && c == 0) {
                continue;
              }
              if (dark == qrCode.isDark(row + r, col + c)) {
                sameCount++;
              }
            }
          }
          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      }
      for (var row = 0; row < moduleCount - 1; row++) {
        for (var col = 0; col < moduleCount - 1; col++) {
          var count = 0;
          if (qrCode.isDark(row, col)) count++;
          if (qrCode.isDark(row + 1, col)) count++;
          if (qrCode.isDark(row, col + 1)) count++;
          if (qrCode.isDark(row + 1, col + 1)) count++;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount - 6; col++) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
            lostPoint += 40;
          }
        }
      }
      for (var col = 0; col < moduleCount; col++) {
        for (var row = 0; row < moduleCount - 6; row++) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
            lostPoint += 40;
          }
        }
      }
      var darkCount = 0;
      for (var col = 0; col < moduleCount; col++) {
        for (var row = 0; row < moduleCount; row++) {
          if (qrCode.isDark(row, col)) {
            darkCount++;
          }
        }
      }
      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;
      return lostPoint;
    }
  };
  var QRMath = {
    glog: function (n) {
      if (n < 1) {
        throw new Error("glog(" + n + ")");
      }
      return QRMath.LOG_TABLE[n];
    },
    gexp: function (n) {
      while (n < 0) {
        n += 255;
      }
      while (n >= 256) {
        n -= 255;
      }
      return QRMath.EXP_TABLE[n];
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256)
  };
  for (var i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i;
  }
  for (var i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
  }
  for (var i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
  }

  function QRPolynomial(num, shift) {
    if (num.length == undefined) {
      throw new Error(num.length + "/" + shift);
    }
    var offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset++;
    }
    this.num = new Array(num.length - offset + shift);
    for (var i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
  }
  QRPolynomial.prototype = {
    get: function (index) {
      return this.num[index];
    },
    getLength: function () {
      return this.num.length;
    },
    multiply: function (e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      for (var i = 0; i < this.getLength(); i++) {
        for (var j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    },
    mod: function (e) {
      if (this.getLength() - e.getLength() < 0) {
        return this;
      }
      var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      var num = new Array(this.getLength());
      for (var i = 0; i < this.getLength(); i++) {
        num[i] = this.get(i);
      }
      for (var i = 0; i < e.getLength(); i++) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
      }
      return new QRPolynomial(num, 0).mod(e);
    }
  };

  function QRRSBlock(totalCount, dataCount) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }
  QRRSBlock.RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12],
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16]
  ];
  QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
    var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    if (rsBlock == undefined) {
      throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
    }
    var length = rsBlock.length / 3;
    var list = [];
    for (var i = 0; i < length; i++) {
      var count = rsBlock[i * 3 + 0];
      var totalCount = rsBlock[i * 3 + 1];
      var dataCount = rsBlock[i * 3 + 2];
      for (var j = 0; j < count; j++) {
        list.push(new QRRSBlock(totalCount, dataCount));
      }
    }
    return list;
  };
  QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return undefined;
    }
  };

  function QRBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }
  QRBitBuffer.prototype = {
    get: function (index) {
      var bufIndex = Math.floor(index / 8);
      return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
    },
    put: function (num, length) {
      for (var i = 0; i < length; i++) {
        this.putBit(((num >>> (length - i - 1)) & 1) == 1);
      }
    },
    getLengthInBits: function () {
      return this.length;
    },
    putBit: function (bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
      }
      this.length++;
    }
  };
  var QRCodeLimitLength = [
    [17, 14, 11, 7],
    [32, 26, 20, 14],
    [53, 42, 32, 24],
    [78, 62, 46, 34],
    [106, 84, 60, 44],
    [134, 106, 74, 58],
    [154, 122, 86, 64],
    [192, 152, 108, 84],
    [230, 180, 130, 98],
    [271, 213, 151, 119],
    [321, 251, 177, 137],
    [367, 287, 203, 155],
    [425, 331, 241, 177],
    [458, 362, 258, 194],
    [520, 412, 292, 220],
    [586, 450, 322, 250],
    [644, 504, 364, 280],
    [718, 560, 394, 310],
    [792, 624, 442, 338],
    [858, 666, 482, 382],
    [929, 711, 509, 403],
    [1003, 779, 565, 439],
    [1091, 857, 611, 461],
    [1171, 911, 661, 511],
    [1273, 997, 715, 535],
    [1367, 1059, 751, 593],
    [1465, 1125, 805, 625],
    [1528, 1190, 868, 658],
    [1628, 1264, 908, 698],
    [1732, 1370, 982, 742],
    [1840, 1452, 1030, 790],
    [1952, 1538, 1112, 842],
    [2068, 1628, 1168, 898],
    [2188, 1722, 1228, 958],
    [2303, 1809, 1283, 983],
    [2431, 1911, 1351, 1051],
    [2563, 1989, 1423, 1093],
    [2699, 2099, 1499, 1139],
    [2809, 2213, 1579, 1219],
    [2953, 2331, 1663, 1273]
  ];

  function _isSupportCanvas() {
    return typeof CanvasRenderingContext2D != "undefined";
  }

  // android 2.x doesn't support Data-URI spec
  function _getAndroid() {
    var android = false;
    var sAgent = navigator.userAgent;

    if (/android/i.test(sAgent)) { // android
      android = true;
      var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

      if (aMat && aMat[1]) {
        android = parseFloat(aMat[1]);
      }
    }

    return android;
  }

  var svgDrawer = (function () {

    var Drawing = function (el, htOption) {
      this._el = el;
      this._htOption = htOption;
    };

    Drawing.prototype.draw = function (oQRCode) {
      var _htOption = this._htOption;
      var _el = this._el;
      var nCount = oQRCode.getModuleCount();
      var nWidth = Math.floor(_htOption.width / nCount);
      var nHeight = Math.floor(_htOption.height / nCount);

      this.clear();

      function makeSVG(tag, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
          if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
        return el;
      }

      var svg = makeSVG("svg", {
        'viewBox': '0 0 ' + String(nCount) + " " + String(nCount),
        'width': '100%',
        'height': '100%',
        'fill': _htOption.colorLight
      });
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
      _el.appendChild(svg);

      svg.appendChild(makeSVG("rect", {
        "fill": _htOption.colorLight,
        "width": "100%",
        "height": "100%"
      }));
      svg.appendChild(makeSVG("rect", {
        "fill": _htOption.colorDark,
        "width": "1",
        "height": "1",
        "id": "template"
      }));

      for (var row = 0; row < nCount; row++) {
        for (var col = 0; col < nCount; col++) {
          if (oQRCode.isDark(row, col)) {
            var child = makeSVG("use", {
              "x": String(col),
              "y": String(row)
            });
            child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template")
            svg.appendChild(child);
          }
        }
      }
    };
    Drawing.prototype.clear = function () {
      while (this._el.hasChildNodes())
        this._el.removeChild(this._el.lastChild);
    };
    return Drawing;
  })();

  var useSVG = document.documentElement.tagName.toLowerCase() === "svg";

  // Drawing in DOM by using Table tag
  var Drawing = useSVG ? svgDrawer : !_isSupportCanvas() ? (function () {
    var Drawing = function (el, htOption) {
      this._el = el;
      this._htOption = htOption;
    };

    /**
     * Draw the QRCode
     * 
     * @param {QRCode} oQRCode
     */
    Drawing.prototype.draw = function (oQRCode) {
      var _htOption = this._htOption;
      var _el = this._el;
      var nCount = oQRCode.getModuleCount();
      var nWidth = Math.floor(_htOption.width / nCount);
      var nHeight = Math.floor(_htOption.height / nCount);
      var aHTML = ['<table style="border:0;border-collapse:collapse;">'];

      for (var row = 0; row < nCount; row++) {
        aHTML.push('<tr>');

        for (var col = 0; col < nCount; col++) {
          aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
        }

        aHTML.push('</tr>');
      }

      aHTML.push('</table>');
      _el.innerHTML = aHTML.join('');

      // Fix the margin values as real size.
      var elTable = _el.childNodes[0];
      var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
      var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;

      if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
        elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
      }
    };

    /**
     * Clear the QRCode
     */
    Drawing.prototype.clear = function () {
      this._el.innerHTML = '';
    };

    return Drawing;
  })() : (function () { // Drawing in Canvas
    function _onMakeImage() {
      this._elImage.src = this._elCanvas.toDataURL("image/png");
      this._elImage.style.display = "block";
      this._elCanvas.style.display = "none";
    }

    // Android 2.1 bug workaround
    // http://code.google.com/p/android/issues/detail?id=5141
    if (this._android && this._android <= 2.1) {
      var factor = 1 / window.devicePixelRatio;
      var drawImage = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (("nodeName" in image) && /img/i.test(image.nodeName)) {
          for (var i = arguments.length - 1; i >= 1; i--) {
            arguments[i] = arguments[i] * factor;
          }
        } else if (typeof dw == "undefined") {
          arguments[1] *= factor;
          arguments[2] *= factor;
          arguments[3] *= factor;
          arguments[4] *= factor;
        }

        drawImage.apply(this, arguments);
      };
    }

    /**
     * Check whether the user's browser supports Data URI or not
     * 
     * @private
     * @param {Function} fSuccess Occurs if it supports Data URI
     * @param {Function} fFail Occurs if it doesn't support Data URI
     */
    function _safeSetDataURI(fSuccess, fFail) {
      var self = this;
      self._fFail = fFail;
      self._fSuccess = fSuccess;

      // Check it just once
      if (self._bSupportDataURI === null) {
        var el = document.createElement("img");
        var fOnError = function () {
          self._bSupportDataURI = false;

          if (self._fFail) {
            self._fFail.call(self);
          }
        };
        var fOnSuccess = function () {
          self._bSupportDataURI = true;

          if (self._fSuccess) {
            self._fSuccess.call(self);
          }
        };

        el.onabort = fOnError;
        el.onerror = fOnError;
        el.onload = fOnSuccess;
        el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
        return;
      } else if (self._bSupportDataURI === true && self._fSuccess) {
        self._fSuccess.call(self);
      } else if (self._bSupportDataURI === false && self._fFail) {
        self._fFail.call(self);
      }
    };

    /**
     * Drawing QRCode by using canvas
     * 
     * @constructor
     * @param {HTMLElement} el
     * @param {Object} htOption QRCode Options 
     */
    var Drawing = function (el, htOption) {
      this._bIsPainted = false;
      this._android = _getAndroid();

      this._htOption = htOption;
      this._elCanvas = document.createElement("canvas");
      this._elCanvas.width = htOption.width;
      this._elCanvas.height = htOption.height;
      el.appendChild(this._elCanvas);
      this._el = el;
      this._oContext = this._elCanvas.getContext("2d");
      this._bIsPainted = false;
      this._elImage = document.createElement("img");
      this._elImage.alt = "Scan me!";
      this._elImage.style.display = "none";
      this._el.appendChild(this._elImage);
      this._bSupportDataURI = null;
    };

    /**
     * Draw the QRCode
     * 
     * @param {QRCode} oQRCode 
     */
    Drawing.prototype.draw = function (oQRCode) {
      var _elImage = this._elImage;
      var _oContext = this._oContext;
      var _htOption = this._htOption;

      var nCount = oQRCode.getModuleCount();
      var nWidth = _htOption.width / nCount;
      var nHeight = _htOption.height / nCount;
      var nRoundedWidth = Math.round(nWidth);
      var nRoundedHeight = Math.round(nHeight);

      _elImage.style.display = "none";
      this.clear();

      for (var row = 0; row < nCount; row++) {
        for (var col = 0; col < nCount; col++) {
          var bIsDark = oQRCode.isDark(row, col);
          var nLeft = col * nWidth;
          var nTop = row * nHeight;
          _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
          _oContext.lineWidth = 1;
          _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
          _oContext.fillRect(nLeft, nTop, nWidth, nHeight);

          // 안티 앨리어싱 방지 처리
          _oContext.strokeRect(
            Math.floor(nLeft) + 0.5,
            Math.floor(nTop) + 0.5,
            nRoundedWidth,
            nRoundedHeight
          );

          _oContext.strokeRect(
            Math.ceil(nLeft) - 0.5,
            Math.ceil(nTop) - 0.5,
            nRoundedWidth,
            nRoundedHeight
          );
        }
      }

      this._bIsPainted = true;
    };

    /**
     * Make the image from Canvas if the browser supports Data URI.
     */
    Drawing.prototype.makeImage = function () {
      if (this._bIsPainted) {
        _safeSetDataURI.call(this, _onMakeImage);
      }
    };

    /**
     * Return whether the QRCode is painted or not
     * 
     * @return {Boolean}
     */
    Drawing.prototype.isPainted = function () {
      return this._bIsPainted;
    };

    /**
     * Clear the QRCode
     */
    Drawing.prototype.clear = function () {
      this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
      this._bIsPainted = false;
    };

    /**
     * @private
     * @param {Number} nNumber
     */
    Drawing.prototype.round = function (nNumber) {
      if (!nNumber) {
        return nNumber;
      }

      return Math.floor(nNumber * 1000) / 1000;
    };

    return Drawing;
  })();

  /**
   * Get the type by string length
   * 
   * @private
   * @param {String} sText
   * @param {Number} nCorrectLevel
   * @return {Number} type
   */
  function _getTypeNumber(sText, nCorrectLevel) {
    var nType = 1;
    var length = _getUTF8Length(sText);

    for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
      var nLimit = 0;

      switch (nCorrectLevel) {
        case QRErrorCorrectLevel.L:
          nLimit = QRCodeLimitLength[i][0];
          break;
        case QRErrorCorrectLevel.M:
          nLimit = QRCodeLimitLength[i][1];
          break;
        case QRErrorCorrectLevel.Q:
          nLimit = QRCodeLimitLength[i][2];
          break;
        case QRErrorCorrectLevel.H:
          nLimit = QRCodeLimitLength[i][3];
          break;
      }

      if (length <= nLimit) {
        break;
      } else {
        nType++;
      }
    }

    if (nType > QRCodeLimitLength.length) {
      throw new Error("Too long data");
    }

    return nType;
  }

  function _getUTF8Length(sText) {
    var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
    return replacedText.length + (replacedText.length != sText ? 3 : 0);
  }

  /**
   * @class QRCode
   * @constructor
   * @example 
   * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
   *
   * @example
   * var oQRCode = new QRCode("test", {
   *    text : "http://naver.com",
   *    width : 128,
   *    height : 128
   * });
   * 
   * oQRCode.clear(); // Clear the QRCode.
   * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
   *
   * @param {HTMLElement|String} el target element or 'id' attribute of element.
   * @param {Object|String} vOption
   * @param {String} vOption.text QRCode link data
   * @param {Number} [vOption.width=256]
   * @param {Number} [vOption.height=256]
   * @param {String} [vOption.colorDark="#000000"]
   * @param {String} [vOption.colorLight="#ffffff"]
   * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H] 
   */
  QRCode = function (el, vOption) {
    this._htOption = {
      width: 256,
      height: 256,
      typeNumber: 4,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRErrorCorrectLevel.H
    };

    if (typeof vOption === 'string') {
      vOption = {
        text: vOption
      };
    }

    // Overwrites options
    if (vOption) {
      for (var i in vOption) {
        this._htOption[i] = vOption[i];
      }
    }

    if (typeof el == "string") {
      el = document.getElementById(el);
    }

    if (this._htOption.useSVG) {
      Drawing = svgDrawer;
    }

    this._android = _getAndroid();
    this._el = el;
    this._oQRCode = null;
    this._oDrawing = new Drawing(this._el, this._htOption);

    if (this._htOption.text) {
      this.makeCode(this._htOption.text);
    }
  };

  /**
   * Make the QRCode
   * 
   * @param {String} sText link data
   */
  QRCode.prototype.makeCode = function (sText) {
    this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
    this._oQRCode.addData(sText);
    this._oQRCode.make();
    this._el.title = sText;
    this._oDrawing.draw(this._oQRCode);
    this.makeImage();
  };

  /**
   * Make the Image from Canvas element
   * - It occurs automatically
   * - Android below 3 doesn't support Data-URI spec.
   * 
   * @private
   */
  QRCode.prototype.makeImage = function () {
    if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
      this._oDrawing.makeImage();
    }
  };

  /**
   * Clear the QRCode
   */
  QRCode.prototype.clear = function () {
    this._oDrawing.clear();
  };

  /**
   * @name QRCode.CorrectLevel
   */
  QRCode.CorrectLevel = QRErrorCorrectLevel;

  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = QRCode;
    }
    exports.QRCode = QRCode;
  } else {
    root.QRCode = QRCode;
  }
})();


/***/ }),

/***/ 638:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PipesModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__timediff__ = __webpack_require__(639);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__connect_state__ = __webpack_require__(640);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__avatar_src__ = __webpack_require__(641);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gender__ = __webpack_require__(642);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__img_src__ = __webpack_require__(643);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var PipesModule = /** @class */ (function () {
    function PipesModule() {
    }
    PipesModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_1__timediff__["a" /* TimediffPipe */],
                __WEBPACK_IMPORTED_MODULE_2__connect_state__["a" /* ConnectStatePipe */],
                __WEBPACK_IMPORTED_MODULE_3__avatar_src__["a" /* AvatarSrcPipe */],
                __WEBPACK_IMPORTED_MODULE_4__gender__["a" /* GenderPipe */],
                __WEBPACK_IMPORTED_MODULE_5__img_src__["a" /* ImgSrcPipe */]
            ],
            imports: [],
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__timediff__["a" /* TimediffPipe */],
                __WEBPACK_IMPORTED_MODULE_2__connect_state__["a" /* ConnectStatePipe */],
                __WEBPACK_IMPORTED_MODULE_3__avatar_src__["a" /* AvatarSrcPipe */],
                __WEBPACK_IMPORTED_MODULE_4__gender__["a" /* GenderPipe */],
                __WEBPACK_IMPORTED_MODULE_5__img_src__["a" /* ImgSrcPipe */]
            ]
        })
    ], PipesModule);
    return PipesModule;
}());

//# sourceMappingURL=pipes.module.js.map

/***/ }),

/***/ 639:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimediffPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/*
  Generated class for the Cc pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
var TimediffPipe = /** @class */ (function () {
    function TimediffPipe() {
    }
    /*
      Takes a value and makes it lowercase.
     */
    TimediffPipe.prototype.transform = function (value) {
        var diff = value / 1000;
        if (diff < 60 && diff >= 0) {
            return "刚刚";
        }
        else if (diff >= 60 && diff < 3600) {
            return Math.floor(diff / 60) + "分钟前";
        }
        else if (diff >= 3600 && diff < 3600 * 24) {
            return Math.floor(diff / 3600) + "小时前";
        }
        else if (diff >= 3600 * 24 && diff < 3600 * 24 * 30) {
            return Math.floor(diff / 3600 / 24) + "天前";
        }
        else if (diff >= 3600 * 24 * 30 && diff < 3600 * 24 * 30 * 12) {
            return Math.floor(diff / 3600 / 24 / 30) + "个月前";
        }
        else if (diff >= 3600 * 24 * 30 * 12) {
            return Math.floor(diff / 3600 / 24 / 30 / 12) + "年前";
        }
        else {
            return "刚刚";
        }
    };
    TimediffPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["W" /* Pipe */])({
            name: 'timediff'
        })
    ], TimediffPipe);
    return TimediffPipe;
}());

//# sourceMappingURL=timediff.js.map

/***/ }),

/***/ 640:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConnectStatePipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ConnectStatePipe = /** @class */ (function () {
    function ConnectStatePipe() {
    }
    ConnectStatePipe.prototype.transform = function (value) {
        var arr = ['(未连接)', '(连接中)', ''];
        return arr[value] || '';
    };
    ConnectStatePipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["W" /* Pipe */])({
            name: 'connectState'
        })
    ], ConnectStatePipe);
    return ConnectStatePipe;
}());

//# sourceMappingURL=connect-state.js.map

/***/ }),

/***/ 641:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AvatarSrcPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_config__ = __webpack_require__(40);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AvatarSrcPipe = /** @class */ (function () {
    function AvatarSrcPipe() {
    }
    AvatarSrcPipe.prototype.transform = function (value, size) {
        if (size === void 0) { size = 100; }
        if (value === null || value === undefined || value === '') {
            return 'assets/img/default-avatar.jpg';
        }
        else {
            var url = __WEBPACK_IMPORTED_MODULE_1__config_config__["c" /* UPLOAD_HOST */] + value;
            return size ? url + '@' + size + '.jpg' : url;
        }
    };
    AvatarSrcPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["W" /* Pipe */])({
            name: 'avatarSrc'
        })
    ], AvatarSrcPipe);
    return AvatarSrcPipe;
}());

//# sourceMappingURL=avatar-src.js.map

/***/ }),

/***/ 642:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GenderPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var GenderPipe = /** @class */ (function () {
    function GenderPipe() {
    }
    GenderPipe.prototype.transform = function (value) {
        var genders = ['男', '女'];
        return genders[value] || '';
    };
    GenderPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["W" /* Pipe */])({
            name: 'gender'
        })
    ], GenderPipe);
    return GenderPipe;
}());

//# sourceMappingURL=gender.js.map

/***/ }),

/***/ 643:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImgSrcPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_config__ = __webpack_require__(40);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ImgSrcPipe = /** @class */ (function () {
    function ImgSrcPipe() {
    }
    ImgSrcPipe.prototype.transform = function (value, size) {
        if (value === null || value === undefined || value === '') {
            return 'assets/img/default-avatar.jpg';
        }
        else {
            var url = __WEBPACK_IMPORTED_MODULE_1__config_config__["c" /* UPLOAD_HOST */] + value;
            return size ? url + '@' + size + '.jpg' : url;
        }
    };
    ImgSrcPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["W" /* Pipe */])({
            name: 'imgSrc'
        })
    ], ImgSrcPipe);
    return ImgSrcPipe;
}());

//# sourceMappingURL=img-src.js.map

/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = each;
/* harmony export (immutable) */ __webpack_exports__["c"] = format;
/* unused harmony export clone */
/* harmony export (immutable) */ __webpack_exports__["a"] = createFormData;
/* harmony export (immutable) */ __webpack_exports__["d"] = getDiff;
/* unused harmony export formatDate */
function each(elements, callback, hasOwnProperty) {
    if (hasOwnProperty === void 0) { hasOwnProperty = false; }
    if (!elements) {
        return this;
    }
    if (typeof elements.length === 'number') {
        [].every.call(elements, function (el, idx) {
            return callback.call(el, idx, el) !== false;
        });
    }
    else {
        for (var key in elements) {
            if (hasOwnProperty) {
                if (elements.hasOwnProperty(key)) {
                    if (callback.call(elements[key], key, elements[key]) === false)
                        return elements;
                }
            }
            else {
                if (callback.call(elements[key], key, elements[key]) === false)
                    return elements;
            }
        }
    }
    return this;
}
;
function format(str, obj) {
    var result = str;
    var args = Array.prototype.slice.call(arguments, 1);
    var reg;
    if (arguments.length > 1) {
        if (arguments.length == 2 && typeof obj == "object") {
            for (var key in obj) {
                if (obj[key] !== undefined) {
                    reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, obj[key]);
                }
            }
        }
        else {
            for (var i = 0; i < args.length; i++) {
                if (args[i] !== undefined) {
                    reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, args[i]);
                }
            }
        }
    }
    return result;
}
function clone(obj) {
    var isArray = obj.constructor === Array;
    var str;
    var newobj = isArray ? [] : {};
    if (typeof obj === 'object') {
        if (typeof JSON !== 'undefined') {
            str = JSON.stringify(obj);
            newobj = JSON.parse(str);
        }
        else {
            if (isArray) {
                newobj = [];
                for (var i = 0; i < obj.length; i++) {
                    newobj[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
                }
            }
            else {
                newobj = {};
                for (var key in obj) {
                    newobj[key] = typeof obj[i] === 'object' ? clone(obj[key]) : obj[key];
                }
            }
        }
        return newobj;
    }
    else {
        return obj;
    }
}
function createFormData(obj) {
    var formData = new FormData();
    for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
            formData.append(name, obj[name]);
        }
    }
    return formData;
}
function getDiff(date) {
    var time = new Date(date);
    var timeStamp = time.getTime();
    var currTime = Date.now();
    var diff = currTime - timeStamp;
    return diff;
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
function formatDate(date, fmt) {
    date = new Date(date);
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__friend_request_friend_request__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__chat_content_chat_content__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_backend__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var UserDetailPage = /** @class */ (function () {
    function UserDetailPage(navCtrl, navParams, userService, systemService, myHttp, backEnd) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.backEnd = backEnd;
        this.isFriend = false;
        this.userId = navParams.data.userId;
        this.ownId = backEnd.getOwnId();
    }
    UserDetailPage.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser(this.userId).subscribe(function (res) {
            _this.user = res.data.user;
            _this.isFriend = res.data.isFriend;
            _this.relationId = res.data.relationId;
        }, function (err) { return _this.myHttp.handleError(err, '加载失败'); });
    };
    UserDetailPage.prototype.gotoFriendRequestPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__friend_request_friend_request__["a" /* FriendRequestPage */], { userId: this.userId });
    };
    UserDetailPage.prototype.gotoChatContentPage = function () {
        if (!this.relationId)
            return alert('你们还不是朋友！');
        //如果是从聊天内容页进来的话，就直接pop
        if (this.navCtrl.getPrevious().component === __WEBPACK_IMPORTED_MODULE_5__chat_content_chat_content__["a" /* ChatContentPage */]) {
            this.navCtrl.pop();
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__chat_content_chat_content__["a" /* ChatContentPage */], { relationId: this.relationId, chatName: this.user.nickname });
        }
    };
    UserDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-user-detail-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\user-detail\user-detail.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>详细资料</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n  <ion-list>\n    <ion-item>\n      <ion-thumbnail item-left>\n        <!-- <img [src]="user.avatarSrc | avatarSrc" /> -->\n        <cy-img [src]="user?.avatarSrc | avatarSrc" style="width:56px;" [zoom]="true"></cy-img>\n      </ion-thumbnail>\n      <h2>\n        <span class="nickname">{{user?.nickname}}</span>\n        <ion-icon name="male" color="primary" *ngIf="user?.gender===0"></ion-icon>\n        <ion-icon name="female" color="fourthly" *ngIf="user?.gender===1"></ion-icon>\n      </h2>\n      <p class="username">用户名：{{user?.username}}</p>\n    </ion-item>\n  </ion-list>\n\n  <div padding *ngIf="user">\n    <button ion-button block round *ngIf="isFriend != true && user._id !== ownId" (click)="gotoFriendRequestPage()">添加好友</button>\n\n    <button ion-button block round *ngIf="isFriend == true" (click)="gotoChatContentPage()">开始聊天</button>\n\n  </div>\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\user-detail\user-detail.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_3__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_6__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_7__providers_backend__["a" /* BackEnd */]])
    ], UserDetailPage);
    return UserDetailPage;
}());

//# sourceMappingURL=user-detail.js.map

/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_mergeMap__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_mergeMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__index_index__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__verifymobile_verifymobile__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__validators_index__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, toastCtrl, builder, storage, userservice, systemService, myHttp) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.builder = builder;
        this.storage = storage;
        this.userservice = userservice;
        this.systemService = systemService;
        this.myHttp = myHttp;
        this.logining = false;
        this.formLabelMap = {
            username: '帐号',
            password: '密码'
        };
    }
    LoginPage.prototype.ngOnInit = function () {
        var _this = this;
        this.form = this.builder.group({
            username: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required,
                ],
            ],
            password: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required,
                ]
            ]
        });
        //注册页传来的username
        var username = this.navParams.data['username'];
        if (username) {
            this.form.controls['username'].setValue(username);
        }
        else {
            //获取上次登录的用户名
            this.storage.get('latestUsername').then(function (value) {
                if (value) {
                    _this.form.controls['username'].setValue(value);
                }
            });
        }
    };
    //登录
    LoginPage.prototype.login = function () {
        var _this = this;
        if (this.form.invalid) {
            var msg = Object(__WEBPACK_IMPORTED_MODULE_10__validators_index__["b" /* getErrorMsgByFormGroup */])(this.form, this.formLabelMap);
            this.systemService.showToast(msg);
            return;
        }
        this.logining = true;
        var obser = this.userservice.login(this.form.value);
        obser
            .mergeMap(function (res) {
            //本地保存token
            var token = res.data.token;
            var ownId = _this.form.value.username;
            return _this.saveToken(token, ownId);
        })
            .do(function () {
            _this.logining = false;
        }, function () {
            _this.logining = false;
        })
            .subscribe(function () {
            //保存登录名，下次登录返显处来
            _this.storage.set('latestUsername', _this.form.value.username);
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__index_index__["a" /* IndexPage */]);
        }, function (err) { return _this.myHttp.handleError(err, '登录失败'); });
    };
    LoginPage.prototype.gotoVerifyMobilePage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__verifymobile_verifymobile__["a" /* VerifyMobilePage */]);
    };
    LoginPage.prototype._$testLogin = function (n) {
        this.form.setValue({
            username: 'test' + n,
            password: 123456
        });
        this.login();
    };
    LoginPage.prototype.saveToken = function (token, ownId) {
        var p1 = this.storage.set('token', token);
        var p2 = this.storage.set('ownId', ownId);
        var pAll = Promise.all([p1, p2]);
        return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].fromPromise(pAll);
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-login-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\login\login.html"*/'<ion-content>\n  <form [formGroup]="form" (ngSubmit)="login()">\n    <div class="logo-wrap">\n      <img src="assets/img/logo.png" />\n    </div>\n    <ion-list>\n      <ion-item>\n        <ion-label>帐号</ion-label>\n        <ion-input type="text" placeholder="用户名/手机号" formControlName="username" [clearInput]="true"></ion-input>\n        <!--<span item-right *ngIf="form.controls.username.pending && form.controls.username.dirty">...</span>\n				<span item-right *ngIf="form.controls.username.valid && form.controls.username.dirty">√</span>\n				<span item-right *ngIf="form.controls.username.invalid && form.controls.username.dirty">×</span>-->\n      </ion-item>\n\n      <ion-item>\n        <ion-label>密码</ion-label>\n        <ion-input type="password" placeholder="密码" formControlName="password" [clearInput]="true"></ion-input>\n        <!--<span item-right *ngIf="form.controls.password.pending && form.controls.password.dirty">...</span>\n				<span item-right *ngIf="form.controls.password.valid && form.controls.password.dirty">√</span>\n				<span item-right *ngIf="form.controls.password.invalid && form.controls.password.dirty">×</span>-->\n      </ion-item>\n\n    </ion-list>\n    <div padding-horizontal style="overflow:hidden;">\n      <!-- <a ion-button href="javascript:;" (click)="gotoVerifyMobilePage()" >注册</a> -->\n      <a ion-button outline small clear class="signup-btn" (click)="gotoVerifyMobilePage()">没有账号? 去注册</a>\n    </div>\n\n    <!--<div padding-horizontal><button ion-button block [disabled]="form.invalid" @flyInOut>登录</button></div>-->\n    <div padding>\n      <button type="submit" ion-button block round icon-start disabled="{{ logining? \'disabled\' : \'\' }}">\n          <ion-spinner color="light" style="margin-right:6px;" *ngIf="logining"></ion-spinner>\n          登录\n      </button>\n    </div>\n  </form>\n\n  <div padding-horizontal style="display: none;">\n    <!-- <button ion-button block color="secondary" (click)="_$testLogin(1)">test1</button>\n    <button ion-button block color="secondary" (click)="_$testLogin(2)">test2</button> -->\n  </div>\n</ion-content>'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_8__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_9__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_11__providers_my_http__["a" /* MyHttp */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 93:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MsgService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_MyRelaySubject__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_mergeMap__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_mergeMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_scan__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_scan___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_add_operator_scan__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_do__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_combineLatest__ = __webpack_require__(268);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_combineLatest___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_rxjs_add_operator_combineLatest__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__config_config__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_my_http__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__providers_backend__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__utils_utils__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

















var MsgService = /** @class */ (function () {
    function MsgService(storage, myHttp, backEnd, userService) {
        this.storage = storage;
        this.myHttp = myHttp;
        this.backEnd = backEnd;
        this.userService = userService;
        this.readingId = '';
        this.newMsgSubject = new __WEBPACK_IMPORTED_MODULE_5__utils_MyRelaySubject__["a" /* MyReplaySubject */]();
        this.newMsg$ = this.newMsgSubject.asObservable();
        this.msgListSubject = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.msgList$ = this.msgListSubject.asObservable();
        this.chatListSubject = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.chatList$ = this.chatListSubject.asObservable();
        this.storageMsgListSubject = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.storageChatListSubject = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this._init();
    }
    MsgService.prototype._init = function () {
        var _this = this;
        this.backEnd.pushMsg$.subscribe(function (msg) { return _this.newMsgSubject.next(msg); });
        __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].combineLatest(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].merge(this.userService.own$, this.backEnd.pushUserModed$), this.userService.relationList$).subscribe(function (combine) {
            var user = combine[0];
            var relationList = combine[1];
            //根据userId查找所有的relationIds
            var ids = (function (userId) {
                var ids = [];
                relationList.forEach(function (relation) {
                    if (relation._friend._id === userId) {
                        ids.push(relation['_id']);
                    }
                });
                return ids;
            })(user['_id']);
            //会话列表
            var chatList = _this.chatListSubject.getValue();
            chatList.forEach(function (chat) {
                if (ids.indexOf(chat.relationId) !== -1) {
                    chat['avatarSrc'] = user['avatarSrc'];
                    chat['name'] = user['nickname'];
                }
            });
            _this.storageChatList(chatList);
            _this.chatListSubject.next(chatList);
            //消息列表
            var msgList = _this.msgListSubject.getValue();
            msgList.forEach(function (msg) {
                if (msg._fromUser._id === user['_id']) {
                    msg._fromUser = user;
                }
            });
            _this.storageMsgList(msgList);
            _this.msgListSubject.next(msgList);
        });
        //msg
        var msgListByNewMsg_Subscription;
        var msgListByNewMsg$ = this.newMsgSubject
            .map(function (msg) {
            var msgList = _this.msgListSubject.getValue();
            msgList.push(msg);
            return msgList;
        })
            .combineLatest(this.userService.friendList$)
            .map(function (combine) {
            var msgList = combine[0];
            var friendList = combine[1];
            console.log('msgList$ & friendList$:', msgList, friendList);
            msgList.forEach(function (msg) {
                friendList.forEach(function (friend) {
                    if (msg.fromUserId === friend._id) {
                        msg._fromUser = friend;
                    }
                });
            });
            return msgList;
        });
        this.storageMsgListSubject.subscribe(function (msgList) {
            _this.msgListSubject.next(msgList);
            msgListByNewMsg_Subscription && msgListByNewMsg_Subscription.unsubscribe();
            //先从本地存储拿数据，在绑定，避免顺序搞错
            msgListByNewMsg_Subscription = msgListByNewMsg$.subscribe(function (list) {
                _this.storageMsgList(list);
                _this.msgListSubject.next(list);
            });
        });
        //chat
        var chatListByNewMsg_Subscription;
        var chatListByNewMsg$ = this.newMsgSubject
            .map(function (msg) {
            var chatList = _this.chatListSubject.getValue();
            return _this.updateChatList(chatList, msg);
        })
            .combineLatest(this.userService.relationList$)
            .map(function (combine) {
            var chatList = combine[0];
            var relationList = combine[1];
            console.log('chatList$ & relationList$:', chatList, relationList);
            chatList.forEach(function (chat) {
                relationList.forEach(function (relation) {
                    if (chat.relationId === relation._id) {
                        chat.name = relation._friend.nickname;
                        chat.avatarSrc = relation._friend.avatarSrc;
                    }
                });
            });
            return chatList;
        });
        this.storageChatListSubject.subscribe(function (chatList) {
            _this.chatListSubject.next(chatList);
            chatListByNewMsg_Subscription && chatListByNewMsg_Subscription.unsubscribe();
            //先从本地存储拿数据，在绑定，避免顺序搞错
            chatListByNewMsg_Subscription = chatListByNewMsg$.subscribe(function (list) {
                _this.storageChatList(list);
                _this.chatListSubject.next(list);
            });
        });
        this.msgList$.subscribe(function (msgList) {
        });
    };
    MsgService.prototype.getSource = function (token, userId) {
        this.getMsgList();
        this.getChatList();
    };
    MsgService.prototype.clearSource = function () {
        this.newMsgSubject.clearBuffer();
        this.chatListSubject.next([]);
        this.msgListSubject.next([]);
    };
    //从本地拿
    MsgService.prototype.getMsgList = function () {
        var _this = this;
        var ownId = this.backEnd.getOwnId();
        __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].fromPromise(this.storage.get('msgList/' + ownId)).subscribe(function (msgList) { return _this.storageMsgListSubject.next(msgList || []); }, function (err) { return console.log(err); });
    };
    MsgService.prototype.getChatList = function () {
        var _this = this;
        var ownId = this.backEnd.getOwnId();
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].fromPromise(this.storage.get('chatList/' + ownId)).subscribe(function (chatList) { return _this.storageChatListSubject.next(chatList || []); }, function (err) { return console.log(err); });
    };
    MsgService.prototype.deleteChat = function (relationId) {
        var chatList = this.chatListSubject.getValue();
        chatList.forEach(function (chat, i) {
            if (chat.relationId === relationId) {
                chatList.splice(i, 1);
                return false;
            }
        });
        this.storageChatList(chatList);
        this.storageChatListSubject.next(chatList);
    };
    //每收到newMsg,更新chatList并返回
    MsgService.prototype.updateChatList = function (chatList, msg) {
        var index = chatList.findIndex(function (chat) {
            return chat.relationId === msg.relationId;
        });
        var content = msg.type === 0 ? msg.content : msg.type === 1 ? '[图片]' : '[语音]';
        //该信息存在聊天列表中
        if (index !== -1) {
            var chat = chatList[index];
            chat.lastContent = content;
            chat.lastSendTime = msg.sendTime;
            chat.unread++; //未读加一
            //如果正在读信息
            if (chat.relationId === this.readingId) {
                chat.unread = 0;
            }
        }
        else {
            var chat = {
                lastContent: content,
                lastSendTime: msg.sendTime,
                relationId: msg.relationId,
                name: '',
                avatarSrc: '',
                unread: 1
            };
            //如果正在读信息
            if (chat.relationId === this.readingId) {
                chat.unread = 0;
            }
            chatList.unshift(chat);
        }
        //以时间倒序排序
        chatList.sort(function (a, b) {
            return new Date(b.lastSendTime).getTime() - new Date(a.lastSendTime).getTime();
        });
        return chatList;
    };
    //发送文本消息
    MsgService.prototype.sendMsg = function (relationId, content) {
        var ownId = this.backEnd.getOwnId();
        this.backEnd.sendMsg(relationId, content);
        this.newMsgSubject.next({
            _id: new Date().getTime(),
            _fromUser: {
                _id: ownId,
                avatarSrc: ''
            },
            fromUserId: ownId,
            relationId: relationId,
            timediff: new Date().getTime(),
            type: 0,
            content: "" + content
        });
        // this.myHttp.post(API_HOST + '/msg/sendMsg', { relationId, content })
        // 	.subscribe(
        // 	res => { this.newMsgSubject.next(res.data) },
        // 	err => { console.log(err) }
        // 	);
    };
    //发送语音消息
    MsgService.prototype.sendImgMsg = function (relationId, imgFile) {
        var _this = this;
        var formData = Object(__WEBPACK_IMPORTED_MODULE_16__utils_utils__["a" /* createFormData */])({ relationId: relationId, imgFile: imgFile });
        this.myHttp.post(__WEBPACK_IMPORTED_MODULE_12__config_config__["b" /* API_HOST */] + '/msg/sendImgMsg', formData)
            .subscribe(function (res) { _this.newMsgSubject.next(res.data); }, function (err) { console.log(err); });
    };
    //发送语音
    MsgService.prototype.sendAudioMsg = function (relationId, audioUri, audioDuration) {
        var _this = this;
        this.myHttp.upload(audioUri, 'record.mp3', __WEBPACK_IMPORTED_MODULE_12__config_config__["b" /* API_HOST */] + '/msg/sendAudioMsg', { relationId: relationId, audioDuration: audioDuration })
            .subscribe(function (res) {
            _this.newMsgSubject.next(res.data);
        }, function (err) {
            console.log(err);
        });
    };
    MsgService.prototype.readChat = function (relationId) {
        this.readingId = relationId;
        var chatList = this.chatListSubject.getValue();
        chatList.forEach(function (chat) {
            if (chat.relationId === relationId) {
                chat.unread = 0;
            }
        });
        this.storageChatList(chatList);
        this.chatListSubject.next(chatList);
    };
    MsgService.prototype.stopReadChat = function () {
        this.readingId = '';
    };
    //msg
    MsgService.prototype.storageMsgList = function (msgList) {
        return this.setInPrivateStorage('msgList', msgList);
    };
    MsgService.prototype.getMsgListFromStorage = function () {
        return this.getInPrivateStorage('msgList');
    };
    //chat
    MsgService.prototype.storageChatList = function (chatList) {
        return this.setInPrivateStorage('chatList', chatList);
    };
    MsgService.prototype.getChatListFromStorage = function () {
        return this.getInPrivateStorage('chatList');
    };
    MsgService.prototype.getInPrivateStorage = function (name) {
        var ownId = this.backEnd.getOwnId();
        return this.storage.get(name + '/' + ownId);
    };
    MsgService.prototype.setInPrivateStorage = function (name, value) {
        var ownId = this.backEnd.getOwnId();
        console.log('addddddddddddd', name, ownId, value);
        // return Promise.resolve();
        return this.storage.set(name + '/' + ownId, value);
    };
    MsgService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_13__providers_my_http__["a" /* MyHttp */],
            __WEBPACK_IMPORTED_MODULE_14__providers_backend__["a" /* BackEnd */],
            __WEBPACK_IMPORTED_MODULE_15__services_user__["a" /* UserService */]])
    ], MsgService);
    return MsgService;
}());

//# sourceMappingURL=msg.js.map

/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FriendAddPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_detail_user_detail__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__friend_by_contact_friend_by_contact__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_user__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_system__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_my_http__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var FriendAddPage = /** @class */ (function () {
    function FriendAddPage(navCtrl, userService, systemService, myHttp) {
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.systemService = systemService;
        this.myHttp = myHttp;
    }
    FriendAddPage.prototype.submitForm = function () {
        var _this = this;
        this.userService.searchUser(this.search).subscribe(function (res) {
            if (res.data.length == 0) {
                return _this.systemService.showToast('没有找到该用户！');
            }
            var userId = res.data[0]._id;
            _this.gotoUserDetailPage(userId);
        }, function (err) { return _this.myHttp.handleError(err, '查找用户失败'); });
    };
    FriendAddPage.prototype.gotoFriendByContactPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__friend_by_contact_friend_by_contact__["a" /* FriendByContactPage */]);
    };
    FriendAddPage.prototype.gotoUserDetailPage = function (userId) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__user_detail_user_detail__["a" /* UserDetailPage */], { userId: userId });
    };
    FriendAddPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'cy-friend-add-page',template:/*ion-inline-start:"E:\xcode\kefu\livechat\src\pages\friend-add\friend-add.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>添加好友</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <form (ngSubmit)="submitForm()">\n    <ion-list padding-top>\n      <ion-item>\n        <!-- <ion-label>\n          <ion-icon name="search" color="primary"></ion-icon>\n        </ion-label> -->\n        <ion-input [(ngModel)]="search" type="search" name="search" placeholder="用户名/手机号" [clearInput]="true"></ion-input>\n        <button item-end ion-button icon-only clear type="submit">\n            <ion-icon name="search" color="primary"></ion-icon>\n        </button>\n      </ion-item>\n    </ion-list>\n  </form>\n  <ion-list>\n    \n    <button ion-item (click)="gotoFriendByContactPage()">\n      <ion-icon item-left name="md-qr-scanner"></ion-icon>\n      <h2>扫一扫</h2>\n      <ion-note>扫描二维码添加好友</ion-note>\n    </button>\n    <button ion-item (click)="gotoFriendByContactPage()">\n        <ion-icon item-left name="phone-portrait"></ion-icon>\n        <h2>手机联系人</h2>\n        <ion-note>手机通讯录添加好友</ion-note>\n      </button>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"E:\xcode\kefu\livechat\src\pages\friend-add\friend-add.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__services_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_5__services_system__["a" /* SystemService */],
            __WEBPACK_IMPORTED_MODULE_6__providers_my_http__["a" /* MyHttp */]])
    ], FriendAddPage);
    return FriendAddPage;
}());

//# sourceMappingURL=friend-add.js.map

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return myValidators; });
/* harmony export (immutable) */ __webpack_exports__["a"] = getErrorMsgByFormControl;
/* harmony export (immutable) */ __webpack_exports__["b"] = getErrorMsgByFormGroup;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_utils__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


function isEmptyInputValue(value) {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}
var regs = {
    mobile: /^1[3|4|5|8]\d{9}$/
};
var defulatErrorMsgFuncMap = {
    required: function (args) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["c" /* format */])('{label}不能为空', args);
    },
    pattern: function (args) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["c" /* format */])('{label}格式不正确', args);
    },
    mobile: function (args) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["c" /* format */])('{label}不正确', args);
    }
};
var myValidators = /** @class */ (function () {
    function myValidators() {
    }
    myValidators.mobile = function (control) {
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return !regs.mobile.test(control.value) ? { mobile: true } : null;
    };
    myValidators = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], myValidators);
    return myValidators;
}());

function getErrorMsgByFormControl(control, label, errorMsgFuncMap) {
    if (errorMsgFuncMap === void 0) { errorMsgFuncMap = {}; }
    var msg;
    var errorMsgFunc;
    Object(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* each */])(control.errors, function (validatorName, result) {
        if (typeof result !== 'object') {
            result = {};
        }
        result.label = label;
        errorMsgFunc = errorMsgFuncMap[validatorName] || defulatErrorMsgFuncMap[validatorName];
        msg = errorMsgFunc && errorMsgFunc(result);
        return false;
    });
    return msg;
}
function getErrorMsgByFormGroup(form, labelMap, errorMsgFuncMap) {
    if (labelMap === void 0) { labelMap = {}; }
    if (errorMsgFuncMap === void 0) { errorMsgFuncMap = {}; }
    var msg;
    var errorMsgFunc;
    Object(__WEBPACK_IMPORTED_MODULE_1__utils_utils__["b" /* each */])(form.controls, function (name, control) {
        var label = labelMap[name] || name;
        msg = getErrorMsgByFormControl(control, label, errorMsgFuncMap);
        if (msg)
            return false;
    });
    return msg;
}
//# sourceMappingURL=index.js.map

/***/ })

},[314]);
//# sourceMappingURL=main.js.map