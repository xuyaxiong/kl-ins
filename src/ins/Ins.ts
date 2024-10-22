import InsTools from "./instools";
export default abstract class Ins {
  public static NAME: string;
  public static MOD_NUM: number;
  public static INS_NUM: number;

  private header = [0x55, 0xaa]; // 数据头
  private footer = [0x0d, 0x0a]; // 校验位
  private _data: number[];

  private isFilled = false; // 数据是否填充

  protected constructor() {
    this._data = [];
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
    return (this.constructor as any).MOD_NUM;
  }
  public getNum() {
    return (this.constructor as any).INS_NUM;
  }

  public isSync(): boolean {
    return false;
  }

  protected abstract getPayload(): number[];

  public detail(): string {
    return this.getName();
  }
}
