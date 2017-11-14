/**
 * Created by jiayi on 2017/7/3.
 */


import {Request, Response, NextFunction} from 'express';
import * as mongoose from 'mongoose';
import {default as Article, ArticleModel} from '../models/article';
import * as _ from 'lodash';

/**
 * 定义类接口
 */
export interface ArticleInterface {
    save(req: Request, res: Response, next: NextFunction);

    find(req: Request, res: Response, next: NextFunction);

    updata(req: Request, res: Response, next: NextFunction);

    search(req: Request, res: Response, next: NextFunction);

    byId(req: Request, res: Response, next: NextFunction, id: string);

    remove(req: Request, res: Response, next: NextFunction);

    count(params);
}

/**
 * 文章控制器
 */
class ArticleController implements ArticleInterface {
    constructor() {
    }

    async save(req: Request, res: Response, next: NextFunction) {
        /*req.checkBody({
            'title': {
                notEmpty: true,
                isLength: {
                    options: [{min: 1, max: 20}],
                    errorMessage: '名称长度不是1-20位' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: '名称不能为空'
            },
            'avatar': {
                notEmpty: true, // won't validate if field is empty
                errorMessage: '封面不能为空' // Error message for the parameter
            }
        });
        const errors = req.validationErrors();
        if (errors) {
            res.json({
                'meta': {
                    'code': 422,
                    'message': '参数不全'
                }
            });
            return;
        }
        const newCorpus = new Article(Object.assign({owner: (req as any).user._id}, req.body));
        try {
            const corpus = await newCorpus.save();
            res.json({
                'meta': {
                    'code': 200,
                    'message': '添加成功'
                },
                'data': {
                    'slug': corpus._id
                }
            });
        } catch (err) {
            console.log('给用户添加专题', err);
            res.json({
                'meta': {
                    'code': 422,
                    'message': '保存专题失败'
                }
            });
        }*/
    }

    async find(req: Request, res: Response, next: NextFunction) {
        const article = (req as any).article;
        res.json({
            'meta': {
                'code': 200,
                'message': '查询成功'
            },
            'data': article.formatData()
        });
    }

    async updata(req: Request, res: Response, next: NextFunction) {
        /*req.checkBody({
            'title': {
                notEmpty: true,
                isLength: {
                    options: [{min: 1, max: 20}],
                    errorMessage: '名称长度不是1-20位' // Error message for the validator, takes precedent over parameter message
                },
                errorMessage: '名称不能为空'
            },
            'avatar': {
                notEmpty: true, // won't validate if field is empty
                errorMessage: '封面不能为空' // Error message for the parameter
            }
        });
        const errors = req.validationErrors();
        if (errors) {
            res.json({
                'meta': {
                    'code': 422,
                    'message': '参数不全'
                }
            });
            return;
        }
        const corpus = Object.assign((req as any).corpus, req.body);
        corpus.save((err) => {
            if (err) {
                return res.json({
                    'meta': {
                        'code': 422,
                        'message': '修改失败'
                    }
                });
            }
            res.json({
                'meta': {
                    'code': 201,
                    'message': '修改成功'
                }
            });
        });*/
    }

    async search(req: Request, res: Response, next: NextFunction) {
        const {page = 1, limit = 20} = req.query;
        const params: any = Object.assign(req.query, {t: undefined});
        try {
            const count = await Article.count(params);
            const articles = await Article.find(params)
                .populate({path: 'author', select: {'basic.nickname': 1, 'basic.avatar': 1, _id: 1}})
                .sort({'updatedAt': 'desc'})
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            res.json({
                'meta': {
                    'code': 200,
                    'message': '获取全部成功'
                },
                'data': _.map(articles, (article: ArticleModel) => article.formatData()),
                'total': count
            });
        } catch (err) {
            console.log('通过获取全部文章信息失败', err);
            res.json({
                'meta': {
                    'code': 404,
                    'message': '没有搜索到指定文章'
                }
            });
        }
    }

    async byId(req: Request, res: Response, next: NextFunction, id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({
                'meta': {
                    'code': 400,
                    'message': '文章id不对'
                }
            });
        }
        try {
            const article = await Article.findOne({_id: id, isActive: true})
                .populate({path: 'author', select: {'basic.nickname': 1, 'basic.avatar': 1, _id: 1}});
            if (!article) {
                return res.json({
                    'meta': {
                        'code': 404,
                        'message': '没有找到指定文章'
                    }
                });
            }
            (req as any).article = article;
            next();
        } catch (err) {
            return next(err);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        /*const article = (req as any).article;
        article.remove((err) => {
            if (err) {
                return res.json({
                    'meta': {
                        'code': 200,
                        'message': '删除失败'
                    }
                });
            }
            res.json({
                'meta': {
                    'code': 200,
                    'message': '删除成功'
                }
            });
        });*/
    }

    async count(params: any) {
        try {
            return await Article.count(params);
        } catch (err) {
            return 0;
        }
    }
}

/**
 * 导出模块
 */
export default new ArticleController();
