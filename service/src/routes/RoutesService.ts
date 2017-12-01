import 'reflect-metadata';
import { Injectable, Injector, ReflectiveInjector } from 'injection-js';
import { Request, Response, NextFunction } from 'express';

import { UserController } from '../controllers/user';


import { WebAPI } from './webApi';
import { WebStatic } from './web';
@Injectable()
export class RoutesService {
  private webApi: WebAPI;
  private staticApi: WebStatic;
  private childInjector: Injector;
  constructor(private injector: Injector) {
    this.createChildInjector();
    this.webApi = new WebAPI(this.childInjector);
    this.staticApi = new WebStatic();
  }
  createChildInjector(): void {
    this.childInjector = ReflectiveInjector.resolveAndCreate([
      UserController
    ], this.injector);
  }

  setRoute(app): void {
    /**
     * 全局代理
     */
    app.all('*', function (req: Request, res: Response, next: NextFunction) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200); // 让options请求快速返回
      } else {
        next();
      }
    });
    /**
     * http://localhost:3000/ 访问页面
     */
    app.use('/', this.staticApi.getRouter());

    /**
     * web端api接口
     */
    app.use('/api/v1', this.webApi.getRouter());
    /**
     * 目前还未开始
     */
    // app.use('/api/admin/v1/', adminAPI);
    /**
     * 测试使用
     */
    // app.use('/api/template/v1/', templateAPI);
  }
}