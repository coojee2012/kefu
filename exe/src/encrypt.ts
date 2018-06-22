import { LoggerService } from './LogService';
import { readFile, readFileSync } from 'fs';
import { ParserIni } from './ParserIni';
import { Endecrypt } from './Endecrypt';


const logger = new LoggerService();
const Parser = new ParserIni();
const encrypt = new Endecrypt();

const configs = Parser.parse(readFileSync(`auth.ini`, 'utf8'));
const { key ,amount } =  configs.Main;

const authstr = encrypt.encrypt(`${key}++${amount}`,'fcoin is good');
logger.info(`${key}的授权码:${authstr}`);