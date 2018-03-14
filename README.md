
# 云客服
> 前端以SPA单页形式，后端以nodejs为主，提供api接口。前端页面使用angular4，管理后台使用hapi

## 技术栈

### node相关

> 以node核心，使用hapi框架，mongodb作为数据库,redis作为缓存技术，eslint为代码检查工具，使用typescript作为开发语言

#### node依赖

生产模块 | 相关介绍
---|---
hapi | 主要框架
mongodb | 主要数据库
lodash |  主要工具库
node-schedule  | 定时任务
async | 并发控制

开发模块 | 相关介绍
---|---
supervisor | 实现监测文件修改并自动重启应用
eslint | 检查代码工具

#### API设计
> 采用 Restful API设计

```
get     /user        获取列表资源
get     /user/:id    获取一个资源
post    /user        创建一个资源
put     /user/:id    更新一个资源
delete  /user/:id    删除一个资源
> 请求参数:比如在数据过多, 需要对数据进行分页请求的时候, 我们应该统一 API 请求参数. 常见的有这些.

limit=10 指定返回记录的数量
offset=10 指定返回记录的开始位置。
page=2&per_page=100 指定第几页，以及每页的记录数。
sortby=name&order=asc 指定返回结果按照哪个属性排序，以及排序顺序。
animal_type_id=1 指定筛选条件
```

> 状态码信息

```
成功状态
200: GET请求成功，及DELETE或PATCH同步请求完成，或者PUT同步更新一个已存在的资源
201: POST 同步请求完成，或者PUT同步创建一个新的资源
202: POST，PUT，DELETE，或PATCH请求接收，将被异步处理
206: GET 请求成功，但是只返回一部分

错误状态
401 Unauthorized: 用户未认证，请求失败
403 Forbidden: 用户无权限访问该资源，请求失败
404 Notfound: 访问资源不存在，请求失败
422 Unprocessable Entity: 请求被服务器正确解析，但是包含无效字段
429 Too Many Requests: 因为访问频繁，你已经被限制访问，稍后重试
500 Internal Server Error: 服务器错误，确认状态并报告问题

```
> 返回的数据结构

```

{
    code：0,
    message: "success",
    data: { key1: value1, key2: value2, ... }
}

code: 返回码，0表示成功，非0表示各种不同的错误
message: 描述信息，成功时为"success"，错误时则是错误信息
data: 成功时返回的数据，类型为对象或数组

不同错误需要定义不同的返回码，属于客户端的错误和服务端的错误也要区分，比如1XX表示客户端的错误，2XX表示服务端的错误。这里举几个例子：

0：成功
100：请求错误
101：缺少appKey
102：缺少签名
103：缺少参数
200：服务器出错
201：服务不可用
202：服务器正在重启

错误信息一般有两种用途：一是客户端开发人员调试时看具体是什么错误；二是作为App错误提示直接展示给用户看。主要还是作为App错误提示，直接展示给用户看的。所以，大部分都是简短的提示信息。

data字段只在请求成功时才会有数据返回的。数据类型限定为对象或数组，当请求需要的数据为单个对象时则传回对象，当请求需要的数据是列表时，则为某个对象的数组.

```




#### 后台管理功能设计





### angular4相关

> 使用angular-cli脚手架

#### 前端功能规划

1. 业务相关


    
3. 用户相关




## 项目规划

1. service  服务器
2. admin    后台管理系统
3. www      前端页面
4. app      移动页面

## 说明
> **个人学习研究用。**