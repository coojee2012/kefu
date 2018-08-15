/**
 * 前端API接口
 * Created by jiayi on 2017/6/18.
 */

/**
 * 引入依赖
 */
import { Injectable, Injector, ReflectiveInjector } from 'injection-js';
import * as Express from 'express';



/**
 * web 控制器
 */
import { UserController } from '../controllers/user';
import { LoggerService } from '../service/LogService';
import { Passport } from '../config/passport'
// import { default as BooksController } from '../controllers/books';
// import { default as ArticleController } from '../controllers/article';
// import { default as CorpusController } from '../controllers/corpus';

import { PBXExtensionController } from '../controllers/pbx_extension';
export class WebAPI {
  private Router: Express.Router;
  private userController: UserController;
  private pbxExtensionCtr: PBXExtensionController;
  private logger: LoggerService;
  private passport: Passport;
  constructor(private injector: Injector) {
    this.Router = Express.Router();
    this.userController = this.injector.get(UserController);
    this.pbxExtensionCtr = this.injector.get(PBXExtensionController);
    this.logger = this.injector.get(LoggerService);
    this.passport = this.injector.get(Passport);
    //this.userController = new UserController(new LoggerService(true));
  }


  getRouter() {
    /**
     * web API接口
     */
    // 用户登录注册退出找回密码 用户修改资料，查看信息
    this.Router.post('/login', (req, res, next) => {
      this.userController.login(req, res, next)
        .then()
        .catch(console.log)
    });
    this.Router.post('/register', (req, res, next) => {
      this.userController.register(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.post('/logout',this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.userController.logout(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.post('/user/:tenantId/list', this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.userController.list(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.post('/user/:tenantId/add',this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.userController.add(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.post('/user/:tenantId/del',this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.userController.del(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.post('/user/:tenantId/reset',this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.userController.reset(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.get('/user/:userid/home', this.userController.home);
    /*Router.get('/user/:id/profile', userController.profile);
    Router.get('/user/:id/basic', userController.basic);*/
    this.Router.param('userid', this.userController.byId);


    // 分机管理

    this.Router.post('/pbx/extension/:tenantId', this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.pbxExtensionCtr.getList(req, res, next)
        .then()
        .catch(console.log)
    });
    this.Router.post('/pbx/extension/:tenantId/add', this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.pbxExtensionCtr.create(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.post('/pbx/extension/:tenantId/addmuti', this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.pbxExtensionCtr.addmuti(req, res, next)
        .then()
        .catch(console.log)
    });

    this.Router.post('/pbx/extension/:tenantId/del', this.passport.getPassport().authenticate('user', { session: false }), (req, res, next) => {
      this.pbxExtensionCtr.delExtension(req, res, next)
        .then()
        .catch(console.log)
    });

    // 分机注册

    this.Router.post('/fs/directory', (req, res, next) => {
      this.pbxExtensionCtr.directory(req, res, next)
        .then()
        .catch(console.log)
    });

    // 文集增删改查
    // this.Router.post('/article', passport.authenticate('user', { session: false }), ArticleController.save);
    // this.Router.put('/article/:articleid', passport.authenticate('user', { session: false }), ArticleController.updata);
    // this.Router.delete('/article/:articleid', passport.authenticate('user', { session: false }), ArticleController.remove);
    // this.Router.get('/article/:articleid', ArticleController.find);
    // this.Router.get('/article', ArticleController.search);
    // this.Router.param('articleid', ArticleController.byId);

    // 文集增删改查
    // this.Router.post('/books', passport.authenticate('user', { session: false }), BooksController.save);
    // this.Router.put('/books/:booksid', passport.authenticate('user', { session: false }), BooksController.updata);
    // this.Router.delete('/books/:booksid', passport.authenticate('user', { session: false }), BooksController.remove);
    // this.Router.get('/books/:booksid', BooksController.find);
    // this.Router.get('/books', BooksController.search);
    // this.Router.param('booksid', BooksController.byId);


    // 专题分类
    // this.Router.post('/collections', passport.authenticate('user', { session: false }), CorpusController.save);
    // this.Router.put('/collections/:collectionsid', passport.authenticate('user', { session: false }), CorpusController.updata);
    // this.Router.get('/collections/:collectionsid', CorpusController.find);
    // this.Router.get('/collections', CorpusController.search);
    // this.Router.param('collectionsid', CorpusController.byId);

    /**
     * 导出路由
     */
    return this.Router;
  }
}


