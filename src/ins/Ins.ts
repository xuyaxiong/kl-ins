import InsTools from "./instools";
export default abstract class Ins {
  public static NAME: string;
  public static MODULE_NUM: number;
  public static NUM: number;
  public static TIMEOUT: number;

  private header = [0x55, 0xaa]; // 数据头
  private footer = [0x0d, 0x0a]; // 校验位
  private _data: number[];
  protected _sendNo: number; // 发送编号

  private isFilled = false; // 数据是否填充

  protected constructor() {
    this._data = [];
    this._sendNo = InsTools.getSendNo();
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

  public toHexString(): string {
    return InsTools.byteArrToHexStr(this.toArr());
  }

  private getAdditionLen(): number {
    return 2 + 2 + 1 + 1 + 2;
  }

  public fillingData() {
    if (!this.isFilled) {
      this.isFilled = true;
      const payload = this.getPayload();
      this._fillHead(payload.length);
      this._data.push(...payload);
      this._fillFoot();
    }
  }

  private _fillHead(payloadLen: number) {
    this._data.push(...this.header); // 2字节
    this._data.push(...InsTools.lenToLoHi(this.getAdditionLen() + payloadLen)); // 2字节
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
    return false;
  }

  public getSendNo(): number {
    return this._sendNo;
  }

  public getSendNoHex(): string {
    return `${this.getSendNo().toString(16).padStart(2, "0")}`;
  }

  public getTimeout(): number {
    return (this.constructor as any).TIMEOUT;
  }

  protected abstract getPayload(): number[];

  public detail(): string {
    return this.getName();
  }
}
