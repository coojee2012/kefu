# 使用angular-cli创建ng4项目
> 为什么是ng4，ng4是3月23号发布的，这个项目在3月初就创建了。因为cli一直没有发布正式版，一直在等待更新，cli正式版和ng4差不多一起出的。目前版本是1.0.0。

## Node.js安装
> 如果没有安装就去[安装](https://nodejs.org/en/download/)

## 安装[angular-cli](https://github.com/angular/angular-cli)
> npm install -g @angular/cli@latest

> `注意`: cli依赖node-sass，你可能会安装不上，最好先安装`npm install -g node-sass`，科学上网翻墙安装。
node-sass是一个c++编写的东西，需要依赖python2.7，windows用户记得设置PATH，具体怎么python2.7设置到PATH（环境变量，自行百度谷歌）。
如果`npm install -g node-sass`安装不上，请使用以下方式安装：
```
npm install -g cnpm --registry=https://registry.npm.taobao.org     // 使用淘宝镜像
npm uninstall -g node-sass                                         // 把之前安装卸载
npm cache clean                                                    // 清理缓存
cnpm install -g node-sass                                          // 重新安装
```
## 构建项目
> 注意默认是angular4。和ng2简单区别是把动画模块从核心模块里面移除，以插件形式存在，打包压缩更精简了，为什么没有3，因为路由版本问题，angular为了统一命名，
angular4官方长期支持版本。

### 浏览器兼容性
> 学习一个新技术一定要了解它的支持程度，你才能对它根据自己产品需求进行选择，这是起码的要求。

![浏览器兼容性](https://camo.githubusercontent.com/efa5a8b6df23b248c39a72d85bc654db9a10def5/68747470733a2f2f73617563656c6162732e636f6d2f62726f777365722d6d61747269782f616e67756c6172322d63692e737667)

Safari (7+), iOS (7+), Edge (14) and IE mobile (11)

### 一个顺手编辑器
> 推荐`webstrom` or `vscode` 他们对TypeScript提示非常友好，webstrom和angular-cli深度集成。本项目使用webstrom2017.1.2版本，浏览器调试默认谷歌。

### 初始化一个angular4项目
```
如果用webstorm可以直接新建angular4项目，确定装好cli，新建项目适合就有选择angular-cli。
也可以命令行来新建项目
ng new PROJECT-NAME
等待出现
Successfully initialized git.
Installing packages for tooling via npm.
ps：传说会自动 npm install 安装依赖，不过我等了很久都没有安装，我就直接下一步了
cd PROJECT-NAME
进入项目目录以后，npm install，去干其他事吧。
ng serve
ps：默认不会自动打开浏览器，需要去package.json里面吧"start": "ng serve",改成"start": "ng serve --open",就好了。
默认地址：http://localhost:4200/
```

### cli目前不支持postcss
我给cli提了issues，官方回复我说下个版本支持。现在版本1.1.0@beta.0

我也是因为这个问题耽误了很久，admin里面我是直接改了，vue的webpack的config代码，才支持。

这个cli我也问了很多人，他们都无能为力，说只能自己去改cli，改cli有个问题，因为他在node_modules/@angular/cli里面的，我每次npm install都需要去改源码。

我用的[postcss-cssnext](https://github.com/MoOx/postcss-cssnext)，需要去安装一个npm install postcss-cssnext -D安装到devDependencies里面

找到这个文件
node_modules\@angular\cli\models\webpack-configs\styles.js

```
引入这个postcss-cssnext
const postcssCssnext = require('postcss-cssnext');

在当前页面找到这个postcssPluginCreator函数
它return是一个数组,这个数组是postcssPlugin列表

//autoprefixer(),
postcssCssnext({
  "autoprefixer": {
    "browsers": "ie >= 10, ..."
  },
  features: {
    rem: false
  }
}),
把原来autoprefixer注释掉，在postcssCssnext里面写，features这个是禁用rem转成px，里面有个工具插件会把rem转成px+rem，说兼容ie8+

postcssCssnext一些使用范例，[查看](http://cssnext.io/features/)，全是英文，为了自己方便阅读，我自己谷歌翻译一遍，勉强[看看](https://github.com/jiayisheji/blog/issues/4)
吧
```
现在已经上车了，可以发车了。

> 补充一下

如果我遇到一个这样的需求，因为Cssnext里面是面向未来的css4扩展的，里面的支持var等全局变量和@apply代码快，那么我希望有个公共的root.css来处理这个东西，方便以后整体处理。我需要怎么做了。（ps：被这个东西折磨了几天）

其实我在admin的vue-cli配置里面已经修改过了，postcssImport({ addDependencyTo: webpack })，有这行代码。

虽然我一开始在styles.js就加了这个东西，但是一直没有生效，不停地想办法找资料，试了各种插件，黄天有眼的，今天终于找到一个解决方案。
[https://github.com/postcss/postcss-loader/issues/8](https://github.com/postcss/postcss-loader/issues/8)

```
//webpack.config.js
    var postcssImport = require('postcss-import');
    ...
    postcss: function(webpack) {
        return [
            postcssImport({ addDependencyTo: webpack }), // Must be first item in list
            precss,
            autoprefixer
        ];
    },
```

上面注明要postcssImport({ addDependencyTo: webpack })要放在第一位
那么我要从新修改一下styles.js
```
const postcssPluginCreator = function (webpack) {
// 这里的webpack不是webpack包，是webpack配置和webpack监听的文件
        // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
        const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
        const minimizeOptions = {
            autoprefixer: false,
            safe: true,
            mergeLonghand: false,
            discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
        };
        return [
            postcssImport({ addDependencyTo: webpack }),  // 一定要放在第一位 先解析在做其他处理，还可以监听文件变化
            postcssUrl({   // angular-cli 不解释
                url: (URL) => {
                    // Only convert root relative URLs, which CSS-Loader won't process into require().
                    if (!URL.startsWith('/') || URL.startsWith('//')) {
                        return URL;
                    }
                    if (deployUrl.match(/:\/\//)) {
                        // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                        return `${deployUrl.replace(/\/$/, '')}${URL}`;
                    }
                    else if (baseHref.match(/:\/\//)) {
                        // If baseHref contains a scheme, include it as is.
                        return baseHref.replace(/\/$/, '') +
                            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                    }
                    else {
                        // Join together base-href, deploy-url and the original URL.
                        // Also dedupe multiple slashes into single ones.
                        return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                    }
                }
            }),
            postcssCssnext({   // 下一代css4语法工具
              "autoprefixer": {    // 浏览器加css3前缀
                "browsers": "ie >= 10, ..."
              },
              features: {   // 如果用rem，会自动编译对应的px，会有些问题。特别是js动态计算html的font-size时
                rem: false
              }
            })
        ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
    };
    postcssPluginCreator[eject_1.postcssArgs] = {
        variableImports: {
            'autoprefixer': 'autoprefixer',
            'postcss-url': 'postcssUrl',
            'postcss-import': 'postcssImport',      // 也不知道干嘛的，看上有就加上了
            'postcss-cssnext': 'postcssCssnext',      // 也不知道干嘛的，看上有就加上了
            'cssnano': 'cssnano'
        },
        variables: { minimizeCss, baseHref, deployUrl }
    };
```
现在终于可以玩转了postcss了。



