import * as fs from "fs";
import dayjs from 'dayjs';
import { consola } from "consola";
const chalk = require("chalk");
const _ = require("lodash");

export class Tools {
  static lOG_STATUS = true;

  static float64ArrToBuffer(arr: number[]) {
    return Buffer.from(Float64Array.from(arr).buffer);
  }
  static bufferToFloat64Arr(buffer: Buffer): number[] {
    return Array.from(new Float64Array(buffer.buffer));
  }
  static float32ArrToBuffer(arr: number[]) {
    return Buffer.from(Float32Array.from(arr).buffer);
  }
  static bufferToFloat32Arr(buffer: Buffer): number[] {
    return Array.from(new Float32Array(buffer.buffer));
  }
  static intArrToBuffer(arr: number[]) {
    return Buffer.from(Int32Array.from(arr).buffer);
  }
  static bufferToIntArr(buffer: Buffer): number[] {
    return Array.from(new Int32Array(buffer.buffer));
  }

  static ensurePath(path: string) {
    return new Promise<void>(async (resolve) => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      resolve();
    });
  }

  static formatTime(time: dayjs.Dayjs) {
    return time.format("YYYY-MM-DD h:mm:ss");
  }

  static formatTimestamp(time: dayjs.Dayjs) {
    return time.format("YYYY-MM-DD h:mm:ss.SSS");
  }

  static formatNowTime() {
    return Tools.formatTime(dayjs());
  }

  static formatNowTimeV2() {
    return dayjs().format("YYYYMMDDHHmmss");
  }

  static formatNowTimestamp() {
    return Tools.formatTimestamp(dayjs());
  }

  static sleep(ms: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  public static logKVSuccess(key: string, val: string, len = 50) {
    Tools.printDivider(
      () => {
        Tools._logKV(key, val, true);
      },
      true,
      len
    );
  }

  public static logKVFail(key: string, val: string, len = 50) {
    Tools.printDivider(
      () => {
        Tools._logKV(key, val, false);
      },
      false,
      len
    );
  }

  private static _logKV(key: string, val: string, isSucceed: boolean) {
    const type = isSucceed ? chalk.green : chalk.red;
    console.log(`${chalk.bold.blue(key)}: ${type(val)}`);
  }

  private static printDivider(cb, isSucceed: boolean, len = 50) {
    const type = isSucceed ? chalk.green : chalk.red;
    console.log(type(_.repeat("*", len)));
    cb && cb();
    console.log(type(_.repeat("*", len)));
  }

  public static box(title: string, message: string) {
    consola.box({
      title,
      message,
      style: {
        padding: 1,
        borderColor: "green",
        borderStyle: "singleThick",
      },
    });
  }
}
