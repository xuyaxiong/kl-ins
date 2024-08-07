import { InstructionTools } from "./instools";
export abstract class Instruction {
  public static NAME: string;
  public static MODULE_NUM: number;
  public static NUM: number;
  public static IS_SYNC: boolean;
  public static TIMEOUT: number;

  private header = [0x55, 0xaa]; // 数据头
  private footer = [0x0d, 0x0a]; // 校验位
  private _data: number[];
  protected _sendNo: number; // 发送编号

  private isFilled = false; // 数据是否填充

  protected constructor() {
    this._data = [];
    this._sendNo = InstructionTools.getSendNo();
  }

  public toArr(): number[] {
    this.fillingData();
    return this._data;
  }

  public toUint8Array(): Uint8Array {
    this.fillingData();
    return new Uint8Array(Buffer.from(this._data));
  }

  public toString(): string {
    return `${this.getName()} ${this.toUint8Array()}`;
  }

  private getAdditionLen(): number {
    return 2 + 2 + 1 + 1 + 2;
  }

  public fillingData() {
    if (!this.isFilled) {
      console.log("调用 fillingData");
      this.isFilled = true;
      const payload = this.getPayload();
      this._fillHead(payload.length);
      this._data.push(...payload);
      this._fillFoot();
    }
  }

  private _fillHead(payloadLen: number) {
    this._data.push(...this.header); // 2字节
    this._data.push(
      ...InstructionTools.numToLoHi(this.getAdditionLen() + payloadLen)
    ); // 2字节
    this._data.push(this.getModuleNum()); // 1字节
    this._data.push(this.getNum()); // 1字节
  }
  private _fillFoot() {
    this._data.push(...this.footer); // 2字节
  }

  public getName() {
    return (this.constructor as any).NAME;
  }
  public getModuleNum() {
    return (this.constructor as any).MODULE_NUM;
  }
  public getNum() {
    return (this.constructor as any).NUM;
  }

  public isSync(): boolean {
    return !!(this.constructor as any).IS_SYNC;
  }

  public getSendNo(): number {
    return this._sendNo;
  }

  public getTimeout(): number {
    return (this.constructor as any).TIMEOUT;
  }

  protected abstract getPayload(): number[];
}
