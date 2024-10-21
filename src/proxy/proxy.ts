import dayjs from "dayjs";
const chalk = require("chalk");
const _ = require("lodash");
import Ins from "../ins/base";
import InsTools from "../ins/instools";
import Tools from "../utils/tools";

export default class Proxy {
  protected resolve: Function | undefined = undefined;
  protected latestSendNo = -1;
  protected plcReportDataHandler: Function | undefined;
  protected LOG = true;
  protected end: any;

  public setPlcReportDataHandler(handler: Function) {
    this.plcReportDataHandler = handler;
  }

  protected getResolve() {
    return this.resolve;
  }

  protected getLatestSendNo() {
    return this.latestSendNo;
  }

  public async sendIns(ins: Ins) {
    ins.fillingData();
    if (ins.isSync()) {
      if (this.LOG) return await this.sendInsSyncWithLog(ins);
      else return await this.sendInsSync(ins);
    } else {
      this.sendInsWithoutResp(ins);
    }
  }

  public stopLogging() {
    this.LOG = false;
  }

  public startLogging() {
    this.LOG = true;
  }

  protected preprocessData(data: Buffer) {
    // console.log('收到原始数据data:', data);
    let dataArr: number[] = Array.from(data);
    const len = InsTools.loHiToLen(dataArr[2], dataArr[3]);
    dataArr = dataArr.slice(0, len);
    // console.log('截取后数据dataArr:', dataArr);
    const receiveModuleNum = dataArr[4];
    const receiveNum = dataArr[5] - 0x80;
    return { strippedData: dataArr, receiveModuleNum, receiveNum };
  }

  // 同步发送
  private async sendInsSync(ins: Ins): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.latestSendNo = ins.getSendNo();
      this._send(ins);
      this.resolve = resolve;
      setTimeout(() => {
        reject(false);
      }, ins.getTimeout());
    });
  }

  private async sendInsSyncWithLog(ins: Ins): Promise<Buffer> {
    try {
      console.log(_.repeat("*", 88));
      const startTime = this._logBeforeSend(ins);
      const result = await this.sendInsSync(ins);
      let resultArr = Array.from(result);
      const lenLo = resultArr[2];
      const lenHi = resultArr[3];
      const len = lenLo + lenHi * 256;
      resultArr = resultArr.slice(0, len);
      this._logAfterSend(resultArr, startTime);
      return result;
    } catch (error) {
      console.log(chalk.bold.bgRed("指令超时"));
      throw new Error("指令超时");
    } finally {
      console.log(_.repeat("*", 88));
    }
  }

  private sendInsWithoutResp(ins: Ins) {
    console.log(_.repeat("*", 88));
    this._logBeforeSend(ins);
    this._send(ins);
    console.log(_.repeat("*", 88));
  }

  private async _send(ins: Ins) {
    console.log("发送HEX数据:", chalk.yellow(ins.toHexString()));
    console.log("detail:", chalk.cyan(ins.detail()));
    this.end.sendData(ins.toUint8Array());
  }

  private _logBeforeSend(ins: Ins) {
    const startTime = dayjs();
    console.log(chalk.bold.bgWhite(ins.getName()));
    console.log("发送时间:", Tools.formatTimestamp(startTime));
    console.log(`发送数据: ${chalk.green(ins.toUint8Array())}`);
    return startTime;
  }

  private _logAfterSend(resultArr: number[], startTime: dayjs.Dayjs) {
    console.log(`接收数据: ${chalk.blue(resultArr.join(","))}`);
    console.log(
      `接收Hex数据: ${chalk.magentaBright(InsTools.byteArrToHexStr(resultArr))}`
    );
    const endTime = dayjs();
    console.log("接收时间:", Tools.formatTimestamp(endTime));
    console.log(`消耗时间: ${chalk.red(endTime.diff(startTime) + "ms")}`);
  }
}
