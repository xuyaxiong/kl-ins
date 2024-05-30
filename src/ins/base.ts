import { InstructionTool } from "./tool";
export abstract class Instruction {
  public static NAME: string;
  public static MODULE_NUM: number;
  public static NUM: number;
  public static IS_SYNC: boolean;
  public static TIMEOUT: number;

  protected header = [0x55, 0xaa]; // 数据头
  protected footer = [0x0d, 0x0a]; // 校验位
  protected _data: number[];
  protected _sendNo: number; // 发送编号

  protected constructor() {
    this._data = [];
    this._sendNo = InstructionTool.getSendNo();
  }

  public toArr(): number[] {
    return this._data;
  }

  public toUint8Array(): Uint8Array {
    return new Uint8Array(Buffer.from(this._data));
  }

  public toString(): string {
    return `${Instruction.NAME} ${this.toUint8Array()}`;
  }

  protected getAdditionLen(): number {
    return 2 + 2 + 1 + 1 + 2;
  }

  protected fillingData() {
    const payload = this.getPayload();
    this._fillHead(payload.length);
    this._data.push(...payload);
    this._fillFoot();
  }

  protected _fillHead(payloadLen) {
    this._data.push(...this.header); // 2字节
    this._data.push(...InstructionTool.numToLoHi(this.getAdditionLen() + payloadLen)); // 2字节
    this._data.push(this.getModuleNum()); // 1字节
    this._data.push(this.getNum()); // 1字节
  }
  protected _fillFoot() {
    this._data.push(...this.footer); // 2字节
  }

  public getName() {
    return this.constructor["NAME"];
  }
  public getModuleNum() {
    return this.constructor["MODULE_NUM"];
  }
  public getNum() {
    return this.constructor["NUM"];
  }

  public isSync(): boolean {
    return !!this.constructor["IS_SYNC"];
  }

  public getSendNo(): number {
    return this._sendNo;
  }

  public getTimeout(): number {
    return this.constructor["TIMEOUT"];
  }

  protected abstract getPayload(): number[];
}
