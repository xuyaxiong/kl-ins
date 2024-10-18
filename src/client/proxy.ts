import dayjs from "dayjs";
const chalk = require("chalk");
const _ = require("lodash");
import { Instruction } from "../ins/base";
import { InstructionTools } from "../ins/instools";
import { Tools } from "../utils/tools";
import { isSync } from "../ins/decorator";
import { TCPClient } from "./client";

export class PlcTcpProxy {
  private resolve: Function | undefined = undefined;
  private latestSendNo = -1;
  private plcReportDataHandler: Function | undefined;
  private LOG = true;
  private client: TCPClient;

  public async connect() {
    await this.client.connect();
  }

  public constructor(name: string, host: string, port: number) {
    this.client = new TCPClient(name, { host, port }, async (data: Buffer) => {
      // 数据处理
      // console.log('收到原始数据data:', data);
      let dataArr: number[] = Array.from(data);
      const len = InstructionTools.loHiToNum(dataArr[2], dataArr[3]);
      dataArr = dataArr.slice(0, len);
      // console.log('截取后数据dataArr:', dataArr);
      const receiveModuleNum = dataArr[4];
      const receiveNum = dataArr[5] - 0x80;
      // const receiveNum = dataArr[5];
      if (isSync(receiveModuleNum, receiveNum)) {
        const receiveSendNo = dataArr[6];
        if (this.getLatestSendNo() === receiveSendNo) {
          const resolve = this.getResolve();
          resolve?.(data);
        }
      } else {
        // plc to server
        if (this.plcReportDataHandler)
          await this.plcReportDataHandler({
            moduleNum: receiveModuleNum,
            instructionNum: receiveNum,
            data: dataArr,
          });
      }
    });
  }

  public setPlcReportDataHandler(handler: Function) {
    this.plcReportDataHandler = handler;
  }

  public getResolve() {
    return this.resolve;
  }

  public getLatestSendNo() {
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
    this.client.sendData(instruction.toUint8Array());
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
