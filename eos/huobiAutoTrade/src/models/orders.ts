import * as mongoose from 'mongoose';
/**
 * 定义接口
 */
export type OrderModel = mongoose.Document & {
  buyId:string;
  buyPrice:number; // Math.floor /10000
  buyState:string;
  //buyAmount:number; // coins after tax Math.floor /10000
  //buyTax:number; // Math.floor /10000

  sellId:string;
  sellPrice:number;
  sellState:string;
  //sellAmount:number; // money after tax
  //sellTax:number;
  step:number;
  stepState:string; // on /off 当前阶梯完成了吗
  profit:number; // lirun
  orderType:string;
  buyTime:number;
  sellTime:number;
  ts:number;
}

const orderSchema = new mongoose.Schema({
    buyId: {
        type: String,
        required: true,
      },
    buyPrice: {
        type: Number,
        required: true,
      },
    buyState: {
        type: String,
        required: true,
      },
      sellId: {
        type: String,
        required: true,
      },
      sellPrice: {
        type: Number,
        required: true,
      },
      sellState: {
        type: String,
        required: true,
      },
      step: {
        type: Number,
        required: true,
      },
      stepState: {
        type: String,
        required: true,
      },
      profit: {
        type: Number,
        required: true,
      },
      buyTime: {
        type: Number,
        default: 0
      },
      sellTime: {
        type: Number,
        default: 0
      },
      ts: {
        type: Number,
        default: ()=> new Date().getTime()
      },
      orderType: {
        type: String,
        default: 'boduan'
      },
})
export default orderSchema;