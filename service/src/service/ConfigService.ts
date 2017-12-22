import { Injectable , Injector } from 'injection-js';
import { LoggerService } from './LogService';
import devConfig from '../config/app_dev';
import testConfig from '../config/app_test';
import stageConfig from '../config/app_stage';
import prodConfig from '../config/app_prod';


@Injectable()
export class ConfigService {
    constructor(private logger:LoggerService){

    }
    getConfig(){
        const { NODE_ENV } = process.env;
        let config;
<<<<<<< HEAD
        this.logger.info(`系统运行环境为：${NODE_ENV}`);
=======
        this.logger.info(`获取系统配置，当前运行环境为：${NODE_ENV}`);
>>>>>>> 822401ac539b4922aa7886f524c7210dbd49bf2d
        switch(NODE_ENV){
            case 'development':
            config =  devConfig;
            break;
            case 'test':
            config =  testConfig;
            break;
            case 'stage':
            config =  stageConfig;
            break;
            case 'prod':
            config =  prodConfig;
            break;
            default:
            config =  devConfig;
            break;
        }
        return config;
    }
}