# Angular CLI 是什么？
Angular CLI 是一个命令行接口(Command Line Interface)，用于实现自动化开发工作流程。它允许你做以下这些事情：

. 创建一个新的 Angular 应用程序
. 运行带有 LiveReload 支持的开发服务器，以便在开发过程中预览应用程序
. 添加功能到现有的 Angular 应用程序
. 运行应用程序的单元测试
. 运行应用程序的端到端 (E2E) 测试
. 构建应用程序


# 前提条件
在使用 Angular CLI 之前，你必须确保系统中 Node.js 的版本高于 6.9.0 且 npm 的版本高于 3.0.0。

若你尚未安装 Node.js，你可以访问 Node.js 官网，然后根据你所用的操作系统选择对应的安装方式。

若你本机已经安装 Node.js 和 npm，你可以通过运行以下命令，确认一下当前环境信息：

$ node - v # 显示当前Node.js的版本
$ npm -v # 显示当前npm的版本
当你本机 Node.js 环境确认无误后，你可以在命令行使用 npm 安装 TypeScript：

$ npm install -g typescript # 安装最新的TypeScript稳定版

# Install

```sh
npm install -g @angular/cli
ng version

ng new my-dream-app
cd my-dream-app
ng serve
```

# 创建新的 Angular 应用程序

Angular CLI 为我们提供了两种方式，用于创建新的应用程序：

ng init - 在当前目录创建新的应用程序
ng new - 创建新的目录，然后在新建的目录中运行 ng init 命令
因此 ng new 与 ng init 的功能是相似的，只是 ng new 会为我们创建新的目录。

假设你还未创建新的目录，那么我们需要使用 ng new 命令来创建新的项目：

`$ ng new my-app`
当运行上面的命令后，将发生以下事情：

. 新的 my-app 目录被创建
. 应用程序相关的源文件和目录将会被创建
. 应用程序的所有依赖 (package.json中配置的依赖项) 将会被自动安装
. 自动配置项目中的 TypeScript 开发环境
. 自动配置 Karma 单元测试环境
. 自动配置 Protractor (end-to-end) 测试环境
. 创建 environment 相关的文件并初始化为默认的设置

## 可用选项

--dry-run: boolean, 默认为 false, 若设置 dry-run 则不会创建任何文件
--verbose: boolean, 默认为 false
--link-cli: boolean, 默认为 false, 自动链接到 @angular/cli 包
--skip-install: boolean, 默认为 false, 表示跳过 npm install
--skip-git: boolean, 默认为 false, 表示该目录不初始化为 git 仓库
--skip-tests: boolean, 默认为 false, 表示不创建 tests 相关文件
--skip-commit: boolean, 默认为 false, 表示不进行初始提交
--directory: string, 用于设置创建的目录名，默认与应用程序的同名
--source-dir: string, 默认为 'src', 用于设置源文件目录的名称
--style: string, 默认为 'css', 用于设置选用的样式语法 ('css', 'less' or 'scss')
--prefix: string, 默认为 'app', 用于设置创建新组件时，组件选择器使用的前缀
--mobile: boolean, 默认为 false,表示是否生成 Progressive Web App 应用程序
--routing: boolean, 默认为 false, 表示新增带有路由信息的模块，并添加到根模块中
--inline-style: boolean, 默认为 false, 表示当创建新的应用程序时，使用内联样式
--inline-template: boolean, 默认为 false, 表示当创建新的应用程序时，使用内联模板
除此之外，你可以在本机上运行 ng generate --help 查看更多的可用选项。接下来让我们来看一下如何运行应用程序。


# 运行应用程序

首先进入使用 Angular CLI 创建的应用程序目录，例如：

$ cd my-app
然后运行：

$ ng serve
当运行上面的命令后，将发生以下事情：

Angular CLI 从 .angular-cli.json 文件中加载配置信息
Angular CLI 运行 Webpack 打包相关 JavaScript 和 CSS 文件
Angular CLI 启动 webpack dev server 本地开发服务器，默认的地址是 localhost:4200
若要停止应用程序，你可以使用 ctrl+c 快捷键。

# 添加功能到现有的 Angular 应用程序

你可以使用 ng generate 命令，为已有的 Angular 应用程序添加新的功能。

ng generate class my-new-class: 新建 class
ng generate component my-new-component: 新建组件
ng generate directive my-new-directive: 新建指令
ng generate enum my-new-enum: 新建枚举
ng generate module my-new-module: 新建模块
ng generate pipe my-new-pipe: 新建管道
ng generate service my-new-service: 新建服务
ng generate 命令与其它的子命令一样，也有快捷键，具体如下：

ng g cl my-new-class: 新建 class
ng g c my-new-component: 新建组件
ng g d my-new-directive: 新建指令
ng g e my-new-enum: 新建枚举
ng g m my-new-module: 新建模块
ng g p my-new-pipe: 新建管道
ng g s my-new-service: 新建服务


## 添加新的类

为了添加类名为 UserProfile 类，我们可以运行：

$ ng generate class user-profile
Angular CLI 会自动调整文件名和类名的字母大小写，因此以下命令具有相同的效果：

$ ng generate class user-profile
$ ng generate class userProfile
$ ng generate class UserProfile
运行上述命令后，在幕后将发生以下事情：

在 src/app 目录下将创建一个 user-profile.ts 文件，该文件导出一个名为 UserProfile 的类
可用选项
--spec: boolean, 默认为 false, 表示是否生成单元测试相关的 spec 文件

### 使用示例
#### Generate class 'UserProfile'
$ ng generate class user-profile

#### Generate class 'UserProfile' with unit test
$ ng generate class user-profile --spec

## 添加新的组件

若想创建一个选择器为 app-site-header 的组件，则可以运行：

$ ng generate component site-header
installing component
  create src/app/site-header/site-header.component.css
  create src/app/site-header/site-header.component.html
  create src/app/site-header/site-header.component.spec.ts
  create src/app/site-header/site-header.component.ts
  update src/app/app.module.ts
Angular CLI 将自动调整文件名和组件名称的字母大小写，并将前缀应用于组件选择器，因此以下命令具有相同的效果：

$ ng generate component site-header
$ ng generate component siteHeader
$ ng generate component SiteHeader
运行上述命令后，在幕后将发生以下事情：

src/app/site-header 目录被创建
site-header 目录下会生成以下四个文件：

CSS 样式文件，用于设置组件的样式
HTML 模板文件，用于设置组件的模板
TypeScript 文件，里面包含一个 SiteHeaderComponent 组件类和组件的元信息
Spec 文件，包含组件相关的测试用例
SiteHeaderComponent 组件会被自动地添加到最近模块 @NgModule 装饰器的 declarations 属性中。

### 可用选项

--flat: boolean, 默认为 false, 表示在 src/app 目录下生成组件而不是在 src/app/site-header 目录中
--inline-template: boolean, 默认为 false, 表示使用内联模板而不是使用独立的模板文件
--inline-style: boolean, 默认为 false, 表示使用内联样式而不是使用独立的样式文件
--prefix: boolean, 默认为 true, 使用 .angular-cli.json 配置的前缀作为组件选择器的前缀
--spec: boolean, 默认为 true, 表示生成包含单元测试的 spec 文件
--view-encapsulation: string, 用于设置组件的视图封装策略
--change-detection: string, 用于设置组件的变化检测策略

### 使用示例

#### Generate component 'site-header'

$ ng generate component site-header

#### Generate component 'site-header' with inline template and inline styles
$ ng generate component site-header --inline-template --inline-style

## 添加新的指令
若想创建一个选择器为 appAdminLink 的指令，则可以运行：

$ ng generate directive admin-link
installing directive
  create src/app/admin-link.directive.spec.ts
  create src/app/admin-link.directive.ts
  update src/app/app.module.ts
Angular CLI 将自动调整文件名和指令名称的字母大小写，并将前缀应用于指令选择器，因此以下命令具有相同的效果：

$ ng generate directive admin-link
$ ng generate directive adminLink
$ ng generate directive AdminLink
运行上述命令后，在幕后将发生以下事情：

src/app/admin-link.directive.ts 文件被创建，该文件导出一个名为 AdminLinkDirective 且选择器为 appAdminLink 的指令
src/app/admin-link.directive.spec.ts 文件被创建，该文件包含指令相关的单元测试信息
AdminLinkDirective 指令会被自动地添加到最近模块 @NgModule 装饰器的 declarations 属性中。

### 可用选项
--flat: boolean, 默认为 true, 表示在 src/app 目录中生成指令而不是在 src/app/admin-link 目录下
--prefix: boolean, 默认为 true, 使用 .angular-cli.json 配置的前缀作为指令选择器的前缀
--spec: boolean, 默认为 true, 表示生成包含单元测试的 spec 文件
### 使用示例
#### Generate directive 'adminLink'
$ ng generate directive admin-link

#### Generate directive 'adminLink' without unit test
$ ng generate directive admin-link --spec=false
添加新的枚举
若想创建一个名为 Direction 的枚举类 ，则可以运行：

$ ng generate enum direction
installing enum
  create src/app/direction.enum.ts
Angular CLI 会自动调整文件名和枚举名称的字母大小写，因此以下命令具有相同的效果：

$ ng generate enum direction
$ ng generate enum Direction
运行上述命令后，在幕后将发生以下事情：

src/app.direction.enum.ts 文件被创建，该文件导出名为 Direction 的枚举

## 添加新的模块

若想创建一个新的模块 ，则可以运行：

$ ng generate module admin
installing module
  create src/app/admin/admin.module.ts
运行上述命令后，在幕后将发生以下事情：

src/app/admin 目录被创建
在 src/app/admin/admin.module.ts 文件中，AdminModule 模块被创建
需要注意的是，新增的模块不会被自动添加到 src/app/app.module.ts 文件中的 AppModule 模块中，用户可以根据具体需求导入对应的模块。

若要在其它模块中导入刚才新增的模块，可以在 @NgModule 的 imports 属性中设定该新增的模块。具体示例如下：

import { AdminModule } from './admin/admin.module';

@NgModule({
  // ...
  imports: [
    AdminModule
  ]
})
export class AppModule { }

### 可用选项
--routing: boolean, 默认为 false, 表示生成一个额外包含路由信息的 AdminRoutingModule 模块，且该模块会被自动地导入到新建的模块中
--spec: boolean, 默认为 false, 表示添加 src/app/admin/admin.module.spec.ts 单元测试文件

### 使用示例

#### Add module 'admin'
$ ng generate module admin

#### Add module 'admin' with additional module containing routing information
$ ng generate module admin --routing

## 添加新的管道

若想创建一个名为 convertToEuro 的管道 ，则可以运行：

$ ng generate pipe convert-to-euro
installing pipe
  create src/app/convert-to-euro.pipe.spec.ts
  create src/app/convert-to-euro.pipe.ts
  update src/app/app.module.ts
Angular CLI 会自动调整文件名和管道名称的字母大小写，因此以下命令具有相同的效果：

$ ng generate pipe convert-to-euro
$ ng generate pipe convertToEuro
$ ng generate pipe ConvertToEuro
运行上述命令后，在幕后将发生以下事情：

src/app/convert-to-euro.pipe.ts 文件被创建，该文件导出一个名为 ConvertToEuroPipe 的管道类
src/app/convert-to-euro.pipe.spec.ts 文件被创建，该文件包含管道相关的单元测试信息
CovertToEuroPipe 管道会被自动地添加到最近模块 @NgModule 装饰器的 declarations 属性中。

### 可用选项

--flat: boolean, 默认为 true, 表示在 src/app 目录中生成管道而不是在 src/app/convert-to-euro 目录下
--spec: boolean, 默认为 true, 表示生成包含单元测试的 spec 文件

### 使用示例

#### Generate pipe 'convertToEuro' with spec and in /src/app directory
$ ng generate pipe convert-to-euro

#### Generate pipe 'convertToEuro' without spec and in /src/app/convert-to-euro directory
$ ng generate pipe convert-to-euro --spec=false --flat=false

## 添加新的服务
若想创建一个名为 BackendApiService 的服务 ，则可以运行：

$ ng generate service backend-api
installing service
  create src/app/backend-api.service.spec.ts
  create src/app/backend-api.service.ts
  WARNING Service is generated but not provided, it must be provided to be used
Angular CLI 会自动调整文件名和服务名称的字母大小写，因此以下命令具有相同的效果：

$ ng generate service backend-api
$ ng generate service backendApi
$ ng generate service BackendApi
运行上述命令后，在幕后将发生以下事情：

src/app/backend-api.service 文件被创建，该文件导出一个名为 BackendApiService 的服务类
src/app/back-api.service.spec.ts 文件被创建，该文件包含管道相关的单元测试信息
需要注意的是，Angular CLI 会提醒用户服务已成功创建，但尚未配置该服务。用户可以根据具体需求在模块或组件的 providers 属性中配置该新建的服务。具体示例如下：

import { BackendApiService } from './backend-api.service';

@NgModule({
  // ...
  providers: [BackendApiService],
  bootstrap: [AppComponent]
})

### 可用选项
--flat: boolean, 默认为 true, 表示在 src/app 目录中生成服务而不是在 src/app/backend-api 目录下
--spec: boolean, 默认为 true, 表示生成包含单元测试的 spec 文件

### 使用示例
#### Generate service with DI token 'BackendApiService' in /src/app directory
$ ng generate service backend-api

#### Generate service with DI token 'BackendApiService' in /src/app/backend-api directory
$ ng generate service backend-api --flat=false

## 运行单元测试
Angular CLI 在新建项目的时候，自动为我们集成了 Karma test runner 测试框架。当添加新的功能时，我们可以利用 --spec 选项，告诉 Angular CLI 让它为我们生成功能相关的 .spec.ts 测试单元测试文件。

spec 文件在 src 目录中相应功能的同一目录下创建，这使得我们可以在使用功能时轻松找到它们。

若要运行单元测试，则可以运行：

$ ng test
此时在你的控制台将输出以下信息：

$ ng test
[karma]: No captured browser, open http://localhost:9876/
[karma]: Karma v1.4.1 server started at http://0.0.0.0:9876/
[launcher]: Launching browser Chrome with unlimited concurrency
[launcher]: Starting browser Chrome
运行上述命令后，在幕后将发生以下事情：

Angular CLI 从 .angular-cli.json 文件中加载配置信息
Angular CLI 基于 .angular-cli.json 文件中的 Karma 相关的配置信息，运行 Karma。Karma 的配置文件默认在根目录下，文件名为 karma.conf.js 。
Karma 打开配置中设定的浏览器，默认是 Chrome。
Karma 然后指示浏览器 (Chrome) 使用 Karma 配置中指定的测试框架运行 src/test.ts。默认情况下，采用的是 Jasmine 框架。创建应用程序时，会自动创建 src/test.ts 文件。它预先配置为加载和配置测试Angular 应用程序所需的代码，并运行 src 目录中以 .spec.ts 结尾的所有文件。
Karma 将测试结果报告给控制台。
Karma 监听 src 目录下的文件的变化，然后自动运行单元测试。
运行 End-to-End 测试
若要运行 e2e 测试，则可以运行：

$ ng e2e

## 构建应用程序

若要构建应用程序，则可以运行：

$ ng build
运行上述命令后，在幕后将发生以下事情：

Angular CLI 从 .angular-cli.json 文件中加载配置信息
Angular CLI 运行 Webpack 打包项目相关的 JavaScript 与 CSS 文件
打包后的资源，将被输出到配置文件中 outDir 所指定的目录，默认是输出到 dist 目录

### 可用选项

--aot: 开启 ahead-of-time 编译
--base-href: string, 设置 index.html 文件中 <base> 元素的链接地址
--environment: string, 设置所使用的环境，默认为 dev
--output-path: string, 设置输出的路径
--target: string, 设置所使用的环境，默认为 development
--watch: boolean, 默认为 false, 开启 watch 模式，监听文件异动并自动重新构建
Targets
指定 target 的值，会影响到构建流程的运行方式。它的可选值：

development: 默认的模式，意味着不进行代码压缩或混淆
production: 压缩和混淆代码
若需使用 production 模式，构建应用程序，则可以运行：

$ ng build --target=production

## Environments
Environments 让你能够自定义应用程序行为。

你可以在 .angular-cli.json 文件中定义自己的 environments 文件。默认的是：

dev：environments/environment.ts
export const environment = {
  production: false
};
prod：environments/environment.prod.ts
export const environment = {
  production: true
};
需要注意的是，构建流程默认使用 dev 环境。

如果指定了不同的环境，构建过程将使用相应的环境：

#### Uses environments/environment.ts
$ ng build

#### Also uses environments/environment.ts
$ ng build --environment=dev
$ ng build --env=dev

#### Uses environments/environment.prod.ts
$ ng build --environment=prod
$ ng build --env=prod
正如你在 src/main.ts 文件中看到的，通过导入 ./environments/environment 文件，我们就可以访问到 environment 相关的配置信息，具体如下：

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

## 自定义构建流程

从 v1.0 开始，Angular CLI 提供了一个命令，用于将你的应用程序与 Angular CLI 分离。

默认情况下，Angular CLI 为您管理基础 Webpack 配置，因此您无需处理其复杂性。如果你希望手动配置webpack，并且您不再需要在Angular应用程序中使用Angular CLI，则可以运行：

$ ng eject
此时在你的控制台将输出以下信息：

==========================================================================================
Ejection was successful.

To run your builds, you now need to do the following commands:
   - "npm run build" to build.
   - "npm run test" to run unit tests.
   - "npm start" to serve the app using webpack-dev-server.
   - "npm run e2e" to run protractor.

Running the equivalent CLI commands will result in an error.

==========================================================================================
Some packages were added. Please run "npm install".
运行上述命令后，在幕后将发生以下事情：

ejected: true 的属性被添加到 .angular-cli.json 文件中
在应用程序的根目录下将生成独立的 webpack.config.js 文件，因此你可以在没有使用 Angular CLI 的环境下构建项目
package.json 中的构建脚本会被更新，因此你可以运行 npm run build 来构建项目
package.json 中的测试脚本会被更新，因此你可以运行 npm run test 来运行单元测试
package.json 中的启动脚本会被更新，因此你可以运行 npm run start 或 npm start 来启动开发服务器
package.json 中的 e2e 脚本会被更新，因此你可以运行 npm run e2e 来运行 End-to-End 测试
把应用程序与 Angular CLI 分离后，你就可以根据自己的要求自定义 Webpack 的配置。