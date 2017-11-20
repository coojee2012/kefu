/**
 * Created by jiayi on 2017/6/22.
 */
/**
 * 引入依赖
 */
import * as Express from 'express';


export class WebStatic {
  private Router;
  constructor() {
    this.Router = Express.Router();
  }
  getRouter() {
    this.Router.get('/', function (req: Express.Request, res: Express.Response) {
      res.render('index', { title: 'jianshu', name: 'jianshu' });
    });
    return this.Router;
  }
}
