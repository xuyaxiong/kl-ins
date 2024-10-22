import Ins from "./Ins";
import InsTools from "./instools";

export default abstract class SyncIns extends Ins {
  public static TIMEOUT: number;
  static syncInsClasses = new Map();

  private static registerSyncIns(subclass: any) {
    const constructor = subclass.constructor;
    const key = `${constructor.MODULE_NUM}-${constructor.NUM}`;
    this.syncInsClasses.set(key, subclass);
  }

  public static isSyncIns(moduleNum: number, num: number) {
    return this.syncInsClasses.has(`${moduleNum}-${num}`);
  }

  public static getSyncInsClass(moduleNum: number, num: number) {
    return this.syncInsClasses.get(`${moduleNum}-${num}`);
  }

  protected _sendNo: number; // 发送编号

  constructor() {
    super();
    SyncIns.registerSyncIns(this);
    this._sendNo = InsTools.getSendNo();
  }

  public isSync(): boolean {
    return true;
  }

  public getTimeout(): number {
    return (this.constructor as any).TIMEOUT;
  }

  public getSendNo(): number {
    return this._sendNo;
  }

  public getSendNoHex(): string {
    return `${this.getSendNo().toString(16).padStart(2, "0")}`;
  }

  public abstract parseRespData(data: number[] | Buffer): any;
}
