import Proxy from "./Proxy";
import TCPClient from "./TCPClient";
import SyncIns from "../ins/SyncIns";

export default class ClientProxy extends Proxy {
  public async connect() {
    await this.end.connect();
  }

  public constructor(name: string, host: string, port: number) {
    super();
    this.end = new TCPClient(name, { host, port }, async (data: Buffer) => {
      const { insData, modNum, insNum } = this.preprocessData(data);
      if (SyncIns.isSyncIns(modNum, insNum)) {
        const receiveSendNo = insData[6];
        if (this.getLatestSendNo() === receiveSendNo) {
          const resolve = this.getResolve();
          resolve?.(insData);
        }
      } else {
        if (this.reportDataHandler)
          await this.reportDataHandler({
            modNum,
            insNum,
            data: insData,
          });
      }
    });
  }
}
