/**
 * Created by jiayi on 2017/6/20.
 */
import {Request, Response, NextFunction} from 'express';
import {default as webAPI} from './webApi';
import {default as adminAPI} from './adminApi';
import {default as web} from './web';


/**
 * 模板test
 */
import {default as templateAPI} from './template';



/**
 * 导出路由
 * @param app
 */
export default (app) => {
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
    app.use('/', web);

    /**
     * web端api接口
     */
    app.use('/api/v1', webAPI);
    /**
     * 目前还未开始
     */
    // app.use('/api/admin/v1/', adminAPI);
    /**
     * 测试使用
     */
    // app.use('/api/template/v1/', templateAPI);
}