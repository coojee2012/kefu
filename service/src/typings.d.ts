/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare namespace KeFu {
  interface IConfig {

  }
}

declare module 'KeFu' {
  var deepstream: KeFu.IConfig;
  export = deepstream;
}