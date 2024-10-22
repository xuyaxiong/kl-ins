const _ = require("lodash");
const assert = require("assert");

export default class InsTools {
  private static SEND_NO = -1;

  /**
   * 获取指令发送序号
   */
  public static getSendNo() {
    InsTools.SEND_NO = (InsTools.SEND_NO + 1) % 256;
    return InsTools.SEND_NO;
  }

  /**
   * 将长度转换为低字节和高字节
   */
  public static lenToLoHi(len: number): number[] {
    return [len % 256, Math.floor(len / 256)];
  }

  /**
   * 将低字节和高字节换算成长度
   */
  public static loHiToLen(lo: number, hi: number): number {
    return lo + hi * 256;
  }

  /**
   * 将一个float型数字转换成数组
   */
  public static float32ToByteArr(num: number) {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setFloat32(0, num);
    return Array.from(new Uint8Array(buffer)).reverse();
  }

  /**
   * 将数组转换成一个float型数字
   */
  public static byteArrToFloat32(bytes: number[]) {
    assert(bytes.length === 4, "字节数组长度应为4");
    bytes = bytes.reverse();
    const view = new DataView(new ArrayBuffer(bytes.length));
    for (let i = 0; i < bytes.length; i++) {
      view.setUint8(i, bytes[i]);
    }
    return view.getFloat32(0);
  }

  /**
   * 将数组转换成16进制字符串
   */
  public static byteArrToHexStr(arr: number[]) {
    assert(
      arr.every((num) => num < 256 && num >= 0),
      "数值大小超限"
    );
    return arr.map((num) => _.padStart(num.toString(16), 2, "0")).join(" ");
  }

  /**
   * 将16进制字符串转换成数组
   */
  public static hexStringToBuffer(hexStr: string) {
    return Buffer.from(hexStr.replace(/ /g, ""), "hex");
  }

  /**
   * 从返回数据中提取出payload数组
   */
  public static getPayloadFromResp(data: number[] | Buffer) {
    if (data instanceof Buffer) data = Array.from(data);
    const lenLo = data[2];
    const lenHi = data[3];
    const len = InsTools.loHiToLen(lenLo, lenHi);
    data = data.slice(0, len);
    data = _.drop(data, 7);
    data = _.dropRight(data, 2);
    return data;
  }
}
