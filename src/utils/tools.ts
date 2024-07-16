import dayjs from "dayjs";
import { consola } from "consola";
const chalk = require("chalk");
const _ = require("lodash");

export class Tools {
  static formatTime(time: dayjs.Dayjs) {
    return time.format("YYYY-MM-DD h:mm:ss");
  }

  static formatTimestamp(time: dayjs.Dayjs) {
    return time.format("YYYY-MM-DD h:mm:ss.SSS");
  }

  static formatNowTime() {
    return Tools.formatTime(dayjs());
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

  private static printDivider(cb: Function, isSucceed: boolean, len = 50) {
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
