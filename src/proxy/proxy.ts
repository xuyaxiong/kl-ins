import dayjs from "dayjs";
const chalk = require("chalk");
const _ = require("lodash");
import { Instruction } from "../ins/base";
import { InstructionTools } from "../ins/instools";
import { Tools } from "../utils/tools";

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

  public async sendInstruction(instruction: Instruction) {
    instruction.fillingData();
    if (instruction.isSync()) {
      if (this.LOG) return await this.sendInstructionSyncWithLog(instruction);
      else return await this.sendInstructionSync(instruction);
    } else {
      this.sendInstructionWithoutResp(instruction);
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
    const len = InstructionTools.loHiToNum(dataArr[2], dataArr[3]);
    dataArr = dataArr.slice(0, len);
    // console.log('截取后数据dataArr:', dataArr);
    const receiveModuleNum = dataArr[4];
    const receiveNum = dataArr[5] - 0x80;
    return { strippedData: dataArr, receiveModuleNum, receiveNum };
  }

  // 同步发送
  private async sendInstructionSync(instruction: Instruction): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.latestSendNo = instruction.getSendNo();
      this._send(instruction);
      this.resolve = resolve;
      setTimeout(() => {
        reject(false);
      }, instruction.getTimeout());
    });
  }

  private async sendInstructionSyncWithLog(
    instruction: Instruction
  ): Promise<Buffer> {
    try {
      console.log(_.repeat("*", 88));
      const startTime = this._logBeforeSend(instruction);
      const result = await this.sendInstructionSync(instruction);
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

  private sendInstructionWithoutResp(instruction: Instruction) {
    console.log(_.repeat("*", 88));
    this._logBeforeSend(instruction);
    this._send(instruction);
    console.log(_.repeat("*", 88));
  }

  private async _send(instruction: Instruction) {
    console.log(
      "发送HEX数据:",
      chalk.yellow(InstructionTools.arrToHexStr(instruction.toArr()))
    );
    this.end.sendData(instruction.toUint8Array());
  }

  private _logBeforeSend(instruction: Instruction) {
    const startTime = dayjs();
    console.log(chalk.bold.bgWhite(instruction.getName()));
    console.log("发送时间:", Tools.formatTimestamp(startTime));
    console.log(`发送数据: ${chalk.green(instruction.toUint8Array())}`);
    return startTime;
  }

  private _logAfterSend(resultArr: number[], startTime: dayjs.Dayjs) {
    console.log(`接收数据: ${chalk.blue(resultArr.join(","))}`);
    console.log(
      `接收Hex数据: ${chalk.magentaBright(
        InstructionTools.arrToHexStr(resultArr)
      )}`
    );
    const endTime = dayjs();
    console.log("接收时间:", Tools.formatTimestamp(endTime));
    console.log(`消耗时间: ${chalk.red(endTime.diff(startTime) + "ms")}`);
  }
}
