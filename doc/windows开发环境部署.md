#windows开发环境部署


## 一、安装环境
> 1、本机系统：Windows 10 Pro（64位）
> 2、Node.js：v6.9.2LTS（64位）

## 二、安装Node.js步骤
> 1、下载对应你系统的Node.js版本:https://nodejs.org/en/download/
> 2、选安装目录进行安装
> 3、环境配置
> 4、测试

## 三、环境配置
>说明：这里的环境配置主要配置的是npm安装的全局模块所在的路径，以及缓存cache的路径，之所以要配置，是因为以后在执行类似：npm install express [-g] （后面的可选参数-g，g代表global全局安装的意思）的安装语句时，会将安装的模块安装到【C:\Users\用户名\AppData\Roaming\npm】路径中，占C盘空间。
例如：我希望将全模块所在路径和缓存路径放在我node.js安装的文件夹中，则在我安装的文件夹【D:\Develop\nodejs】下创建两个文件夹【node_global】及【node_cache】创建完两个空文件夹之后，打开cmd命令窗口，输入

npm config set prefix "D:\Develop\nodejs\node_global"
npm config set cache "D:\Develop\nodejs\node_cache"

接下来设置环境变量，关闭cmd窗口，“我的电脑”-右键-“属性”-“高级系统设置”-“高级”-“环境变量”


进入环境变量对话框，在【系统变量】下新建【NODE_PATH】，输入【D:\Develop\nodejs\node_global\node_modules】，将【用户变量】下的【Path】修改为【D:\Develop\nodejs\node_global】

## node c++编译环境 node-gyp故障问题
node-gyp rebuild 的故障解决办法
1 首先清除根目录下的.node-gyp  
卸载node-gyp模块   
npm uninstall node-gyp -g

2 安装环境 
npm i -g windows-build-tools
重新安装node-gyp
npm install -g node-gyp

3 设置python版本
npm iconfig set python python
4 安装.net 2.0 
5 安装vs 201*  c++  环境

6 安装microtime运行时
npm i microtime --save-dev
