#windows开发环境部署

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
