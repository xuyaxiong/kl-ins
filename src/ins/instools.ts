const _ = require("lodash");

export default class InsTools {
  private static SEND_NO = -1;

  public static numToLoHi(num: number): number[] {
    return [num % 256, Math.floor(num / 256)];
  }
  public static loHiToNum(lo: number, hi: number): number {
    return lo + hi * 256;
  }
  public static float32ToByteArr(num: number) {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setFloat32(0, num);
    return Array.from(new Uint8Array(buffer)).reverse();
  }

  public static byteArrToFloat32(bytes: number[]) {
    bytes = bytes.reverse();
    const view = new DataView(new ArrayBuffer(bytes.length));
    for (let i = 0; i < bytes.length; i++) {
      view.setUint8(i, bytes[i]);
    }
    return view.getFloat32(0);
  }

  public static strip(data: number[]): number[] {
    data = _.drop(data, 7);
    data = _.dropRight(data, 2);
    return data;
  }

  public static arrToHexStr(arr: number[]) {
    return arr.map((num) => _.padStart(num.toString(16), 2, "0")).join(" ");
  }

  public static getSendNo() {
    InsTools.SEND_NO = (InsTools.SEND_NO + 1) % 256;
    return InsTools.SEND_NO;
  }

  public static hexStringToBuffer(hexStr: string) {
    return Buffer.from(hexStr.replace(/ /g, ""), "hex");
  }
}
