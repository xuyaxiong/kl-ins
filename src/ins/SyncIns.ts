import Ins from "./Ins";

export default abstract class SyncIns extends Ins {
  static syncInsClasses = new Map();

  static registerSyncIns(subclass: any) {
    const constructor = subclass.constructor;
    const key = `${constructor.MODULE_NUM}-${constructor.NUM}`;
    this.syncInsClasses.set(key, subclass);
  }

  static isSyncIns(moduleNum: number, num: number) {
    return this.syncInsClasses.has(`${moduleNum}-${num}`);
  }

  constructor() {
    super();
    SyncIns.registerSyncIns(this);
  }

  public isSync(): boolean {
    return true;
  }
}
