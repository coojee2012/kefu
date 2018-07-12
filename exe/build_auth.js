const { compile } = require('nexe');

compile({
  input: './dist/encrypt.js',
  //name:'fcTrade',
  output:'./deploy/fcauth',
  ico:'./ooo.ico',
  //resources:['./config.ini','./ooo.ico'],
  //build: true, //required to use patches
  target:'windows-x64.8.9.4',
//   patches: [
//     async (compiler, next) => {
//       await compiler.setFileContentsAsync(
//         'lib/new-native-module.js',
//         'module.exports = 42'
//       )
//       return next()
//     }
//   ]
}).then(() => {
  console.log('success')
})