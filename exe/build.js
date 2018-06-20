const { compile } = require('nexe');

compile({
  input: './app.js',
  name:'app.linux1.8.9.4',
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